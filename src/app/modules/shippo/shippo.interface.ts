export interface IShippingAddress {
  name: string;
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface IParcel {
  length: number;
  width: number;
  height: number;
  distance_unit: 'in' | 'cm';
  weight: number;
  mass_unit: 'lb' | 'kg';
}

export interface IShipment {
  address_from: IShippingAddress;
  address_to: IShippingAddress;
  parcels?: IParcel[];
  product_type?: string;
  user_email?: string;
  user_phone?: string;
}

export interface IShippoShipment {
  shippo_shipment_id: string;
  address_from: IShippingAddress;
  address_to: IShippingAddress;
  parcels: IParcel[];
  user_email?: string;
  user_phone?: string;
  rates?: any[];
  selected_rate?: any;
  transaction_id?: string;
  tracking_number?: string;
  status: 'created' | 'rated' | 'purchased' | 'shipped' | 'delivered';
}