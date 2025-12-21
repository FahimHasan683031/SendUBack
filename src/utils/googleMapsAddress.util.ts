import axios from "axios";

export interface IShippingAddress {
  name?: string;
  street1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  countryCode: string;
}

/**
 * Map your UI types to Google Places types
 */
const TYPE_MAP: Record<string, string> = {
  hotel: "lodging",
  airport: "airport",
  "car rental": "car_rental",
  ship: "establishment",
  airbnb: "lodging",
  hospital: "hospital",
  "travel agency": "travel_agency",
  event: "establishment",
  museum: "museum",
  "intercity bus": "bus_station",
};

/**
 * Google Autocomplete Response Types
 */
interface GoogleAutocompletePrediction {
  description: string;
  place_id: string;
}

interface GoogleAutocompleteResponse {
  predictions: GoogleAutocompletePrediction[];
  status: string;
}

interface GooglePlaceAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GooglePlaceDetailsResult {
  name?: string;
  formatted_address?: string;
  address_components?: GooglePlaceAddressComponent[];
}

interface GooglePlaceDetailsResponse {
  result: GooglePlaceDetailsResult;
  status: string;
}

/**
 * Search shipping addresses dynamically by query and type
 */
export const searchLocationsByQuery = async (
  search: string,
  type?: string
): Promise<IShippingAddress[]> => {
  if (!search || search.trim().length === 0) return [];

  const googleType = type ? TYPE_MAP[type.toLowerCase()] || "address" : "address";

  // Autocomplete API
  const response = await axios.get<GoogleAutocompleteResponse>(
    "https://maps.googleapis.com/maps/api/place/autocomplete/json",
    {
      params: {
        input: search,
        key: process.env.GOOGLE_MAPS_API_KEY,
        types: googleType,
      },
    }
  );

  const predictions = response.data.predictions || [];
  if (!predictions.length) return [];

  // Fetch place details in parallel
  const addresses: (IShippingAddress | null)[] = await Promise.all(
    predictions.slice(0, 10).map(async (prediction) => {
      try {
        const detailsRes = await axios.get<GooglePlaceDetailsResponse>(
          "https://maps.googleapis.com/maps/api/place/details/json",
          {
            params: {
              place_id: prediction.place_id,
              key: process.env.GOOGLE_MAPS_API_KEY,
              fields: "address_component,formatted_address,name",
            },
          }
        );

        const result = detailsRes.data.result;
        const components = result.address_components || [];

        const street1 = result.formatted_address || "";
        const city =
          components.find((c) => c.types.includes("locality"))?.long_name ||
          components.find((c) => c.types.includes("sublocality"))?.long_name ||
          "";
        const state =
          components.find((c) => c.types.includes("administrative_area_level_1"))
            ?.long_name || "";
        const country =
          components.find((c) => c.types.includes("country"))?.long_name || "";
        const countryCode =
          components.find((c) => c.types.includes("country"))?.short_name || "";
        const postal_code =
          components.find((c) => c.types.includes("postal_code"))?.long_name || "";

        return {
          name: result.name || "",
          street1,
          city,
          state,
          postal_code,
          country,
          countryCode,
        } as IShippingAddress;
      } catch {
        return null;
      }
    })
  );

  // Filter out nulls
  return addresses.filter((a): a is IShippingAddress => a !== null);
};
