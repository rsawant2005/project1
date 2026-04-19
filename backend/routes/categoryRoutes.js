import express from "express";
import {
    getAllCategories,
    createCategory,
    deleteCategory
} from "../controller/categoryController.js";
import adminAuth from "../middleware/adminAuth.js";

const categoryRoutes = express.Router();

// Public routes
categoryRoutes.get("/", getAllCategories);

// Admin-protected routes
categoryRoutes.post("/", adminAuth, createCategory);
categoryRoutes.delete("/:id", adminAuth, deleteCategory);

export default categoryRoutes;
