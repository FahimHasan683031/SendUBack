export const Zones = [
  { id: 1, name: "Europe Near", countries: ["AT","BE","DK","FR","DE","IE","IT","LU","NL","PT","ES","CH","MC","LI"] },
  { id: 2, name: "Europe Far", countries: ["GR","SE","PL","RO","IS","TR","BG","RS","HR","AL","GE","AM","AZ"] },
  { id: 3, name: "North America", countries: ["US","CA","MX"] },
  { id: 4, name: "Middle East & Asia", countries: ["AE","SA","IN","CN","JP","SG","TH","VN","PK","BD","KR","ID","MY","KZ"] },
  { id: 5, name: "Australia / Africa / Rest of World", countries: ["AU","NZ","ZA","NG","EG","BR","AR","CL","CO","JM"] },
  { id: 6, name: "United Kingdom", countries: ["GB"] }
];

export const ShippingTypes = ["standard", "express"] as const;

export type ShippingType = typeof ShippingTypes[number];

export interface IZone {
  id: number;
  name: string;
  countries: string[];
}

// Helper functions
export const getZoneByCountry = (countryCode: string): IZone | undefined => {
  return Zones.find(zone => 
    zone.countries.includes(countryCode.toUpperCase())
  );
};

export const getZoneById = (zoneId: number): IZone | undefined => {
  return Zones.find(zone => zone.id === zoneId);
};

export const getAllCountries = (): string[] => {
  return Zones.flatMap(zone => zone.countries);
};

export const formatCountryCode = (countryCode: string): string => {
  return countryCode.toUpperCase().trim();
};