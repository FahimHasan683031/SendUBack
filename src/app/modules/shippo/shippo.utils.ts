// src/modules/shippo/shippo.utils.ts
import axios, { AxiosInstance } from "axios";
import config from "../../../config";

const SHIPPO_BASE = process.env.SHIPPO_BASE_URL || "https://api.goshippo.com";
const SHIPPO_TOKEN = config.shippo.shippo_api_key || "";

if (!SHIPPO_TOKEN) {
  // for safety, don't throw here; but log
  console.warn("SHIPPO_TOKEN is not set. Shippo API calls will fail.");
}

const shippoClient: AxiosInstance = axios.create({
  baseURL: SHIPPO_BASE,
  headers: {
    Authorization: `ShippoToken ${SHIPPO_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

export const shippoRequest = async (method: "get" | "post" | "put" | "delete", path: string, data?: any) => {
  try {
    const resp = await shippoClient.request({
      method,
      url: path,
      data,
    });
    return resp.data;
  } catch (err: any) {
    // normalize error
    const message = err?.response?.data || err.message || "Shippo request failed";
    throw new Error(JSON.stringify({ message }));
  }
};
