import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controller/paymentController.js";
import isAuth from "../middleware/isAuth.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/create-order", isAuth, createRazorpayOrder);
paymentRoutes.post("/verify", isAuth, verifyRazorpayPayment);

export default paymentRoutes;
