// src/modules/shippo/shippo.service.ts

import { IAddressInput, IParcelInput, ICreateShipmentPayload, ICreateLabelResult } from "./shippo.interface";
import { shippoRequest } from "./shippo.utils";

/**
 * Address validation via Shippo: we will create an address object and ask Shippo to validate.
 * Shippo provides "validation" in address creation with "validate" param.
 */
export const validateAddress = async (address: IAddressInput) => {
  // Shippo expects keys: name, street1, street2, city, state, zip, country
  const payload = {
    ...address,
    validate: true, // ask shippo to validate
  };
  const res = await shippoRequest("post", "/addresses/", payload);
  // res.validation_results or res.is_valid may appear - return raw for caller
  return res;
};

/**
 * Create a parcel object (Shippo 'parcel')
 */
export const createParcel = async (parcel: IParcelInput) => {
  const payload = {
    length: parcel.length,
    width: parcel.width,
    height: parcel.height,
    distance_unit: parcel.distance_unit || "cm",
    weight: parcel.weight,
    mass_unit: parcel.mass_unit || "kg",
  };
  const res = await shippoRequest("post", "/parcels/", payload);
  return res;
};

/**
 * Get rates by creating a shipment draft (Shippo usually returns rates on shipment creation)
 * We will create a 'shipment' with address_from, address_to and parcels, and request rates.
 */
export const getRates = async (payload: ICreateShipmentPayload) => {
  const shipmentPayload = {
    address_from: payload.address_from,
    address_to: payload.address_to,
    parcels: payload.parcels,
    async: false, // wait for synchronous rate calculation
    // You can add "extra" params like customs_declaration for international shipments
  };
  const res = await shippoRequest("post", "/shipments/", shipmentPayload);
  // res.rates is expected array
  return res;
};

/**
 * Create a shipment and return available rates (similar to getRates but you may want to persist the shipment id)
 */
export const createShipment = async (payload: ICreateShipmentPayload) => {
  const res = await getRates(payload);
  // res will contain object_id (shipment id), rates etc.
  return res;
};

/**
 * Buy a label (Shippo calls it "transaction"): you must pass a rate object id
 * rate_object: the rate object returned in shipment.rates[].object_id (or id)
 */
export const buyLabel = async (rate_object_id: string, async = false) => {
  const payload = {
    rate: rate_object_id,
    async, // can ask shippo to process async (true) or sync (false)
  };
  const res = await shippoRequest("post", "/transactions/", payload);
  // res.status, res.label_url, res.tracking_number etc.
  return res;
};

/**
 * Download label: Shippo returns label_url(s) inside transaction response.
 * We can just return that URL to the client. If you want to proxy and download PDF to server, do it here.
 */
export const getLabelUrlFromTransaction = (transaction: any): string | null => {
  // transaction.label_url or transaction.label_urls.pdf?
  // Normalize common possibilities:
  if (!transaction) return null;
  if (transaction.label_url) return transaction.label_url;
  if (transaction.label_urls && transaction.label_urls.pdf) return transaction.label_urls.pdf;
  if (transaction.label_urls && transaction.label_urls.png) return transaction.label_urls.png;
  return null;
};

/**
 * Track shipment using Shippo tracking endpoint
 * You can either use tracking number + carrier to query Shippo tracking
 */
export const trackShipment = async (carrier: string, tracking_number: string) => {
  // Shippo tracking endpoint
  const path = `/tracks/${carrier}/${tracking_number}/`;
  const res = await shippoRequest("get", path);
  return res;
};
