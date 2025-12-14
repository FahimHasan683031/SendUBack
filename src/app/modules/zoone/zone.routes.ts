import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { zoneController } from './zone.controller';
import { createZoneZod, updateZoneZod } from './zone.validation';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../user/user.interface';

const router = express.Router();

// Public routes
router.get('/country/:countryCode', zoneController.getZoneByCountry);

// Protected routes
router.post(
  '/',
  auth(USER_ROLES.ADMIN),
  validateRequest(createZoneZod),
  zoneController.createZone
);

router.get(
  '/',
  auth(USER_ROLES.ADMIN),
  zoneController.getAllZones
);

router.get(
  '/:id',
  auth(USER_ROLES.ADMIN),
  zoneController.getZoneById
);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(updateZoneZod),
  zoneController.updateZone
);

router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN),
  zoneController.deleteZone
);

// Setup route (remove in production)
router.post('/seed/initial', zoneController.seedInitialZones);

export const zoneRoutes = router;