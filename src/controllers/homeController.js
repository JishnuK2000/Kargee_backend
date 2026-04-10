import Carousel from "../models/Carousel.js";
import HomeGrid from "../models/HomeGrid.js";

// --- Carousel Controllers ---

// @desc    Get all carousel images
// @route   GET /api/home/carousel
// @access  Public
export const getCarousels = async (req, res) => {
  try {
    const carousels = await Carousel.find().sort({ order: 1 });
    res.json(carousels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a carousel image
// @route   POST /api/admin/home/carousel
// @access  Admin
export const addCarousel = async (req, res) => {
  try {
    const desktopImageUrl = req.files && req.files["desktopImage"] ? req.files["desktopImage"][0].path : req.body.desktopImageUrl;
    const mobileImageUrl = req.files && req.files["mobileImage"] ? req.files["mobileImage"][0].path : req.body.mobileImageUrl;

    if (!desktopImageUrl || !mobileImageUrl) {
      return res.status(400).json({ message: "Both desktop and mobile images are required" });
    }

    const { title, link, order } = req.body;

    const carousel = new Carousel({
      desktopImageUrl,
      mobileImageUrl,
      title,
      link,
      order,
    });

    const savedCarousel = await carousel.save();
    res.status(201).json(savedCarousel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a carousel image
// @route   DELETE /api/admin/home/carousel/:id
// @access  Admin
export const deleteCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.findByIdAndDelete(req.params.id);
    if (!carousel) {
      return res.status(404).json({ message: "Carousel image not found" });
    }
    res.json({ message: "Carousel image deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- HomeGrid (4Grid) Controllers ---

// @desc    Get all 4grid items
// @route   GET /api/home/4grid
// @access  Public
export const getHomeGrids = async (req, res) => {
  try {
    const grids = await HomeGrid.find().sort({ order: 1 });
    res.json(grids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add or Update a grid item
// @route   POST /api/admin/home/4grid
// @access  Admin
export const addOrUpdateHomeGrid = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.imageUrl;
    const { id, category, title, order } = req.body;

    if (id) {
      // Update existing
      const updateData = { category, title, order };
      if (imageUrl) updateData.imageUrl = imageUrl;

      const updatedGrid = await HomeGrid.findByIdAndUpdate(id, updateData, { new: true });
      return res.json(updatedGrid);
    } else {
      // Create new
      if (!imageUrl || !category || !title) {
        return res.status(400).json({ message: "Image, category, and title are required" });
      }

      const gridCount = await HomeGrid.countDocuments();
      if (gridCount >= 4) {
        return res.status(400).json({ message: "Maximum 4 grid items allowed. Please update or delete existing ones." });
      }

      const homeGrid = new HomeGrid({
        imageUrl,
        category,
        title,
        order,
      });

      const savedGrid = await homeGrid.save();
      res.status(201).json(savedGrid);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a grid item
// @route   DELETE /api/admin/home/4grid/:id
// @access  Admin
export const deleteHomeGrid = async (req, res) => {
  try {
    const grid = await HomeGrid.findByIdAndDelete(req.params.id);
    if (!grid) {
      return res.status(404).json({ message: "Grid item not found" });
    }
    res.json({ message: "Grid item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
