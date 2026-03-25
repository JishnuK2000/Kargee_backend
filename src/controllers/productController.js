import Product from "../models/Product.js";
import { v4 as uuidv4 } from "uuid";
// ✅ 1. ADD PRODUCT

const generateProductId = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `KRG${random}`;
};

const generateSKU = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SKU-${random}`;
};

export const addProduct = async (req, res) => {
  try {


    const imageUrls = req.files.map((file) => file.path);

    let productId, sku;
    let productIdExists = true;
    let skuExists = true;

    // 🔁 Generate unique productId
    while (productIdExists) {
      productId = generateProductId();
      const existing = await Product.findOne({ productId });
      if (!existing) productIdExists = false;
    }

    // 🔁 Generate unique SKU
    while (skuExists) {
      sku = generateSKU();
      const existingSku = await Product.findOne({ sku });
      if (!existingSku) skuExists = false;
    }

    const product = new Product({
      ...req.body,
      productId,
      sku, // ✅ added
      images: imageUrls,
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 2. GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 3. GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 4. UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    console.log(req.params.id, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

    // 🔹 Get existing product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔹 Existing images from frontend
    let existingImages = req.body.existingImages || [];

    // If single value comes, convert to array
    if (!Array.isArray(existingImages)) {
      existingImages = [existingImages];
    }

    // 🔹 New uploaded images
    const newImages = req.files
      ? req.files.map((file) => file.path)
      : [];

    // 🔹 Final images = existing + new
    const finalImages = [...existingImages, ...newImages];

    // 🔹 Update product
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: finalImages, // ✅ update images properly
      },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✅ 5. DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
