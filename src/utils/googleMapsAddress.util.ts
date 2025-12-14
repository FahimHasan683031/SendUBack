import axios from "axios";
import config from "../config";

/* =========================
   Types for Google API
   ========================= */

interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GooglePlaceDetailsResult {
  formatted_address: string;
  address_components: GoogleAddressComponent[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GooglePlaceDetailsResponse {
  status: string;
  error_message?: string;
  result: GooglePlaceDetailsResult;
}

/* =========================
   Output type (your app)
   ========================= */

export interface ResolvedAddress {
  formatted_address: string;
  street: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  country_code: string | null;
  latitude: number;
  longitude: number;
}

/* =========================
   Utils Function
   ========================= */

const GOOGLE_MAPS_API_KEY = config.google_maps_api_key as string;

export const resolveAddressByPlaceId = async (
  placeId: string
): Promise<ResolvedAddress> => {
  if (!placeId) {
    throw new Error("placeId is required");
  }

  const response = await axios.get<GooglePlaceDetailsResponse>(
    "https://maps.googleapis.com/maps/api/place/details/json",
    {
      params: {
        place_id: placeId,
        fields: "address_component,formatted_address,geometry",
        key: GOOGLE_MAPS_API_KEY,
      },
    }
  );

  const data = response.data;

  if (data.status !== "OK") {
    throw new Error(
      data.error_message || "Failed to resolve address from Google Maps"
    );
  }

  const components = data.result.address_components;

  const findLong = (type: string): string | null =>
    components.find((c) => c.types.includes(type))?.long_name ?? null;

  const findShort = (type: string): string | null =>
    components.find((c) => c.types.includes(type))?.short_name ?? null;

  return {
    formatted_address: data.result.formatted_address,
    street: findLong("route"),
    city:
      findLong("locality") ||
      findLong("administrative_area_level_2"),
    state: findLong("administrative_area_level_1"),
    postal_code: findLong("postal_code"),
    country: findLong("country"),
    country_code: findShort("country"),
    latitude: data.result.geometry.location.lat,
    longitude: data.result.geometry.location.lng,
  };
};
