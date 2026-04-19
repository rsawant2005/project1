import express from "express";
import {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart
} from "../controller/cartController.js";
import isAuth from "../middleware/isAuth.js";

const cartRoutes = express.Router();

// All cart routes require authentication
cartRoutes.get("/", isAuth, getCart);
cartRoutes.post("/", isAuth, addToCart);
cartRoutes.put("/", isAuth, updateCart);
cartRoutes.delete("/clear", isAuth, clearCart);
cartRoutes.delete("/:productId", isAuth, removeFromCart);

export default cartRoutes;
