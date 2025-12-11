import { Shipping } from './shipping.model'
import { IShipping } from './shipping.interface'
import QueryBuilder from '../../builder/QueryBuilder'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { generateParcel } from '../../../utils/shippo-parcel.utils'
import { ZonePricingService } from '../zoonePricing/zonePricing.service'
import { getZoneByCountry } from '../../../utils/zone.utils'
import { ZonePricing } from '../zoonePricing/zonePricing.model'
import { User } from '../user/user.model'
import { emailTemplate } from '../../../shared/emailTemplate'
import { emailHelper } from '../../../helpers/emailHelper'
import { logger } from '../../../shared/logger'

// Helto calculate insurance cost
const calculateInsuranceCost = (productValue: number): number => {
  return productValue * 0.1
}

// Create shipping
const createShipping = async (payload: IShipping) => {
  try {
    const parcel = payload.parcel?.map(parcel =>
      generateParcel(parcel as string),
    ) || [generateParcel('Other')]
    payload.parcel = parcel

    // Check if countries are valid
    const fromZone = getZoneByCountry(payload.address_from.country)
    const toZone = getZoneByCountry(payload.address_to.country)
    if (!fromZone || !toZone) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid country codes')
    }

    if (fromZone === toZone && fromZone.id === 6) {
      payload.shipping_type = 'insideUk'
    } else {
      payload.shipping_type = 'international'
    }

    const shipping = await Shipping.create(payload)
    return shipping
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

  const rates = await ZonePricingService.getShippingRate(
    address_from.country,
    address_to.country,
  )

  return rates
}

// Get all shippings
const getAllShippings = async (query: Record<string, unknown>) => {
  const shippingQueryBuilder = new QueryBuilder(Shipping.find(), query)
    .filter()
    .sort()
    .fields()
    .paginate()

  const totalShippings = await Shipping.countDocuments()
  const shippings = await shippingQueryBuilder.modelQuery

  return {
    shippings,
    total: totalShippings,
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
  const isExistShipping = await Shipping.findById(id)
  if (!isExistShipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

  if (payload.selected_rate) {
    const selectedRate = await ZonePricing.findById(
      payload.selected_rate,
    )
    if (!selectedRate) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Selected rate not found')
    }
    (payload.total_cost =
      selectedRate.price +
      (isExistShipping.insurance?.insuranceCost || 0)),
      (payload.shipping_cost = selectedRate.price),
      (payload.status = 'rateSelected')
  }
  if (payload.insurance?.isInsured && payload.insurance.productValue) {
    const insuranceCost = calculateInsuranceCost(payload.insurance.productValue)
    payload.insurance.insuranceCost = insuranceCost
    payload.total_cost =
      (isExistShipping.shipping_cost || 0) +
      insuranceCost
  }
  const shipping = await Shipping.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  return shipping
}


// Add shipping information
const addShippingInfo = async (
  id: string,
  payload: Partial<IShipping>,
) => {
  const shipping = await Shipping.findByIdAndUpdate(
    id,
    payload,
    { new: true },
  )

  if (!shipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

if(shipping.shippingLabel && shipping.tracking_id){
  setTimeout(() => {
    try {
      emailHelper.sendEmail(emailTemplate.businessShippingDetailsUpdateEmail(shipping))
      emailHelper.sendEmail(emailTemplate.customerShippingDetailsUpdateEmail(shipping))
    } catch (error) {
      logger.error('Failed to send business shipping details update email:', error)
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

export const shippingService = {
  createShipping,
  getAllShippings,
  getShippingById,
  updateShipping,
  deleteShipping,
  getShippingRates,
  addShippingInfo
}
