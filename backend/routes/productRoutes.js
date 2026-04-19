import express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controller/productController.js";
import adminAuth from "../middleware/adminAuth.js";

const productRoutes = express.Router();

// Public routes
productRoutes.get("/", getAllProducts);
productRoutes.get("/:id", getProductById);

// Admin-protected routes
productRoutes.post("/", adminAuth, createProduct);
productRoutes.put("/:id", adminAuth, updateProduct);
productRoutes.delete("/:id", adminAuth, deleteProduct);

export default productRoutes;
