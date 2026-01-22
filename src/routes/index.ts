import { UserRoutes } from '../app/modules/user/user.route'
import { AuthRoutes } from '../app/modules/auth/auth.route'
import express, { Router } from 'express'
import { PublicRoutes } from '../app/modules/public/public.route'
import { LostItemRoutes } from '../app/modules/lostItem/lostItem.route'
import { CategoryRoutes } from '../app/modules/category/category.route'
import { zonePricingRoutes } from '../app/modules/zoonePricing/zonePricing.route'
import { shippingRoutes } from '../app/modules/shipping/shipping.route'
import { PaymentRouts } from '../app/modules/payment/payment.route'
import { SettingsRoutes } from '../app/modules/settings/settings.route'
import { ReviewRoutes } from '../app/modules/review/review.route'
import { DashboardRoutes } from '../app/modules/dashboard/dashboard.route'
import { zoneRoutes } from '../app/modules/zoone/zone.routes'
import { PropertyRoutes } from '../app/modules/property/property.route'




const router = express.Router()

const apiRoutes: { path: string; route: Router }[] = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/public', route: PublicRoutes },
  { path: '/lost-item', route: LostItemRoutes },
  { path: '/category', route: CategoryRoutes },
  { path: '/zone-pricing', route: zonePricingRoutes },
  { path: '/shipping', route: shippingRoutes },
  { path: '/payment', route: PaymentRouts },
  { path: '/settings', route: SettingsRoutes },
  { path: '/review', route: ReviewRoutes },
  { path: '/dashboard', route: DashboardRoutes },
  { path: '/zone', route: zoneRoutes },
  { path: '/property', route: PropertyRoutes },

]

apiRoutes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
