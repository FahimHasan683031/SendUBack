// Lost Item Routes
import express from "express";
import { LostItemValidations } from "./lostItem.validation";
import { lostItemControllers } from "./lostItem.controller";

const router = express.Router();

// Create a new lost item
router.post(
  "/",
  LostItemValidations,
  lostItemControllers.createLostItem
);

// Get all lost items for a user
router.get(
  "/user/:userId",
  LostItemController.getLostItemsByUser
);

// Get a specific lost item by ID
router.get(
  "/:id",
  LostItemController.getLostItemById
);

// Update a lost item by ID
router.put(
  "/:id",
  LostItemValidations.updateLostItemSchema,
  LostItemController.updateLostItem
);

// Delete a lost item by ID
router.delete(
  "/:id",
  LostItemController.deleteLostItem
);

export default router;