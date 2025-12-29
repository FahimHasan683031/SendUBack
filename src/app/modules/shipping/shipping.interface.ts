import { Types } from 'mongoose'


export type ShippingStatus =
  | 'created'
  | 'paymentCompleted'
  | 'shipped'
  | 'delivered'

export interface IShippingAddress {
  placeName?: string
  name?: string
  street1: string
  street2?: string
  city: string
  state?: string
  postal_code?: string
  country: string
  phone?: string
  email: string
  countryName: string
}

export interface IParcel {
  itemType: string
  name: string
  description?: string
  length: number
  width: number
  height: number
  distance_unit: 'in' | 'cm'
  weight: number
  mass_unit: 'lb' | 'kg'
}

export interface IInsurance {
  isInsured: boolean
  productValue?: number
  insuranceCost?: number
}

export interface IShipping {
  _id: Types.ObjectId
  zoneName: string
  status: ShippingStatus
  address_from: IShippingAddress
  address_to: IShippingAddress
  images?: string[]
  parcel: IParcel[] | string[]
  selected_rate?: Types.ObjectId
  shipping_cost?: number
  insurance?: IInsurance
  total_cost?: number
  shippingLabel?: string
  tracking_id?: string
  tracking_url?: string
  carrier?: string
  lostItemId?: Types.ObjectId
  notes?: string
}


export interface IShippingCreateInput {
  address_from: IShippingAddress
  address_to: IShippingAddress
  parcel: { itemType: string; name: string; description?: string }[]
  insurance?: IInsurance
  notes?: string
  lostItemId?: string
}