// Lost Item Routes
import express from "express";
import { LostItemValidations } from "./lostItem.validation";
import { lostItemControllers } from "./lostItem.controller";
import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.interface";
import { fileAndBodyProcessorUsingDiskStorage } from "../../middleware/processReqBody";

const router = express.Router();

// Create a new lost item
router.post(
  "/",
  auth(USER_ROLES.Business),
  validateRequest(LostItemValidations.createLostItemSchema),
  lostItemControllers.createLostItem
);

// Get all lost items for a user
router.get(
  "/",
  auth(USER_ROLES.Business,USER_ROLES.ADMIN),
  lostItemControllers.getAllLostItems
);
router.post(
  "/upload-image/:id",
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(LostItemValidations.addOrReplaceImagesSchema),
  lostItemControllers.addOrReplaceImages
);

// send guest email
router.post(
  "/send-email/:id",
  auth(USER_ROLES.Business,USER_ROLES.ADMIN),
  lostItemControllers.sendGestEmail
);


// Get single lost item
router.get(
  "/:id",
  lostItemControllers.getSingleLostItem
);

// Update a lost item by ID
router.put(
  "/:id",
  auth(USER_ROLES.Business,USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(LostItemValidations.updateLostItemSchema),
  lostItemControllers.updateLostItem
);

// Delete a lost item by ID
router.delete(
  "/:id",
  auth(USER_ROLES.Business,USER_ROLES.ADMIN),
  lostItemControllers.deleteLostItem
);

export const LostItemRoutes = router;
