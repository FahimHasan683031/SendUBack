import EasyPost from '@easypost/api';
import { EasyPostShipment } from './easypost.model';
import { IEasyPostShipment, IEasyPostPickup } from './easypost.interface';
import ApiError from '../../../errors/ApiError';
import QueryBuilder from '../../builder/QueryBuilder';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';

// EasyPost client initialization
const apiKey = config.easypost?.api_key || process.env.EASYPOST_API_KEY;
if (!apiKey) {
  throw new Error('EasyPost API key is required');
}

const easypostClient = new EasyPost(apiKey);

// create shipment
const createShipment = async (payload: IEasyPostShipment) => {
  try {
    const shipment = await easypostClient.Shipment.create({
      from_address: payload.from_address,
      to_address: payload.to_address,
      parcel: payload.parcel,
      reference: payload.reference,
      carrier_accounts: payload.carrier_accounts
    });

    const dbShipment = await EasyPostShipment.create({
      easypost_shipment_id: shipment.id,
      from_address: payload.from_address,
      to_address: payload.to_address,
      parcel: payload.parcel,
      reference: payload.reference,
      rates: shipment.rates,
      status: 'created'
    });

    return {
      shipment: shipment,
      dbShipment: dbShipment
    };
  } catch (error: any) {
    console.error('Create shipment error:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
  }
};

// get all shipments
const getAllShipments = async (query: Record<string, unknown>) => {
  const shipmentQueryBuilder = new QueryBuilder(
    EasyPostShipment.find(), 
    query
  )
    .filter()
    .fields()

  const totalShipments = await EasyPostShipment.countDocuments();

  const shipments = await shipmentQueryBuilder.modelQuery;
  
  return {
    shipments,
    total: totalShipments
  };
};

// purchase label
const purchaseLabel = async (rateId: string, shipmentId: string) => {
  try {
    // First get the EasyPost shipment
    const shipment = await easypostClient.Shipment.retrieve(shipmentId);
    
    // Purchase the label
    const purchasedShipment = await shipment.buy(rateId);

    // Update database record
    const dbShipment = await EasyPostShipment.findOneAndUpdate(
      { easypost_shipment_id: shipmentId },
      { 
        selected_rate: purchasedShipment.selected_rate,
        tracking_code: purchasedShipment.tracking_code,
        postage_label: purchasedShipment.postage_label?.url,
        status: 'purchased'
      },
      { new: true }
    );

    return {
      shipment: purchasedShipment,
      dbShipment: dbShipment
    };
  } catch (error: any) {
    console.error('Purchase label error:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
  }
};

// create pickup
const createPickup = async (payload: IEasyPostPickup) => {
  try {
    const pickup = await easypostClient.Pickup.create({
      address: payload.address,
      shipment: payload.shipment,
      min_datetime: payload.min_datetime,
      max_datetime: payload.max_datetime,
      instructions: payload.instructions,
      carrier_accounts: payload.carrier_accounts
    });

    return pickup;
  } catch (error: any) {
    console.error('Create pickup error:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
  }
};

// track shipment
const trackShipment = async (trackingCode: string) => {
  try {
    const tracker = await easypostClient.Tracker.create({
      tracking_code: trackingCode
    });

    return tracker;
  } catch (error: any) {
    console.error('Track shipment error:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
  }
};

// validate address
const validateAddress = async (address: any) => {
  try {
    const verifiedAddress = await easypostClient.Address.createAndVerify(address);
    return verifiedAddress;
  } catch (error: any) {
    console.error('Validate address error:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
  }
};

// get shipment by id
const getShipmentById = async (id: string) => {
  const shipment = await EasyPostShipment.findById(id);
  
  if (!shipment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipment not found');
  }

  return shipment;
};

// update shipment
const updateShipment = async (id: string, payload: Partial<IEasyPostShipment>) => {
  const shipment = await EasyPostShipment.findByIdAndUpdate(
    id,
    payload,
    { new: true }
  );
  
  if (!shipment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipment not found');
  }

  return shipment;
};

// delete shipment
const deleteShipment = async (id: string) => {
  const shipment = await EasyPostShipment.findByIdAndDelete(id);
  
  if (!shipment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipment not found');
  }

  return shipment;
};

export const easypostService = {
  createShipment,
  getAllShipments,
  purchaseLabel,
  createPickup,
  trackShipment,
  validateAddress,
  getShipmentById,
  updateShipment,
  deleteShipment
};