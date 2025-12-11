export const Zones = [
  {
    id: 1,
    name: "Europe Near",
    countries: ["AT","BE","DK","FR","DE","IE","IT","LU","NL","PT","ES","CH","MC","LI"]
  },
  {
    id: 2,
    name: "Europe Far",
    countries: [
      "GR","SE","PL","RO","IS","TR","BG","RS","HR","AL","GE","AM","AZ",
      "NO","FI","CZ","SK","HU","EE","LV","LT","MD","MT","SI","BA","MK"
    ]
  },
  {
    id: 3,
    name: "North America",
    countries: ["US","CA","MX"]
  },
  {
    id: 4,
    name: "Middle East & Asia",
    countries: [
      "AE","SA","IN","CN","JP","SG","TH","VN","PK","BD","KR","ID","MY","KZ",
      "IQ","IL","JO","KW","LB","OM","QA","SY","YE","NP","LK","BT","MN","KH","LA","MM","TL","BN","MV","TJ","UZ","TM"
    ]
  },
  {
    id: 5,
    name: "Australia / Africa / Rest of World",
    countries: [
      "AU","NZ","ZA","NG","EG","BR","AR","CL","CO","JM",
      "DZ","AO","BJ","BW","BF","BI","CM","CV","CF","TD","KM","CG","CD","DJ","GQ","ER","ET","GA","GM","GH","GN","GW","KE","LS","LR","LY","MG","MW","ML","MR","MU","MA","MZ","NA","NE","RW","ST","SN","SC","SL","SO","SD","SZ","TZ","TG","TN","UG","ZM","ZW",
      "PE","VE","EC","UY","PY","BO","SR","GY","FK","HT","DO","CR","PA","NI","SV","GT","BS","BB","BZ","TT","LC","VC","GD","KN","AG","DM","MQ","CW","AW","SX","BQ","KY","VG","VI","GP","GF","PF","NC","WF","CK","VU","SB","TO","FJ","PG","NR","TV","WS","KI","MH","FM","PW"
    ]
  },
  {
    id: 6,
    name: "United Kingdom",
    countries: ["GB"]
  }
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