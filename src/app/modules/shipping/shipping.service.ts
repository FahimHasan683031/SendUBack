import { Shipping } from './shipping.model'
import { IShipping, SHIPPING_STATUS } from './shipping.interface'
import QueryBuilder from '../../builder/QueryBuilder'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { generateParcel } from '../../../utils/parcel.utils'
import { ZonePricingService } from '../zoonePricing/zonePricing.service'
import { ZonePricing } from '../zoonePricing/zonePricing.model'
import { emailTemplate } from '../../../shared/emailTemplate'
import { emailHelper } from '../../../helpers/emailHelper'
import { logger } from '../../../shared/logger'
import { SettingsService } from '../settings/settings.service'
import { JwtPayload } from 'jsonwebtoken'
import { USER_ROLES } from '../user/user.interface'
import { Zone } from '../zoone/zone.model'
import { searchLocationsByQuery } from '../../../utils/googleMapsAddress.util'
import { getZoneByCountry } from '../zoone/zone.utils'
import { LostItem } from '../lostItem/lostItem.model'
import { LOST_ITEM_STATUS } from '../lostItem/lostItem.interface'

// Create shipping
const createShipping = async (payload: IShipping) => {
  try {
    const parcel = payload.parcel?.map((p: any) =>
      generateParcel({
        itemType: p.itemType,
        name: p.name,
        description: p.description,
      }),
    ) || [generateParcel({ itemType: 'Other', name: 'Other' })]
    payload.parcel = parcel

    // Check if countries are valid
    const fromZone = await getZoneByCountry(payload.address_from.country)
    const toZone = await getZoneByCountry(payload.address_to.country)
    if (!fromZone || !toZone) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid country codes')
    }

    if (fromZone === toZone) {
      const zone = await Zone.findOne({ id: fromZone })
      payload.zoneName = zone?.name || ''
    } else {
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
const getAllShippings = async (
  query: Record<string, unknown>,
  user: JwtPayload,
) => {
  if (user.role === USER_ROLES.BUSINESS) {
    query['address_from.email'] = user.email
  }

  const shippingQueryBuilder = new QueryBuilder(
    Shipping.find().populate([
      {
        path: 'lostItemId',
        populate: [
          {
            path: 'property',
          },
          {
            path: 'user',
            select: '-password -authentication -__v',
          },
        ],
      },
    ]),
    query,
  )
    .search([
      'address_from.email',
      'address_from.countryName',
      'address_from.phone',
      'address_from.street1',
      'address_to.email',
      'address_to.countryName',
      'address_to.phone',
      'address_to.street1',
      'tracking_id',
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
  const shipping = await Shipping.findById(id).populate([
    {
      path: 'lostItemId',
      populate: [
        {
          path: 'property',
        },
        {
          path: 'user',
          select: '-password -authentication -__v',
        },
      ],
    },
  ])

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
  if (!payload || !id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid payload or id')
  }

  const shipping = await Shipping.findById(id)
  if (!shipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

  let shippingCost = shipping.shipping_cost || 0
  let insuranceCost = shipping.insurance?.insuranceCost || 0

  const updateQuery: any = {}

  /* =======================
     RATE UPDATE
  ======================== */
  if (payload.selected_rate) {
    const selectedRate = await ZonePricing.findById(payload.selected_rate)
    if (!selectedRate) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Selected rate not found')
    }

    const fromZone = await getZoneByCountry(shipping.address_from.country)
    const toZone = await getZoneByCountry(shipping.address_to.country)

    if (fromZone !== selectedRate.fromZone || toZone !== selectedRate.toZone) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Invalid Rate for selected country',
      )
    }

    shippingCost = selectedRate.price
    updateQuery.shipping_cost = shippingCost
    updateQuery.selected_rate = payload.selected_rate
  }

  /* =======================
     INSURANCE ADD
  ======================== */
  if (payload.insurance?.isInsured === true) {
    if (!payload.insurance.productValue) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Product value is required for insurance',
      )
    }

    const settings = await SettingsService.getSettings()
    if (!settings) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Settings not found')
    }

    const { insurance } = settings

    if (payload.insurance.productValue > insurance.maxValue) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Product value must be less than or equal to ${insurance.maxValue}`,
      )
    }

    insuranceCost =
      (payload.insurance.productValue / 100) * insurance.percentage

    updateQuery.insurance = {
      isInsured: true,
      productValue: payload.insurance.productValue,
      insuranceCost,
    }
  }

  /* =======================
     INSURANCE REMOVE (FIELD DELETE)
  ======================== */
  if (payload.insurance?.isInsured === false) {
    insuranceCost = 0

    updateQuery.$unset = {
      insurance: 1,
    }
  }

  /* =======================
     TOTAL COST RECALC
  ======================== */
  updateQuery.total_cost = shippingCost + insuranceCost

  const updatedShipping = await Shipping.findByIdAndUpdate(id, updateQuery, {
    new: true,
  })

  return updatedShipping
}

// Add shipping information
const addShippingInfo = async (id: string, payload: Partial<IShipping>) => {
  payload.status = SHIPPING_STATUS.IN_TRANSIT
    ; (payload as any)['currentState.courierBooked'] = true
  const shipping = await Shipping.findByIdAndUpdate(id, payload, { new: true })

  if (!shipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

  await LostItem.findByIdAndUpdate(shipping.lostItemId, {
    status: LOST_ITEM_STATUS.WITHCOURIER,
    'currentState.courierBooked': true,
  })

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

// mark as delivered
const markAsDelivered = async (id: string) => {
  const isExistShipping = await Shipping.findById(id)
  if (!isExistShipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

  const result = await Shipping.findByIdAndUpdate(
    id,
    {
      $set: {
        status: SHIPPING_STATUS.DELIVERED,
        'currentState.delivered': true,
      },
    },
    { new: true },
  )

  if (result?.lostItemId) {
    await LostItem.findByIdAndUpdate(result.lostItemId, {
      $set: {
        status: LOST_ITEM_STATUS.DELIVERED,
        'currentState.delivered': true,
      },
    })
  }

  return result
}

const getAllShippingsForExport = async (user: JwtPayload) => {
  const filter: any = {}
  if (user.role === USER_ROLES.BUSINESS) {
    filter['address_from.email'] = user.email
  }

  return await Shipping.find(filter).populate('lostItemId').lean()
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
  searchLocations,
  markAsDelivered,
  getAllShippingsForExport,
}
