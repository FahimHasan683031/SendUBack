// src/services/payment.service.ts (example)
import { StatusCodes } from "http-status-codes";
import ApiError from "../errors/ApiError";
import stripe from "../config/stripe";
import config from "../config";
import { ShippoShipment } from "../app/modules/shippo/shippo.model";

export const createCheckoutSession = async (shipmentId: string) => {
  const shipment = await ShippoShipment.findOne({ shippo_shipment_id: shipmentId });
  if (!shipment) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Shipment not found!");
  }

  if (!shipment.user_email) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Customer email missing");
  }

  const amount = shipment.selected_rate?.amount ? Math.round(Number(shipment.selected_rate.amount) * 100) : null;
  if (!amount) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid shipping amount");
  }

  // --- create session ---
  const session = await stripe.checkout.sessions.create({
    mode: "payment", // must be inside first arg
    customer_email: shipment.user_email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping Payment",
            description: `${shipment.selected_rate.provider} ${shipment.selected_rate.servicelevel?.display_name ?? ""}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${config.stripe.frontendUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.stripe.frontendUrl}/payments/cancel`,
    metadata: {
      shippo_shipment_id: shipment.shippo_shipment_id,
    },
  });

  return session.url;
};
