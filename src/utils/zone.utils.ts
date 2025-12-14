import { getZoneByCountry } from "../app/modules/zoone/zone.utils";

export const Zones = [
  {
    id: 1,
    name: "UK & Near (GB + Crown Dependencies)",
    countries: ["GB", "IM", "JE", "GG", "GI"]
  },
  {
    id: 2,
    name: "Europe Near",
    countries: [
      "AT","BE","CH","DE","DK","ES","FR","IE","IT","LI","LU","MC","NL","PT",
      "AD","SM","VA"
    ]
  },
  {
    id: 3,
    name: "Europe Far",
    countries: [
      "AL","BA","BG","BY","CY","CZ","EE","FI","GE","GR","HR","HU","IS","LT","LV",
      "MD","ME","MK","MT","NO","PL","RO","RS","RU","SE","SI","SK","TR","UA","XK",
      "AM","AZ"
    ]
  },
  {
    id: 4,
    name: "US & Canada",
    countries: ["US", "CA"]
  },
  {
    id: 5,
    name: "Americas (Non-US/CA)",
    countries: [
      "MX","BZ","GT","SV","HN","NI","CR","PA",
      "BS","BB","CU","DO","HT","JM","TT","AG","DM","GD","KN","LC","VC",
      "AI","AW","BM","BQ","CW","KY","MS","PR","SX","TC","VG","VI","GP","MQ","BL","MF",
      "AR","BO","BR","CL","CO","EC","FK","GF","GY","PE","PY","SR","UY","VE"
    ]
  },
  {
    id: 6,
    name: "Middle East",
    countries: [
      "AE","SA","QA","KW","OM","BH","YE",
      "IQ","IR","IL","JO","LB","PS","SY"
    ]
  },
  {
    id: 7,
    name: "South & Central Asia",
    countries: [
      "AF","PK","IN","BD","NP","LK","BT","MV",
      "KZ","KG","TJ","TM","UZ"
    ]
  },
  {
    id: 8,
    name: "East & Southeast Asia",
    countries: [
      "CN","HK","MO","TW","JP","KR","KP","MN",
      "SG","TH","VN","MY","ID","PH","BN","KH","LA","MM","TL"
    ]
  },
  {
    id: 9,
    name: "Africa (North)",
    countries: ["DZ","EG","LY","MA","TN","SD","SS","EH"]
  },
  {
    id: 10,
    name: "Africa (Sub-Saharan)",
    countries: [
      "AO","BJ","BW","BF","BI","CM","CV","CF","TD","KM","CG","CD","CI","DJ","GQ","ER",
      "ET","GA","GM","GH","GN","GW","KE","LS","LR","MG","MW","ML","MR","MU","MZ","NA",
      "NE","NG","RW","SC","SL","SN","SO","ST","SZ","TZ","TG","UG","ZM","ZW","ZA"
    ]
  },
  {
    id: 11,
    name: "Oceania & Pacific",
    countries: [
      "AU","NZ","AS","CK","FJ","FM","GU","KI","MH","MP","NC","NF","NR","NU","PW","PF",
      "PG","PN","SB","TK","TO","TV","VU","WF","WS","UM"
    ]
  },
  {
    id: 12,
    name: "Unlisted / Other (Fallback)",
    countries: ["AQ","BV","HM","GS","TF","SJ","IO","CC","CX"]
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
export const getZoneByCountrycode = async (countryCode: string) => {
  const id = await getZoneByCountry(countryCode);
  // return Zones.find(zone => 
  //   zone.countries.includes(countryCode.toUpperCase())
  // )?.id;

  console.log(countryCode, id);

  return id;
};