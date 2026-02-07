import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { PropertyControllers } from './property.controller'
import { PropertyValidations } from './property.validation'
import { USER_ROLES } from '../user/user.interface'
import auth from '../../middleware/auth'
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody'

const router = express.Router()

// Create property (Business users only)
router.post(
    '/',
    auth(USER_ROLES.BUSINESS, USER_ROLES.ADMIN),
    fileAndBodyProcessorUsingDiskStorage(),
    validateRequest(PropertyValidations.createPropertyZod),
    PropertyControllers.createProperty,
)

// Get properties by user ID
router.get('/user/:userId', PropertyControllers.getPropertiesByUserId)

// Get my properties (Business users only)
router.get(
    '/my-properties',
    auth(USER_ROLES.BUSINESS, USER_ROLES.ADMIN),
    PropertyControllers.getMyProperties,
)

// Get single property by ID
router.get('/:id', PropertyControllers.getSingleProperty)

// Update property (Owner or Admin)
router.patch(
    '/:id',
    auth(USER_ROLES.BUSINESS, USER_ROLES.ADMIN),
    fileAndBodyProcessorUsingDiskStorage(),
    validateRequest(PropertyValidations.updatePropertyZod),
    PropertyControllers.updateProperty,
)

// Delete property (Owner or Admin)
router.delete(
    '/:id',
    auth(USER_ROLES.BUSINESS, USER_ROLES.ADMIN),
    PropertyControllers.deleteProperty,
)

export const PropertyRoutes = router
