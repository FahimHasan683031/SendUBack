import { UserRoutes } from '../app/modules/user/user.route'
import { AuthRoutes } from '../app/modules/auth/auth.route'
import express, { Router } from 'express'
import { NotificationRoutes } from '../app/modules/notifications/notifications.route'
import { PublicRoutes } from '../app/modules/public/public.route'
import { PlanRoutes } from '../app/modules/plan/plan.routes'
import { SubscriptionRoutes } from '../app/modules/subscription/subscription.routes'
import { ChatRoutes } from '../app/modules/chat/chat.routes'
import { MessageRoutes } from '../app/modules/message/message.routes'
import { BusinessDetailsRoute } from '../app/modules/businessDetails/businessDetails.route'
import { LostItemRoutes } from '../app/modules/lostItem/lostItem.route'
import { CategoryRoutes } from '../app/modules/category/category.route'
import { shippoRoutes } from '../app/modules/shippo/shippo.route'




const router = express.Router()

const apiRoutes: { path: string; route: Router }[] = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/notifications', route: NotificationRoutes },
  { path: '/public', route: PublicRoutes },
  { path: '/plan', route: PlanRoutes },
  { path: '/subscription', route: SubscriptionRoutes },
  { path: '/chat', route: ChatRoutes },
  { path: '/message', route: MessageRoutes },
  { path: '/business-details', route: BusinessDetailsRoute },
  { path: '/lost-item', route: LostItemRoutes },
  { path: '/category', route: CategoryRoutes },
  { path: '/shippo', route: shippoRoutes },

]

apiRoutes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
