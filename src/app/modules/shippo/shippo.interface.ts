export type AddressType =
  | 'hotel'
  | 'airport'
  | 'car_rental'
  | 'ship'
  | 'airbnb'
  | 'hospital'
  | 'travel_agency'
  | 'event'
  | 'museum'
  | 'bus'
  | 'lost_property'
  | 'other'
  | 'to'


 export interface IShippingAddress {
  address_type: AddressType
  name: string       
  street1: string
  city: string
  state?: string
  zip: string
  country: string
  phone?: string
  email?: string
  room_number?: string
  reservation_name?: string
  check_out_date?: string
  airport_section?: string
  location_description?: string
  pickup_location?: string
  reference_code?: string
  trip_date?: string
  trip_from?: string
  trip_to?: string
  booking_reference?: string
  seat_number?: string
}




export interface IParcel {
  length: number
  width: number
  height: number
  distance_unit: 'in' | 'cm'
  weight: number
  mass_unit: 'lb' | 'kg'
}

export interface IShipment {
  address_from: IShippingAddress
  address_to: IShippingAddress
  parcels?: IParcel[]
  products?: string[]
  user_email?: string
  user_phone?: string
}

export interface IShippoShipment {
  shippo_shipment_id: string
  address_from: IShippingAddress
  address_to: IShippingAddress
  parcels: IParcel[]
  user_email?: string
  user_phone?: string
  rates?: any[]
  selected_rate?: any
  transaction_id?: string
  tracking_number?: string
  status: 'created' | 'rated' | 'purchased' | 'shipped' | 'delivered'
}
