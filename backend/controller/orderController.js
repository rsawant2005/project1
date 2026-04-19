import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import Product from "../model/productModel.js";
import { sendOrderPlacedMail, sendOrderStatusMail } from "../config/mail.js";

// Place a new order (user auth required)
export const placeOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, razorpayOrderId, razorpayPaymentId } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must have at least one item" });
        }

        if (!shippingAddress) {
            return res.status(400).json({ message: "Shipping address is required" });
        }

        // Validate stock for all items before placing order
        for (const item of items) {
            if (item.productId) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return res.status(404).json({ message: `Product ${item.name} not found` });
                }
                if (product.stock < item.quantity) {
                    return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
                }
            }
        }

        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = 50;
        const total = subtotal + shipping;

        const order = await Order.create({
            userId: req.userId,
            items,
            shippingAddress,
            paymentMethod: paymentMethod || 'cod',
            paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
            razorpayOrderId: razorpayOrderId || undefined,
            razorpayPaymentId: razorpayPaymentId || undefined,
            subtotal,
            shipping,
            total
        });

        // Deduct stock for each item
        for (const item of items) {
            if (item.productId) {
                await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
            }
        }

        // Send confirmation email
        try {
            const customer = await User.findById(req.userId);
            if (customer && customer.email) {
                await sendOrderPlacedMail(customer.email, customer.name, order);
            }
        } catch (mailErr) {
            console.error("Failed to send order placement email:", mailErr);
        }

        return res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error("placeOrder error:", error.message);
        return res.status(500).json({ message: `placeOrder error: ${error.message}` });
    }
};

// Get current user's orders
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (error) {
        console.error("getUserOrders error:", error.message);
        return res.status(500).json({ message: `getUserOrders error: ${error.message}` });
    }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("userId", "name email mobile")
            .sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (error) {
        console.error("getAllOrders error:", error.message);
        return res.status(500).json({ message: `getAllOrders error: ${error.message}` });
    }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('userId');

        if (!order) return res.status(404).json({ message: "Order not found" });

        // Send status update email
        try {
            if (order.userId && order.userId.email) {
                await sendOrderStatusMail(order.userId.email, order.userId.name, status);
            }
        } catch (mailErr) {
            console.error("Failed to send order status email:", mailErr);
        }

        return res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        console.error("updateOrderStatus error:", error.message);
        return res.status(500).json({ message: `updateOrderStatus error: ${error.message}` });
    }
};
