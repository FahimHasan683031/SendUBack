import express from 'express'
import { UserController } from './user.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody'
import validateRequest from '../../middleware/validateRequest'
import { UserValidations } from './user.validation'

const router = express.Router()

router.get(
  '/me',
  auth(USER_ROLES.BUSINESS, USER_ROLES.ADMIN),
  UserController.getProfile,
)
router.get('/', auth(USER_ROLES.ADMIN), UserController.getAllUser),
  router.patch(
    '/profile',
    auth(USER_ROLES.BUSINESS, USER_ROLES.ADMIN),
    fileAndBodyProcessorUsingDiskStorage(),
    UserController.updateProfile,
  )

router.post(
  "/complete-profile",
  auth(USER_ROLES.BUSINESS),
  validateRequest(UserValidations.completeProfileSchema),
  UserController.completeProfile
)

// delete my account
router.delete(
  '/me',
  auth(USER_ROLES.BUSINESS, USER_ROLES.ADMIN),
  UserController.deleteMyAccount,
)

// get single user
router.get('/:id', UserController.getSingleUser)


// delete user
router.delete('/:id', auth(USER_ROLES.ADMIN), UserController.deleteUser)

export const UserRoutes = router
