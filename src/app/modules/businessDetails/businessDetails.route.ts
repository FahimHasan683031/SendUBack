import express from "express"
import { businessDetailsControllers } from "./businessDetails.controller"
import { USER_ROLES } from "../user/user.interface"
import auth from "../../middleware/auth"
import { fileAndBodyProcessorUsingDiskStorage } from "../../middleware/processReqBody"
import validateRequest from "../../middleware/validateRequest"
import { BusinessDetailsValidations } from "./businessDetails.validation"
const router = express.Router()

// update business details
router.patch(
  "/update-business-details",
  fileAndBodyProcessorUsingDiskStorage(),
  auth(USER_ROLES.Business),
  validateRequest(BusinessDetailsValidations.updateBusinessDetailsSchema),
  businessDetailsControllers.updateBusinessDetails
)


export const BusinessDetailsRoute = router