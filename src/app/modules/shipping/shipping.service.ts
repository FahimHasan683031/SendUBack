import { Shipping } from './shipping.model'
import { IShipping } from './shipping.interface'
import QueryBuilder from '../../builder/QueryBuilder'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { generateParcel } from '../../../utils/shippo-parcel.utils'
import { ZonePricingService } from '../InternationalShipmentRate/zonePricing.service'
import { royalMailService } from './royalmail.service'
import { getZoneByCountry } from '../../../utils/zone.utils'

// Helper function to calculate insurance cost (10% of product value)
const calculateInsuranceCost = (productValue: number): number => {
  return productValue * 0.1
}

// Helper function to get shipping rates based on type
const getShippingRates = async (shipingId:string) => {
  const shiping= await Shipping.findById(shipingId) 
  if(!shiping){
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }
  const { shipping_type, address_from, address_to, parcel } = shiping

  if (shipping_type === 'insideUk') {
    // Call Royal Mail API for UK domestic shipping
    const rates = await royalMailService.getRoyalMailRates({
      address_from,
      address_to,
      parcel: parcel as any[]
    })
    return rates
  } else if (shipping_type === 'international') {
    // Use zone pricing for international shipping
    const fromCountry = address_from.country
    const toCountry = address_to.country

    // Get shipping rates from zone pricing
    const rates = await ZonePricingService.getShippingRate(fromCountry, toCountry)

    return rates
  }

  throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid shipping type')
}

// Create shipping
const createShipping = async (payload: IShipping) => {
  try {
    const parcel = payload.parcel?.map(parcel =>
      generateParcel(parcel as string),
    ) || [generateParcel('Other')]
    payload.parcel = parcel

    // Determine shipping type based on countries
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

  const isExistShipping = await Shipping.findById(id)
  if(!isExistShipping){
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipping not found')
  }

  if(payload.selected_rate?.price){
    payload.total_cost=payload.selected_rate.price + (isExistShipping.insurance?.insuranceCost || 0),
    payload.shipping_cost=payload.selected_rate.price
  }
  if(payload.insurance?.isInsured && payload.insurance.productValue){
    const insuranceCost= calculateInsuranceCost(payload.insurance.productValue)
    payload.insurance.insuranceCost=insuranceCost
    payload.total_cost=(payload.selected_rate?.price || isExistShipping.shipping_cost || 0) + insuranceCost
  }
  const shipping = await Shipping.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

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
  getShippingByTrackingId,
  updateShipping,
  addTrackingInfo,
  deleteShipping,
  getShippingRates
}
