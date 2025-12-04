// src/app/modules/payment/webhook.ts
import { Request, Response } from 'express'
import Stripe from 'stripe'
import stripe from '../../../config/stripe'
import config from '../../../config'
import { PaymentService } from './payment.service'
import { logger } from '../../../shared/logger'
import { Quote } from '../quote/quote.model'
import { emailTemplate } from '../../../shared/emailTemplate'
import { emailHelper } from '../../../helpers/emailHelper'
import mongoose from 'mongoose'

const handleStripeWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const signature = req.headers['stripe-signature'] as string
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe.webhookSecret as string,
    )
  } catch (err: any) {
    logger.error('Webhook verification failed:', err.message)
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  const eventType = event.type
  const data = event.data.object as any

  try {
    if (eventType === 'checkout.session.completed') {
      // Retrieve session to get payment_intent details
      const session = await stripe.checkout.sessions.retrieve(data.id, {
        expand: ['payment_intent'],
      })
      const paymentIntent = session.payment_intent as Stripe.PaymentIntent

      // Extract required payment info
      const email = session.customer_email || session.customer_details?.email
      const amount = paymentIntent.amount / 100 // convert cents → dollars
      const transactionId = paymentIntent.id
      const customerName = session.customer_details?.name
      const description = session.metadata?.description || 'Stripe Payment'
      const service = session.metadata?.service || 'Shipping Payment'

      // Save payment using your PaymentService
      await PaymentService.createPayment({
        email: email as string,
        dateTime: new Date(),
        amount,
        transactionId,
        service: service as string,
        description: description as string,
        customerName: customerName as string,
        quoteId: new mongoose.Types.ObjectId(session.metadata?.quote_id),
      })

      const quote = await Quote.findById(session.metadata?.quote_id).populate(
        'serviceType',
      )

      // Update quote status to paid
      await Quote.findByIdAndUpdate(session.metadata?.quote_id, {
        status: 'paymentCompleted',
      })

      setTimeout(() => {
        // Send payment confirmation email
        const paymentConfirmationEmailTemplate =
          emailTemplate.sendPaymentConfirmationEmail(quote)
        emailHelper.sendEmail(paymentConfirmationEmailTemplate)

        // Send admin payment notification email
        const adminPaymentNotificationEmailTemplate =
          emailTemplate.sendAdminPaymentNotificationEmail(quote)
        emailHelper.sendEmail(adminPaymentNotificationEmailTemplate)
      }, 0)

      logger.info(`Payment saved for ${email}, transactionId: ${transactionId}`)
    }

    // You can handle other events here if needed
  } catch (error: any) {
    logger.error('Webhook handler error:', error)
    res.status(500).send('Webhook internal error')
    return
  }

  // Must return 200 to acknowledge receipt
  res.sendStatus(200)
}

export default handleStripeWebhook
