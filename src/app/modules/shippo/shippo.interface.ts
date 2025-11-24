// src/modules/shippo/shippo.interface.ts
export interface IAddressInput {
  name?: string;
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string; // 'US','GB','DE' etc.
  email?: string;
  phone?: string;
}

export interface IParcelInput {
  length: number; // cm or inch depending on unit policy
  width: number;
  height: number;
  distance_unit?: 'in' | 'cm';
  weight: number;
  mass_unit?: 'lb' | 'kg';
}

export interface IRateOption {
  carrier: string; // "UPS", "USPS", etc.
  service_level: string; // e.g. "ground"
  amount: string; // "+12.34" or "12.34" depending on API; we normalize in service
  currency: string;
  object_id?: string; // rate id from Shippo
}

export interface ICreateShipmentPayload {
  address_from: IAddressInput;
  address_to: IAddressInput;
  parcels: IParcelInput[]; // one or more
  async?: boolean; // whether to async create
  // optional metadata
  metadata?: Record<string, any>;
}

export interface ICreateLabelResult {
  label_url: string; // pdf/png/zpl link
  tracking_number?: string;
  carrier?: string;
  servicelevel?: string;
  transaction_id?: string;
  object_id?: string; // shipment id
}
