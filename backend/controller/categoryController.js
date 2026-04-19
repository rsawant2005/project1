import Category from "../model/categoryModel.js";

// Get all categories (public)
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: 1 });
        return res.status(200).json(categories);
    } catch (error) {
        console.error("getAllCategories error:", error.message);
        return res.status(500).json({ message: `getAllCategories error: ${error.message}` });
    }
};

// Create category (admin only)
export const createCategory = async (req, res) => {
    try {
        const { name, slug, description } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ message: "Name and slug are required" });
        }

        const categoryExists = await Category.findOne({ slug });
        if (categoryExists) {
            return res.status(400).json({ message: "Category with this slug already exists" });
        }

        const category = await Category.create({
            name,
            slug,
            description,
        });

        return res.status(201).json(category);
    } catch (error) {
        console.error("createCategory error:", error.message);
        return res.status(500).json({ message: `createCategory error: ${error.message}` });
    }
};

// Delete category (admin only)
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("deleteCategory error:", error.message);
        return res.status(500).json({ message: `deleteCategory error: ${error.message}` });
    }
};
