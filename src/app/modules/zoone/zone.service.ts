import { Zone } from './zone.model';
import { IZone } from './zone.interface';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import QueryBuilder from '../../builder/QueryBuilder';

// CREATE zone
const createZone = async (payload: { name: string; countries: string[] }): Promise<IZone> => {
  // Check duplicate name
  const existingZone = await Zone.findOne({ name: payload.name });
  if (existingZone) {
    throw new ApiError(StatusCodes.CONFLICT, 'Zone name already exists');
  }

  // Get next ID
  const lastZone = await Zone.findOne().sort({ id: -1 }).limit(1);
  const nextId = lastZone ? lastZone.id + 1 : 1;

  // Check duplicate countries
  for (const country of payload.countries) {
    const countryInZone = await Zone.findOne({ countries: country.toUpperCase() });
    if (countryInZone) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        `Country ${country} already exists in zone "${countryInZone.name}"`
      );
    }
  }

  // Create zone
  const zoneData = {
    id: nextId,
    name: payload.name,
    countries: payload.countries.map(c => c.toUpperCase()),
  };

  return await Zone.create(zoneData);
};

// GET all zones
const getAllZones = async (query: Record<string, unknown>) => {
  const zonQuryBuilder = new QueryBuilder(Zone.find(), query)
    .filter()
    .search(['name', 'countries'])
    .sort()
    .paginate();
  const zones = await zonQuryBuilder.modelQuery;
  const paginateInfo = await zonQuryBuilder.getPaginationInfo();
  return { data: zones, meta: paginateInfo };
};

// GET zone by ID
const getZoneById = async (id: string): Promise<IZone> => {
  const zone = await Zone.findOne({ id: parseInt(id) });
  if (!zone) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Zone not found');
  }
  return zone;
};

// UPDATE zone
const updateZone = async (id: string, payload: Partial<IZone>): Promise<IZone> => {
  const zone = await Zone.findOne({ id: parseInt(id) });
  if (!zone) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Zone not found');
  }

  if (payload.countries) {
    payload.countries = payload.countries.map(c => c.toUpperCase());
  }

  const updatedZone = await Zone.findOneAndUpdate(
    { id: parseInt(id) },
    payload,
    { new: true, runValidators: true }
  );

  if (!updatedZone) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Zone not found');
  }

  return updatedZone;
};

// DELETE zone
const deleteZone = async (id: string): Promise<IZone> => {
  const zone = await Zone.findOneAndDelete({ id: parseInt(id) });
  if (!zone) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Zone not found');
  }
  return zone;
};

// GET zone by country code
const getZoneByCountry = async (countryCode: string): Promise<IZone | null> => {
  return await Zone.findOne({
    countries: countryCode.toUpperCase(),
    isActive: true
  });
};

// Helper: Seed initial zones
const seedInitialZones = async () => {
  const initialZones = [
    { id: 1, name: "UK & Near", countries: ["GB", "IM", "JE", "GG", "GI"] },
    { id: 2, name: "Europe Near", countries: ["AT", "BE", "CH", "DE", "DK", "ES", "FR", "IE", "IT", "LI", "LU", "MC", "NL", "PT", "AD", "SM", "VA"] },
    { id: 3, name: "Europe Far", countries: ["AL", "BA", "BG", "BY", "CY", "CZ", "EE", "FI", "GE", "GR", "HR", "HU", "IS", "LT", "LV", "MD", "ME", "MK", "MT", "NO", "PL", "RO", "RS", "RU", "SE", "SI", "SK", "TR", "UA", "XK", "AM", "AZ"] },
    { id: 4, name: "US & Canada", countries: ["US", "CA"] },
    { id: 5, name: "Americas (Non-US/CA)", countries: ["MX", "BZ", "GT", "SV", "HN", "NI", "CR", "PA", "BS", "BB", "CU", "DO", "HT", "JM", "TT", "AG", "DM", "GD", "KN", "LC", "VC", "AI", "AW", "BM", "BQ", "CW", "KY", "MS", "PR", "SX", "TC", "VG", "VI", "GP", "MQ", "BL", "MF", "AR", "BO", "BR", "CL", "CO", "EC", "FK", "GF", "GY", "PE", "PY", "SR", "UY", "VE"] },
    { id: 6, name: "Middle East", countries: ["AE", "SA", "QA", "KW", "OM", "BH", "YE", "IQ", "IR", "IL", "JO", "LB", "PS", "SY"] },
    { id: 7, name: "South & Central Asia", countries: ["AF", "PK", "IN", "BD", "NP", "LK", "BT", "MV", "KZ", "KG", "TJ", "TM", "UZ"] },
    { id: 8, name: "East & Southeast Asia", countries: ["CN", "HK", "MO", "TW", "JP", "KR", "KP", "MN", "SG", "TH", "VN", "MY", "ID", "PH", "BN", "KH", "LA", "MM", "TL"] },
    { id: 9, name: "Africa (North)", countries: ["DZ", "EG", "LY", "MA", "TN", "SD", "SS", "EH"] },
    { id: 10, name: "Africa (Sub-Saharan)", countries: ["AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "CD", "CI", "DJ", "GQ", "ER", "ET", "GA", "GM", "GH", "GN", "GW", "KE", "LS", "LR", "MG", "MW", "ML", "MR", "MU", "MZ", "NA", "NE", "NG", "RW", "SC", "SL", "SN", "SO", "ST", "SZ", "TZ", "TG", "UG", "ZM", "ZW", "ZA"] },
    { id: 11, name: "Oceania & Pacific", countries: ["AU", "NZ", "AS", "CK", "FJ", "FM", "GU", "KI", "MH", "MP", "NC", "NF", "NR", "NU", "PW", "PF", "PG", "PN", "SB", "TK", "TO", "TV", "VU", "WF", "WS", "UM"] },
    { id: 12, name: "Unlisted / Other", countries: ["AQ", "BV", "HM", "GS", "TF", "SJ", "IO", "CC", "CX"] },
  ];

  await Zone.deleteMany({});
  const zones = await Zone.insertMany(initialZones);

  return {
    message: 'Initial zones seeded',
    count: zones.length,
  };
};

export const zoneService = {
  createZone,
  getAllZones,
  getZoneById,
  updateZone,
  deleteZone,
  getZoneByCountry,
  seedInitialZones,
};