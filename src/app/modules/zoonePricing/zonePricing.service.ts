import QueryBuilder from "../../builder/QueryBuilder";
import { ZonePricing } from "./zonePricing.model";
import { IZonePricing } from "./zonePricing.interface";
import { getZoneByCountry } from "../zoone/zone.utils";
import { Zone } from "../zoone/zone.model";



// create zone pricing
const createZonePricing = async (payload: Partial<IZonePricing>) => {
  const zones = await Zone.find().select('id');
  const zoneIds = zones.map((zone) => zone.id);
  if(!zoneIds.includes(payload.fromZone) || !zoneIds.includes(payload.toZone)){
    throw new Error("Invalid zone ids");
  }

    const isExist = await ZonePricing.findOne({
        fromZone: payload.fromZone,
        toZone: payload.toZone,
        shippingType: payload.shippingType,
    })
    if(isExist){
        isExist.set(payload);
        await isExist.save();
        return isExist;
    }
  const zonePricing = await ZonePricing.create(payload);
  return zonePricing;
};

// get all zone pricing
const getZonePricings = async (query: Record<string, unknown>) => {
  const zonePricingQueryBuilder = new QueryBuilder(ZonePricing.find(), query)
    .filter()
    .sort()
    .paginate();
  
  const zonePricings = await zonePricingQueryBuilder.modelQuery;
  const paginationInfo = await zonePricingQueryBuilder.getPaginationInfo();

  return {
    data: zonePricings,
    meta: paginationInfo,
  };
};

// get zone pricing by id
const getZonePricingById = async (id: string) => {
  const zonePricing = await ZonePricing.findById(id);
  return zonePricing;
};

// delete zone pricing
const deleteZonePricing = async (id: string) => {
  const zonePricing = await ZonePricing.findByIdAndDelete(id);
  return zonePricing;
};

// update zone pricing
const updateZonePricing = async (id: string, payload: Partial<IZonePricing>) => {
  const zonePricing = await ZonePricing.findByIdAndUpdate(id, payload, { 
    new: true,
    runValidators: true 
  });
  return zonePricing;
};

// calculate shipping rate
const getShippingRate = async (from:string,to:string) => {

  
  // Get zones for countries
  const fromZone = await getZoneByCountry(from);
  const toZone = await getZoneByCountry(to);
  
  if (!fromZone || !toZone) {
    throw new Error("Invalid country codes");
  }
  
  // Find pricing for the route
  const pricing = await ZonePricing.find({
    fromZone: fromZone,
    toZone: toZone,
  });
  
  if (!pricing) {
    throw new Error("No shipping rate available for this route");
  }
  
  return pricing
};


export const ZonePricingService = {
  createZonePricing,
  getZonePricings,
  getZonePricingById,
  deleteZonePricing,
  updateZonePricing,
  getShippingRate
};