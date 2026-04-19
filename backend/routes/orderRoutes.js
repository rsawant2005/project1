import express from "express";
import {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
} from "../controller/orderController.js";
import isAuth from "../middleware/isAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRoutes = express.Router();

// User routes (requires login)
orderRoutes.post("/", isAuth, placeOrder);
orderRoutes.get("/my", isAuth, getUserOrders);

// Admin routes
orderRoutes.get("/all", adminAuth, getAllOrders);
orderRoutes.put("/:id/status", adminAuth, updateOrderStatus);

export default orderRoutes;
