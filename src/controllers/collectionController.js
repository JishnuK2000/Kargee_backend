import Collection from "../models/Collection.js";


// ✅ Add Collection
export const addCollection = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await Collection.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Collection already exists" });
    }

    const collection = await Collection.create({ name });

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get All Collections
export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};