const db = require("../database");
 
// Select all orders from the database.
exports.all = async (req, res) => {
  const orders = await db.order.findAll();
 
  res.json(orders);
};
 
// Select all orders from the database based on userID
exports.id = async (req, res) => {
    const { userID } = req.params; // Extract userID from URL parameters
    if (!userID) {
        return res.status(400).json({ error: "User ID is required" });
    }
 
    try {
        const ordersByID = await db.order.findAll({ where: { userID } });
        res.json(ordersByID);
    } catch (error) {
        console.error('Error fetching orders by userID:', error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
};
 
 
exports.submitOrder = async (req, res) => {
    const orderedItemsArray = req.body;
 
    try {
        // Create orders for each item in orderedItems
        const createdOrders = await Promise.all(orderedItemsArray.map(async (item) => {
            const newOrder = await db.order.create({
                cartID: item.cartID,
                userID: item.userID,
                itemID: item.itemID,
                itemName: item.itemName,
                itemPrice: item.itemPrice,
                itemImage: item.itemImage,
                itemQuantity: item.itemQuantity,
                totalPrice: item.itemPrice * item.itemQuantity
            });
            return newOrder;
        }));
 
        // Clear the user's cart after creating orders
        const userID = orderedItemsArray[0].userID;
        await db.shop.destroy({ where: { userID } });
 
        res.json(createdOrders);
    } catch (error) {
        console.error('Error creating orders:', error);
        res.status(500).json({ error: 'Error creating orders' });
    }
};