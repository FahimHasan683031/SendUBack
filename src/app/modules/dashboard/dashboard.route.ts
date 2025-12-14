import express from 'express'
import { DashboardControllers } from './dashboard.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'


const router = express.Router()

router.get(
  '/adminStatistics',
  auth(USER_ROLES.ADMIN),
  DashboardControllers.getDashboardStatistics,
)
router.get(
  '/businessStatistics',
  auth(USER_ROLES.Business),
  DashboardControllers.getBusinessDashboardStatistics,
)



export const DashboardRoutes = router
