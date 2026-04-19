import Product from "../model/productModel.js";

// Get all products (public)
export const getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const products = await Product.find(filter).sort({ createdAt: -1 });
        return res.status(200).json(products);
    } catch (error) {
        console.error("getAllProducts error:", error.message);
        return res.status(500).json({ message: `getAllProducts error: ${error.message}` });
    }
};

// Get single product by id (public)
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json(product);
    } catch (error) {
        console.error("getProductById error:", error.message);
        return res.status(500).json({ message: `getProductById error: ${error.message}` });
    }
};

// Create product (admin only)
export const createProduct = async (req, res) => {
    try {
        const { name, category, price, originalPrice, image, rating, reviews, badge, description, unit, stock } = req.body;

        if (!name || !category || !price || !image) {
            return res.status(400).json({ message: "Name, category, price, and image are required" });
        }

        const product = await Product.create({
            name,
            category,
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            image,
            rating: rating ? Number(rating) : 4.5,
            reviews: reviews ? Number(reviews) : 0,
            badge,
            description,
            unit: unit || 'KG',
            stock: stock !== undefined ? Number(stock) : 0
        });

        return res.status(201).json(product);
    } catch (error) {
        console.error("createProduct error:", error.message);
        return res.status(500).json({ message: `createProduct error: ${error.message}` });
    }
};

// Update product (admin only)
export const updateProduct = async (req, res) => {
    try {
        const { name, category, price, originalPrice, image, rating, reviews, badge, description, unit, stock } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                category,
                price: price ? Number(price) : undefined,
                originalPrice: originalPrice ? Number(originalPrice) : undefined,
                image,
                rating: rating ? Number(rating) : undefined,
                reviews: reviews ? Number(reviews) : undefined,
                badge,
                description,
                unit,
                stock: stock !== undefined ? Number(stock) : undefined
            },
            { new: true, runValidators: true }
        );

        if (!product) return res.status(404).json({ message: "Product not found" });

        return res.status(200).json(product);
    } catch (error) {
        console.error("updateProduct error:", error.message);
        return res.status(500).json({ message: `updateProduct error: ${error.message}` });
    }
};

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("deleteProduct error:", error.message);
        return res.status(500).json({ message: `deleteProduct error: ${error.message}` });
    }
};
