export interface IEasyPostAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
  company?: string;
}

export interface IEasyPostParcel {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface IEasyPostShipment {
  from_address: IEasyPostAddress;
  to_address: IEasyPostAddress;
  parcel: IEasyPostParcel;
  reference?: string;
  carrier_accounts?: string[];
}

export interface IEasyPostPickup {
  address: IEasyPostAddress;
  shipment: string;
  min_datetime: string;
  max_datetime: string;
  instructions?: string;
  carrier_accounts?: string[];
}