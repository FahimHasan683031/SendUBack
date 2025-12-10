// src/app/modules/payment/webhook.ts
import { Request, Response } from 'express'
import Stripe from 'stripe'
import stripe from '../../../config/stripe'
import config from '../../../config'
import { PaymentService } from './payment.service'
import { logger } from '../../../shared/logger'
import mongoose from 'mongoose'
import { Shipping } from '../shipping/shipping.model'
import { emailHelper } from '../../../helpers/emailHelper'
import { emailTemplate } from '../../../shared/emailTemplate'
import { User } from '../user/user.model'
import { LostItem } from '../lostItem/lostItem.model'
import { LOST_ITEM_STATUS } from '../lostItem/lostItem.interface'

const handleStripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string
  let event: Stripe.Event

  console.log('Received Stripe webhook')

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
    // -------------------------------
    // CHECKOUT SESSION COMPLETED
    // -------------------------------
    if (eventType === 'checkout.session.completed') {
      const session = await stripe.checkout.sessions.retrieve(data.id, {
        expand: ['payment_intent'],
      })

      const paymentIntent = session.payment_intent as Stripe.PaymentIntent
      console.log('PaymentIntent:', paymentIntent)

      // extracted data
      const email =
        session.customer_email || session.customer_details?.email || 'N/A'

      const amount = paymentIntent.amount / 100
      const transactionId = paymentIntent.id
      const customerName = session.customer_details?.name || 'N/A'
      const shippingId = session.metadata?.shipping_id

      // get shipping record
      const shipping = await Shipping.findById(shippingId)

      if (!shipping) {
        logger.error('Shipping not found for webhook:', shippingId)
        return res.sendStatus(200)
      }

      // Save Payment Record
      await PaymentService.createPayment({
        email,
        amount,
        dateTime: new Date(),
        transactionId,
        description: `Payment for ${shipping.shipping_type} shipment`,
        customerName,
        shippingId: new mongoose.Types.ObjectId(shippingId),
      })

      // Update shipping to paid/processing
      await Shipping.findByIdAndUpdate(shippingId, {
        status: 'paymentCompleted',
      })

      // Update lost item status to Shipment Booked
      if(shipping.lostItemId) {
        await LostItem.findByIdAndUpdate(
          { _id: shipping.lostItemId },
          { status: LOST_ITEM_STATUS.SHIPMENT_BOOKED },
        )
      }

      // Send confermation email andmin and also customer 
      setTimeout(async () => {
        try {
          const confirmationTemplate =
            emailTemplate.sendPaymentConfirmationEmail(shipping)
          await emailHelper.sendEmail(confirmationTemplate)

          const adminNotificationTemplate =
            emailTemplate.sendAdminPaymentNotificationEmail(shipping)
          await emailHelper.sendEmail(adminNotificationTemplate)
        } catch (err) {
          logger.error('Email sending failed:', err)
        }
      }, 0)

      // Send business email if user is registered or not
      if (await User.findOne({ email: shipping.address_from.email })) {
        console.log('User found for email:', shipping.address_from.email)
        setTimeout(async () => {
          try {
            const confirmationBusinessTemplate =
              emailTemplate.businessUserShipmentInfoEmail(shipping)
            await emailHelper.sendEmail(confirmationBusinessTemplate)
          } catch (err) {
            logger.error('Email sending failed:', err)
          }
        }, 0)
      } else {
        console.log('User not found for email:', shipping.address_from.email)
        setTimeout(async () => {
          try {
            const businessInviteTemplate =
              emailTemplate.businessUserRegistrationInviteEmail(shipping)
            await emailHelper.sendEmail(businessInviteTemplate)
          } catch (err) {
            logger.error('Email sending failed:', err)
          }
        }, 0)
      }

      logger.info(
        `Shipping payment saved for ${email}, transactionId: ${transactionId}`,
      )
    }
  } catch (error: any) {
    logger.error('Webhook handler error:', error)
    res.status(500).send('Webhook internal error')
    return
  }

  res.sendStatus(200)
}

export default handleStripeWebhook
