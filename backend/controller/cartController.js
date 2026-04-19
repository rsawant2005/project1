import user from "../model/userModel.js";
import Product from "../model/productModel.js";

// Get cart for logged-in user
export const getCart = async (req, res) => {
    try {
        const User = await user.findById(req.userId).select("cartData");
        if (!User) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(User.cartData || {});
    } catch (error) {
        return res.status(500).json({ message: `getCart error: ${error.message}` });
    }
};

// Add or increment item in cart
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: "productId is required" });

        const User = await user.findById(req.userId);
        if (!User) return res.status(404).json({ message: "User not found" });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const cartData = User.cartData || {};
        const currentQty = cartData[productId] || 0;

        if (currentQty + 1 > product.stock) {
            return res.status(400).json({ message: `Only ${product.stock} items available in stock` });
        }

        cartData[productId] = currentQty + 1;
        User.cartData = cartData;
        User.markModified('cartData');
        await User.save();

        return res.status(200).json({ message: "Added to cart", cartData: User.cartData });
    } catch (error) {
        return res.status(500).json({ message: `addToCart error: ${error.message}` });
    }
};

// Update exact quantity of item in cart
export const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId) return res.status(400).json({ message: "productId is required" });

        const User = await user.findById(req.userId);
        if (!User) return res.status(404).json({ message: "User not found" });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const cartData = User.cartData || {};
        if (quantity <= 0) {
            delete cartData[productId];
        } else {
            if (quantity > product.stock) {
                return res.status(400).json({ message: `Only ${product.stock} items available in stock` });
            }
            cartData[productId] = quantity;
        }
        User.cartData = cartData;
        User.markModified('cartData');
        await User.save();

        return res.status(200).json({ message: "Cart updated", cartData: User.cartData });
    } catch (error) {
        return res.status(500).json({ message: `updateCart error: ${error.message}` });
    }
};

// Remove a single item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const User = await user.findById(req.userId);
        if (!User) return res.status(404).json({ message: "User not found" });

        const cartData = User.cartData || {};
        delete cartData[productId];
        User.cartData = cartData;
        User.markModified('cartData');
        await User.save();

        return res.status(200).json({ message: "Item removed from cart", cartData: User.cartData });
    } catch (error) {
        return res.status(500).json({ message: `removeFromCart error: ${error.message}` });
    }
};

// Clear entire cart (called after order is placed)
export const clearCart = async (req, res) => {
    try {
        const User = await user.findById(req.userId);
        if (!User) return res.status(404).json({ message: "User not found" });

        User.cartData = {};
        await User.save();

        return res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        return res.status(500).json({ message: `clearCart error: ${error.message}` });
    }
};
