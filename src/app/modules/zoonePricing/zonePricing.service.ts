import QueryBuilder from "../../builder/QueryBuilder";
import { ZonePricing } from "./zonePricing.model";
import { IZonePricing } from "./zonePricing.interface";
import { getZoneByCountry } from "../zoone/zone.utils";
import { Zone } from "../zoone/zone.model";



// create zone pricing
const createZonePricing = async (payload: Partial<IZonePricing>) => {
  const zones = await Zone.find().select('id');
  const zoneIds = zones.map((zone) => zone.id);
  if (!zoneIds.includes(payload.fromZone) || !zoneIds.includes(payload.toZone)) {
    throw new Error("Invalid zone ids");
  }

  const isExist = await ZonePricing.findOne({
    fromZone: payload.fromZone,
    toZone: payload.toZone,
    shippingType: payload.shippingType,
  })
  if (isExist) {
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
const getShippingRate = async (from: string, to: string) => {


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

// seed all zone pricing
const seedAllZonePricing = async () => {
  // 1. Fetch all existing zones
  const zones = await Zone.find({}).sort({ id: 1 }); // Assuming 'id' is the zone number

  if (zones.length === 0) {
    throw new Error("No zones found. Please seed zones first.");
  }

  // 2. Clear existing zone pricing
  await ZonePricing.deleteMany({});

  const pricingData = [];

  // 3. Generate pricing for all combinations
  for (const fromZone of zones) {
    for (const toZone of zones) {
      const isSameZone = fromZone.id === toZone.id;
      // Simple distance logic: difference in IDs (just for variation)
      // If IDs are not numbers, this math might need adjustment, but usually zone IDs are 1, 2, 3...
      const distance = Math.abs((fromZone.id || 0) - (toZone.id || 0));

      // Standard Pricing
      let standardPrice = isSameZone ? 15 : 30 + (distance * 5);

      // Express Pricing
      let expressPrice = isSameZone ? 30 : 50 + (distance * 10);

      // Create Standard Record
      pricingData.push({
        title: `${fromZone.name} to ${toZone.name} - Standard`,
        fromZone: fromZone.id,
        toZone: toZone.id,
        shippingType: 'standard',
        price: parseFloat(standardPrice.toFixed(2)),
        duration: isSameZone ? '3-5 business days' : '7-14 business days',
        description: `Standard shipping from ${fromZone.name} to ${toZone.name}`
      });

      // Create Express Record
      pricingData.push({
        title: `${fromZone.name} to ${toZone.name} - Express`,
        fromZone: fromZone.id,
        toZone: toZone.id,
        shippingType: 'express',
        price: parseFloat(expressPrice.toFixed(2)),
        duration: isSameZone ? '1-2 business days' : '3-5 business days',
        description: `Express shipping from ${fromZone.name} to ${toZone.name}`
      });
    }
  }

  // 4. Bulk insert
  const result = await ZonePricing.insertMany(pricingData);

  return {
    totalZones: zones.length,
    totalPricingRecords: result.length,
    message: `Successfully seeded ${result.length} pricing records for ${zones.length} zones.`
  };
};


export const ZonePricingService = {
  createZonePricing,
  getZonePricings,
  getZonePricingById,
  deleteZonePricing,
  updateZonePricing,
  getShippingRate,
  seedAllZonePricing
};