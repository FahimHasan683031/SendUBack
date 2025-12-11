import express from "express";
import { SettingsController } from "./settings.controller";
import validateRequest from "../../middleware/validateRequest";
import { SettingsValidation } from "./settings.validation";
const router = express.Router();

router.post("/", 
    validateRequest(SettingsValidation),
    SettingsController.createSettings
)
// Get settings
router.get("/", SettingsController.getSettings)



export const SettingsRoutes = router