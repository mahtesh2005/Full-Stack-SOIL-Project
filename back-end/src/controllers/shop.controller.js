const db = require("../database");

// Select all items from the cart
exports.all = async (req, res) => {
    try {
        const shops = await db.shop.findAll();
        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving items', error });
    }
};

exports.getCart = async (req, res) => {
    try {
        const { userID } = req.params;
        const cartItems = await db.shop.findAll({ where: { userID } });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart items', error });
    }
};


exports.addToCart = async (req, res) => {
    try {
        const { userID, itemID, itemName, itemPrice, itemImage, itemQuantity } = req.body;
        console.log('Received userID in request:', userID); // Add this line for debugging


        // Check if the item already exists in the cart
        let existingItem = await db.shop.findOne({ where: { userID, itemID } });

        if (existingItem) {
            // Update the existing item
            existingItem.itemQuantity += itemQuantity;
            existingItem.totalPrice = existingItem.itemQuantity * itemPrice;
            await existingItem.save();
            res.status(200).json(existingItem);
        } else {
            // Create a new item if it doesn't exist
            const newItem = await db.shop.create({
                userID,
                itemID,
                itemName,
                itemPrice,
                itemImage,
                itemQuantity,
                totalPrice: itemPrice * itemQuantity
            });
            res.status(201).json(newItem);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { userID, itemID } = req.body; // Assuming userID is also provided
        let existingItem = await db.shop.findOne({ where: { userID, itemID } });

        if (existingItem) {
            if (existingItem.itemQuantity > 1) {
                existingItem.itemQuantity -= 1;
                existingItem.totalPrice = existingItem.itemQuantity * existingItem.itemPrice;
                await existingItem.save();
                res.status(200).json({ message: 'Item quantity decreased', item: existingItem });
            } else {
                await existingItem.destroy();
                res.status(200).json({ message: 'Item removed from cart' });
            }
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const { userID } = req.params;
        await db.shop.destroy({ where: { userID } });
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error });
    }
};
