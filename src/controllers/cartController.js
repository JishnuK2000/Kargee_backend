import Cart from "../models/Cart.js";


// ✅ GET CART
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { productId, name, price, image, quantity, size, color } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const exist = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (exist) {
      exist.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        name,
        price,
        image,
        quantity,
        size,
        color,
      });
    }

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔄 UPDATE QUANTITY
export const updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = Math.max(1, quantity);

    await cart.save();

    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ❌ REMOVE ITEM
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.id
    );

    await cart.save();

    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 MERGE CART
export const mergeCart = async (req, res) => {
  try {
    const { cart: localCart } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    localCart.forEach((localItem) => {
      const exist = cart.items.find(
        (item) =>
          item.productId.toString() === localItem.id &&
          item.size === localItem.size &&
          item.color === localItem.color
      );

      if (exist) {
        exist.quantity += localItem.quantity;
      } else {
        cart.items.push({
          productId: localItem.id,
          name: localItem.name,
          price: localItem.price,
          image: localItem.image,
          quantity: localItem.quantity,
          size: localItem.size,
          color: localItem.color,
        });
      }
    });

    await cart.save();

    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};