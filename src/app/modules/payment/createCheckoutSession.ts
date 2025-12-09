import { StatusCodes } from "http-status-codes";
import { Shipping } from "../shipping/shipping.model";
import ApiError from "../../../errors/ApiError";
import config from "../../../config";
import stripe from "../../../config/stripe";
import Stripe from "stripe";

export const createCheckoutSession = async (shippingId: string) => {
  // 1️⃣ Find shipping info
  const shipping = await Shipping.findById(shippingId).lean();

  if (!shipping) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Shipping data not found!");
  }

  // 2️⃣ Payment amount → use total_cost
  const amount = shipping.total_cost
    ? Math.round(Number(shipping.total_cost) * 100)
    : null;

  if (!amount) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid total cost");
  }

  // 3️⃣ Prepare session params
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    customer_email: shipping.address_to.email, // sender email
    line_items: [
      {
        price_data: {
          currency: shipping.currency || "GBP",
          product_data: {
            name: `Shipping: ${shipping.shipping_type.toUpperCase()}`,
            description: `From ${shipping.address_from.country} to ${shipping.address_to.country}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${config.stripe.frontendUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.stripe.frontendUrl}/payments/cancel`,

    metadata: {
      shipping_id: String(shipping._id),
      shipping_type: shipping.shipping_type,
      from_country: shipping.address_from.country,
      to_country: shipping.address_to.country,
      selected_rate: shipping.selected_rate && shipping.selected_rate ? String(shipping.selected_rate) : "N/A",
      total_cost: String(shipping.total_cost),
    },
  };

  // 4️⃣ Create session
  const session = await stripe.checkout.sessions.create(params);

  return session.url;
};
