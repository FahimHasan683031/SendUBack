import { ShippoShipment } from './shippo.model';
import { IShipment } from './shippo.interface';
import ApiError from '../../../errors/ApiError';
import QueryBuilder from '../../builder/QueryBuilder';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';
import { generateParcel } from '../../../utils/shippo-parcel.utils';

// Direct API calls using fetch/axios
const SHIPPO_BASE_URL = 'https://api.goshippo.com';
const SHIPPO_API_KEY = config.shippo.shippo_api_key;

const shippoRequest = async (endpoint: string, options: any = {}) => {
  try {
    const url = `${SHIPPO_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Authorization': `ShippoToken ${SHIPPO_API_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Shippo API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Shippo API request failed:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
  }
};

// create shipment
const createShipment = async (payload: IShipment) => {
  try {
    const parcel = payload.products?.map(product => generateParcel(product)) || [generateParcel('Other')];
    payload.parcels = parcel;

  



    const shipment = await shippoRequest('/shipments', {
      method: 'POST',
      body: payload,
    });
    
    const dbShipment = await ShippoShipment.create({
      shippo_shipment_id: shipment.object_id,
      address_from: payload.address_from,
      address_to: payload.address_to,
      parcels: payload.parcels,
      user_email: payload.user_email,
      user_phone: payload.user_phone,
      status: 'created'
    });

    return dbShipment;
  } catch (error: any) {
    console.error('Create shipment error:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
  }
};

// get shipping rates
const getShippingRates = async (shipmentId: string) => {
  try {
    const rates = await shippoRequest(`/shipments/${shipmentId}/rates`);
    
    await ShippoShipment.findOneAndUpdate(
      { shippo_shipment_id: shipmentId },
      { rates: rates.results, status: 'rated' }
    );

    return rates;
  } catch (error: any) {
    console.error('Get rates error:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
  }
};

// select rate
const selectRate = async (shipmentId: string, rateId: string) => {
  try {
    const shipment = await ShippoShipment.findOne({ shippo_shipment_id: shipmentId });
    if (!shipment) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Shipment not found');
    }

    const selectedRate = shipment.rates?.find(rate => rate.object_id === rateId);
    if (!selectedRate) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid rate selection');
    }

    await ShippoShipment.findOneAndUpdate(
      { shippo_shipment_id: shipmentId },
      { selected_rate: selectedRate, rates:[] }
    );

    return selectedRate;
  } catch (error: any) {
    console.error('Select rate error:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
  }
};

// purchase label
const purchaseLabel = async (rateId: string, shipmentId: string) => {
  try {
    const transaction = await shippoRequest('/transactions', {
      method: 'POST',
      body: {
        rate: rateId,
        label_file_type: 'PDF',
        async: false
      },
    });

    await ShippoShipment.findOneAndUpdate(
      { shippo_shipment_id: shipmentId },
      { 
        transaction_id: transaction.object_id,
        tracking_number: transaction.tracking_number,
        selected_rate: transaction.rate,
        status: 'purchased'
      }
    );

    return transaction;
  } catch (error: any) {
    console.error('Purchase label error:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
  }
};

// validate address - Correct version
const validateAddress = async (address: any) => {
  try {
    const validatedAddress = await shippoRequest('/addresses', {
      method: 'POST',
      body: {
        ...address,
        validate: true // This enables proper validation
      },
    });
    
    // Return the raw response - Shippo provides validation_results in the response
    return validatedAddress;
  } catch (error: any) {
    console.error('Validate address error:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
  }
};

// track shipment - Final working version
const trackShipment = async (carrier: string, trackingNumber: string) => {
  try {
    console.log(`Tracking request: ${carrier} - ${trackingNumber}`);
    
    // In test mode, only 'shippo' carrier works
    let effectiveCarrier = carrier;
    let effectiveTrackingNumber = trackingNumber;
    
    if (config.node_env === 'development' || config.node_env === 'test') {
      effectiveCarrier = 'shippo';
      
      // Map real carriers to Shippo test tracking numbers
      const testTrackingMap: { [key: string]: string } = {
        'usps': 'SHIPPO_TRANSIT',
        'fedex': 'SHIPPO_DELIVERED', 
        'ups': 'SHIPPO_PRE_TRANSIT',
        'dhl': 'SHIPPO_TRANSIT',
        'shippo': 'SHIPPO_TRANSIT'
      };
      
      effectiveTrackingNumber = testTrackingMap[carrier.toLowerCase()] || 'SHIPPO_TRANSIT';
      
      console.log(`Test mode: Using ${effectiveCarrier} - ${effectiveTrackingNumber} instead of ${carrier} - ${trackingNumber}`);
    }
    
    const tracking = await shippoRequest('/tracks', {
      method: 'POST',
      body: {
        carrier: effectiveCarrier,
        tracking_number: effectiveTrackingNumber
      },
    });
    
    // Add original request info for reference in test mode
    if (config.node_env === 'development' || config.node_env === 'test') {
      return {
        ...tracking,
        original_request: {
          carrier: carrier,
          tracking_number: trackingNumber
        },
        test_mode: true,
        note: "Using Shippo test tracking - real carriers not available in test mode"
      };
    }
    
    return tracking;
  } catch (error: any) {
    console.error('Track shipment error:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
  }
};

// get all shipments
const getAllShipments = async (query: Record<string, unknown>) => {
  const shipmentQueryBuilder = new QueryBuilder(
    ShippoShipment.find(), 
    query
  )
    .filter()
    .fields()

  const totalShipments = await ShippoShipment.countDocuments();

  const shipments = await shipmentQueryBuilder.modelQuery;
  
  return {
    shipments,
    total: totalShipments
  };
};

// get shipment by id
const getShipmentById = async (id: string) => {

  const shipment = await ShippoShipment.findOne({ shippo_shipment_id: id });
  
  if (!shipment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipment not found');
  }

  return shipment;
};

// update shipment
const updateShipment = async (id: string, payload: Partial<IShipment>) => {
  const shipment = await ShippoShipment.findByIdAndUpdate(
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
  const shipment = await ShippoShipment.findByIdAndDelete(id);
  
  if (!shipment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Shipment not found');
  }

  return shipment;
};

export const shippoService = {
  createShipment,
  getAllShipments,
  getShippingRates,
  purchaseLabel,
  validateAddress,
  trackShipment,
  getShipmentById,
  updateShipment,
  deleteShipment,
  selectRate
};