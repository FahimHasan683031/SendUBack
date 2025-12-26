import { Shipping } from './shipping.model'
import { IShipping } from './shipping.interface'
import QueryBuilder from '../../builder/QueryBuilder'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { generateParcel } from '../../../utils/shippo-parcel.utils'
import { ZonePricingService } from '../zoonePricing/zonePricing.service'
import { ZonePricing } from '../zoonePricing/zonePricing.model'
import { emailTemplate } from '../../../shared/emailTemplate'
import { emailHelper } from '../../../helpers/emailHelper'
import { logger } from '../../../shared/logger'
import { SettingsService } from '../settings/settings.service'
import { JwtPayload } from 'jsonwebtoken'
import { USER_ROLES } from '../user/user.interface'
import { getZoneByCountry } from '../zoone/zone.utils'
import { Zone } from '../zoone/zone.model'
import { searchLocationsByQuery } from '../../../utils/googleMapsAddress.util'


// Create shipping
const createShipping = async (payload: IShipping) => {
  try {
    const parcel = payload.parcel?.map(parcel =>
      generateParcel(parcel as string),
    ) || [generateParcel('Other')]
    payload.parcel = parcel

    // Check if countries are valid
    const fromZone = await getZoneByCountry(payload.address_from.country)
    const toZone = await getZoneByCountry(payload.address_to.country)
    if (!fromZone || !toZone) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid country codes')
    }

    if (fromZone === toZone) {

      const zone = await Zone.findOne({id: fromZone})
      payload.zoneName = zone?.name || ''
    }  else {
      payload.zoneName = 'international'
    }


    const shipping = await Shipping.create(payload)
    return shipping
    // return adddressDetails
  } catch (error: any) {
    console.error('Create shipping error:', error)
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

// Get shipping rates
const getShippingRates = async (shipingId: string) => {
  const shiping = await Shipping.findById(shipingId)
  if (!shiping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }
  const { address_from, address_to } = shiping
  console.log(address_from.country, address_to.country)

  const rates = await ZonePricingService.getShippingRate(
    address_from.country,
    address_to.country,
  )
  if (!rates) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping rates not found')
  }

  return rates
}

// Get all shippings
const getAllShippings = async (query: Record<string, unknown>, user: JwtPayload) => {
  if (user.role === USER_ROLES.Business) {
    query['address_from.email'] = user.email;
  }


  const shippingQueryBuilder = new QueryBuilder(Shipping.find(), query)
    .search([
      'address_from',
      'address_to',
      'tracking_id',
      '_id',
      'address_to.email',
      'address_from.email',
      'address_from.name',
      'address_to.name',
    ])
    .filter()
    .sort()
    .fields()
    .paginate()

  const shippings = await shippingQueryBuilder.modelQuery
  const paginationInfo = await shippingQueryBuilder.getPaginationInfo()

  return {
    shippings,
    meta: paginationInfo,
  }
}

// Get shipping by ID
const getShippingById = async (id: string) => {
  const shipping = await Shipping.findById(id)

  if (!shipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

  return shipping
}

// Update shipping
const updateShipping = async (id: string, payload: Partial<IShipping>) => {
  // Check if shipping exists
  const isExistShipping = await Shipping.findById(id)
  if (!isExistShipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

  if (payload.selected_rate || payload.insurance) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot update selected rate or insurance',
    )
  }

  const shipping = await Shipping.findByIdAndUpdate(id, payload, { new: true })

  if (!shipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

  return shipping
}

// Add shipping rate OR insurance
const addShippingRateORInsurance = async (
  id: string,
  payload: Partial<IShipping>,
) => {
  const isExistShipping = await Shipping.findById(id)
  if (!isExistShipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }
  // Update selected rate
  if (payload.selected_rate) {
    const selectedRate = await ZonePricing.findById(payload.selected_rate)
    if (!selectedRate) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Selected rate not found')
    }
    const fromZone = await getZoneByCountry(isExistShipping.address_from.country)
    const toZone = await getZoneByCountry(isExistShipping.address_to.country)

    if (fromZone !== selectedRate.fromZone || toZone !== selectedRate.toZone) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Invalid Rate for selected country',
      )
    }
    ;(payload.total_cost =
      selectedRate.price + (isExistShipping.insurance?.insuranceCost || 0)),
      (payload.shipping_cost = selectedRate.price),
      (payload.status = 'rateSelected')
  }
  // Update insurance cost
  if (payload.insurance?.isInsured && payload.insurance.productValue) {
    const settings = await SettingsService.getSettings()
    if (!settings) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Settings not found')
    }
    const { insurance } = settings
    // check if product value exceeds max insurance value
    if(payload.insurance.productValue > insurance.maxValue){
      throw new ApiError(StatusCodes.BAD_REQUEST, `Product value must be less than or equal to ${insurance.maxValue}`)
    }
    const insuranceCost = (payload.insurance.productValue / 100) * insurance.percentage
    payload.insurance.insuranceCost = insuranceCost
    payload.total_cost = (isExistShipping.shipping_cost || 0) + insuranceCost
  }

  const shipping = await Shipping.findByIdAndUpdate(id, payload, { new: true })
  return shipping
}

// Add shipping information
const addShippingInfo = async (id: string, payload: Partial<IShipping>) => {
  payload.status = 'shipped'
  const shipping = await Shipping.findByIdAndUpdate(id, payload, { new: true })

  if (!shipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

  if (shipping.shippingLabel && shipping.tracking_id) {
    setTimeout(() => {
      try {
        emailHelper.sendEmail(
          emailTemplate.businessShippingDetailsUpdateEmail(shipping),
        )
        emailHelper.sendEmail(
          emailTemplate.customerShippingDetailsUpdateEmail(shipping),
        )
      } catch (error) {
        logger.error(
          'Failed to send business shipping details update email:',
          error,
        )
      }
    }, 0)
  }

  return shipping
}

// Delete shipping
const deleteShipping = async (id: string) => {
  const shipping = await Shipping.findByIdAndDelete(id)

  if (!shipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

  return shipping
}


// search locations using google maps api
const searchLocations = async (search: string, type?: string) => {
  const locations = await searchLocationsByQuery(search, type)
  return locations
}

export const shippingService = {
  createShipping,
  getAllShippings,
  getShippingById,
  updateShipping,
  addShippingRateORInsurance,
  deleteShipping,
  getShippingRates,
  addShippingInfo,
  searchLocations
}
