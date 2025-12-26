import { Zone } from "./zone.model";
import { zoneService } from "./zone.service";


// Get zone ID by country code
export const getZoneByCountry = async (countryCode: string): Promise<number | undefined> => {
  try {
    const zone = await zoneService.getZoneByCountry(countryCode);
    return zone?.id;
  } catch (error) {
    console.error('Error getting zone by country:', error);
    return undefined;
  }
};

// Get all zones (for shipping service)
export const getAllZones = async () => {
  try {
    return await Zone.find();
  } catch (error) {
    console.error('Error getting all zones:', error);
    return [];
  }
};

// Check if country is in zone
export const isCountryInZone = async (countryCode: string, zoneId: number): Promise<boolean> => {
  try {
    const zone = await zoneService.getZoneById(zoneId.toString());
    return zone.countries.includes(countryCode.toUpperCase());
  } catch (error) {
    return false;
  }
};