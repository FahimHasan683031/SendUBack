import express from "express";
import { createCategoryZod, updateCategoryZod } from "./category.validation";
import { fileAndBodyProcessorUsingDiskStorage } from "../../middleware/processReqBody";
import validateRequest from "../../middleware/validateRequest";
import { categoryController } from "./category.controller";


const router = express.Router();

router.post("/create-service",
    fileAndBodyProcessorUsingDiskStorage(),
    validateRequest(createCategoryZod),
    categoryController.createCategory);
router.get("/get-categories", categoryController.getAllCategories);
router.put("/update-category/:id", categoryController.updateCategory);
router.delete("/delete-category/:id", categoryController.deleteCategory);


export const CategoryRoutes = router;
