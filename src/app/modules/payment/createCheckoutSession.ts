import { StatusCodes } from "http-status-codes";
import { Quote } from "../quote/quote.model";
import ApiError from "../../../errors/ApiError";
import config from "../../../config";
import stripe from "../../../config/stripe";
import Stripe from "stripe";
import { IService } from "../service/service.interface";

export const createCheckoutSession = async (quoteId: string) => {
  const quote = await Quote.findOne({ _id: quoteId })
    .populate("serviceType")
    .lean();
  if (!quote) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Quote not found!");
  }

 
  const service = quote.serviceType as unknown as IService;
  const amount = service?.price ? Math.round(Number(service.price) * 100) : null;
  if (!amount) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid service price");
  }

  // --- create session ---
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    customer_email: quote.email as string,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: service.title,
            description: `${service.description}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${config.stripe.frontendUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.stripe.frontendUrl}/payments/cancel`,
    metadata: {
      quote_id: String(quote._id),
      service: service.title,
    },
  };

  const session = await stripe.checkout.sessions.create(params);

  return session.url;
};



