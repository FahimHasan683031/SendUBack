import { Shipping } from './shipping.model'
import { IShipping } from './shipping.interface'
import QueryBuilder from '../../builder/QueryBuilder'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { generateParcel } from '../../../utils/shippo-parcel.utils'

// Create shipping
const createShipping = async (payload: IShipping) => {
  try {
    const parcel = payload.parcel?.map(parcel =>
      generateParcel(parcel as string),
    ) || [generateParcel('Other')]
    payload.parcel = parcel

    if (
      payload.address_from.country === 'UK' &&
      payload.address_to.country === 'UK'
    ) {
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

// Get shipping by order ID
const getShippingByOrderId = async (orderId: string) => {
  const shipping = await Shipping.findOne({ order_id: orderId })

  if (!shipping) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Shipping not found for this order',
    )
  }

  return shipping
}

// Get shipping by tracking ID
const getShippingByTrackingId = async (trackingId: string) => {
  const shipping = await Shipping.findOne({ tracking_id: trackingId })

  if (!shipping) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Shipping not found with this tracking ID',
    )
  }

  return shipping
}

// Update shipping
const updateShipping = async (id: string, payload: Partial<IShipping>) => {
  const shipping = await Shipping.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!shipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

  return shipping
}

// Update shipping status
const updateShippingStatus = async (
  id: string,
  status: IShipping['status'],
) => {
  const shipping = await Shipping.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  )

  if (!shipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

  return shipping
}

// Add shipping label
const addShippingLabel = async (id: string, shippingLabel: string) => {
  const shipping = await Shipping.findByIdAndUpdate(
    id,
    {
      shipping_label: shippingLabel,
      status: 'processing',
    },
    { new: true },
  )

  if (!shipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

  return shipping
}

// Add tracking information
const addTrackingInfo = async (
  id: string,
  trackingId: string,
  trackingUrl: string,
  carrier: string,
) => {
  const shipping = await Shipping.findByIdAndUpdate(
    id,
    {
      tracking_id: trackingId,
      tracking_url: trackingUrl,
      carrier: carrier,
      status: 'shipped',
    },
    { new: true },
  )

  if (!shipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
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
  getShippingByOrderId,
  getShippingByTrackingId,
  updateShipping,
  updateShippingStatus,
  addShippingLabel,
  addTrackingInfo,
  deleteShipping,
}
