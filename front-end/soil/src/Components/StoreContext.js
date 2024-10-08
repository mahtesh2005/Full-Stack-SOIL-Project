import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';
import PopupMessage from "../Components/PopUpMsg/PopupMessage.js";
import { gql } from "graphql-tag";
import client from "../apollo/client";
 
 
export const StoreContext = createContext(null);
 
 
const ORDER_ADDED_SUBSCRIPTION = gql`
  subscription {
    order_added {
      cartID
      userID
        itemID
        itemName
        itemPrice
        itemQuantity
      
      totalPrice
    }
  }
`;
 
 
const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [specialItems, setSpecialItems] = useState([]);
    const [fruits, setFruits] = useState([]);
    const [vegetables, setVegetables] = useState([]);
    const [pantryStaples, setPantryStaples] = useState([]);
    const [nutsGrains, setNutsGrains] = useState([]);
    const [fetchComplete, setFetchComplete] = useState(false);
    const [orderedItems, setOrderedItems] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
 
    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchSpecialItems(),
                    fetchFruits(),
                    fetchVegetables(),
                    fetchPantryStaples(),
                    fetchNutsGrains()
                ]);
                setFetchComplete(true);
                await fetchCartItems(); // Fetch cart items when user logs in
                checkAuthentication();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);
 
    useEffect(() => {
        if (fetchComplete) {
            console.log("Context Value:", contextValue);
        }
    }, [fetchComplete, cartItems, specialItems, fruits, vegetables, pantryStaples, nutsGrains]);
 
 
    useEffect(() => {
        const subscription = client
          .subscribe({
            query: ORDER_ADDED_SUBSCRIPTION,
          })
          .subscribe({
            next: (payload) => {
              const newOrder = payload.data.orderAdded;
              setOrderedItems((prevOrders) => [...prevOrders, newOrder]);
              console.log('New order added:', newOrder);
            },
            error: (err) => console.error('Error with order subscription:', err),
          });
 
        return () => {
          subscription.unsubscribe();
        };
    }, []);
 
 
    // Check authentication status based on userID in localStorage
    const checkAuthentication = () => {
        const userID = localStorage.getItem('userID');
        if (userID) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    };
 
    const fetchCartItems = async () => {
        const userID = localStorage.getItem('userID');
        if (!userID) return;
 
        try {
            const response = await axios.get(`http://localhost:4000/api/shops/getCart/${userID}`);
            const items = response.data;
            const cart = {};
            items.forEach(item => {
                cart[item.itemID] = item;
            });
            setCartItems(cart);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };
 
    const fetchSpecialItems = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/specials');
            setSpecialItems(response.data);
            console.log("Special Items:", response.data);
        } catch (error) {
            throw new Error('Error fetching special items:', error);
        }
    };
 
    const fetchFruits = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/standards/fruits');
            setFruits(response.data);
            console.log("Fruits:", response.data);
        } catch (error) {
            throw new Error('Error fetching fruits:', error);
        }
    };
 
    const fetchVegetables = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/standards/vegetables');
            setVegetables(response.data);
            console.log("Vegetables:", response.data);
        } catch (error) {
            throw new Error('Error fetching vegetables:', error);
        }
    };
 
    const fetchPantryStaples = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/standards/pantrystaples');
            setPantryStaples(response.data);
            console.log("Pantry Staples:", response.data);
        } catch (error) {
            throw new Error('Error fetching pantry staples:', error);
        }
    };
 
    const fetchNutsGrains = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/standards/nuts&grains');
            setNutsGrains(response.data);
            console.log("Nuts & Grains:", response.data);
        } catch (error) {
            throw new Error('Error fetching nuts & grains:', error);
        }
    };
 
    const getItemInfo = (itemID) => {
        return (
            fruits.find((product) => product.itemID === itemID) ||
            specialItems.find((product) => product.itemID === itemID) ||
            vegetables.find((product) => product.itemID === itemID) ||
            pantryStaples.find((product) => product.itemID === itemID) ||
            nutsGrains.find((product) => product.itemID === itemID)
        );
    };
 
// Inside StoreContextProvider
const addToCart = async (itemID, username) => {
    // Ensure username is optional as userID will be used primarily
    if (!username) {
        setPopupMessage("Please log in to add items to the cart.");
        setShowPopup(true);
        return;
    }
 
    const itemInfo = getItemInfo(itemID);
    if (!itemInfo) {
        return;
    }
 
    const itemQuantity = 1; // Assuming a default quantity of 1 if not provided
    const totalPrice = itemInfo.item_price * itemQuantity;
 
    // Retrieve the userID from localStorage
    const userID = localStorage.getItem('userID');
    if (!userID) {
        setPopupMessage("User not found. Please log in again.");
        setShowPopup(true);
        return;
    }
 
    const newItem = {
        userID: userID, // Include userID in the newItem object
        itemID: itemInfo.itemID,
        itemName: itemInfo.item_name, // Ensure this matches backend's expected property
        itemPrice: itemInfo.item_price, // Ensure this matches backend's expected property
        itemImage: itemInfo.item_image, // Include itemImage in newItem
        itemQuantity: itemQuantity,
        totalPrice: totalPrice,
    };
 
    try {
        console.log('Sending new item to backend:', newItem);
        const response = await axios.post('http://localhost:4000/api/shops/add', newItem);
        const addedItem = response.data;
 
        // Update cartItems state to include the newly added item
        setCartItems((prevCartItems) => {
            const updatedCartItems = {
                ...prevCartItems,
                [addedItem.itemID]: addedItem,
            };
            console.log('Updated cartItems:', updatedCartItems);
            return updatedCartItems;
        });
 
    } catch (error) {
        console.error('Error adding item to cart:', error);
    }
};
 
 
    const closePopup = () => {
        setShowPopup(false);
    };
 
    const removeFromCart = async (itemID) => {
        // Retrieve the userID from localStorage
        const userID = localStorage.getItem('userID');
        if (!userID) {
            setPopupMessage("User ID not found. Please log in again.");
            setShowPopup(true);
            return;
        }
 
        // Check if the item exists in cartItems
        if (cartItems[itemID]) {
            const itemName = cartItems[itemID].itemName; // Assuming cartItems contains itemName
            const updatedCart = { ...cartItems };
 
            if (updatedCart[itemID].itemQuantity > 1) {
                updatedCart[itemID].itemQuantity -= 1;
                updatedCart[itemID].totalPrice = updatedCart[itemID].itemQuantity * updatedCart[itemID].itemPrice;
            } else {
                delete updatedCart[itemID];
            }
 
            setCartItems(updatedCart);
            localStorage.setItem('selectedProducts', JSON.stringify(updatedCart));
 
            try {
                await axios.post('http://localhost:4000/api/shops/remove', { userID, itemID });
                setPopupMessage(`${itemName} removed from cart`); // Display the item name in the message
                setShowPopup(true);
            } catch (error) {
                console.error('Error removing item from cart:', error);
                setPopupMessage("Error removing item from cart");
                setShowPopup(true);
            }
        } else {
            setPopupMessage("Item not found in cart"); // Display a message if the item is not found
            setShowPopup(true);
        }
    };
 
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        console.log("cartItems:", cartItems); // Log cartItems to console
        for (const item of Object.values(cartItems)) {
            totalAmount += item.itemPrice * (item.itemQuantity || 1); // Use 1 as default quantity
        }
        console.log("totalAmount:", totalAmount); // Log totalAmount to console
        return totalAmount.toFixed(2); // Return totalAmount with two decimal places
    };
    
    
 
    const clearCart = () => {
        setCartItems({}); // Clear cart items in the context
        localStorage.removeItem('selectedProducts'); // Remove local storage for cart items
    };
 
    const submitOrder = async () => {
        const userID = localStorage.getItem('userID');
        if (!userID) {
            setPopupMessage("User ID not found. Please log in again.");
            setShowPopup(true);
            return;
        }
    
        // Retrieve the current cartID from localStorage or initialize it to 1
        let cartID = parseInt(localStorage.getItem('cartID') || 1);
    
        const orderedItemsArray = Object.values(cartItems).map(item => ({
            cartID: cartID, // Assign the current cartID to each item
            userID: userID,
            itemID: item.itemID,
            itemName: item.itemName,
            itemPrice: item.itemPrice,
            itemQuantity: item.itemQuantity,
            totalPrice: item.itemPrice * item.itemQuantity
        }));
    
        try {
            console.log('Sending ordered items to backend:', orderedItemsArray);
            const response = await axios.post('http://localhost:4000/api/orders/submit', orderedItemsArray);
            console.log('Order placed successfully:', response.data);
            setOrderedItems(response.data); // Update orderedItems state if needed
    
            // Increment the cartID for the next order
            cartID++;
            localStorage.setItem('cartID', cartID);
    
            setPopupMessage("Order placed successfully");
            setShowPopup(true);
    
            // Optionally clear cart items after successful order placement
            // setCartItems({}); // Clear cart items after order placement
        } catch (error) {
            console.error('Error placing order:', error);
            setPopupMessage("Error placing order");
            setShowPopup(true);
        }
    };
    
    const contextValue = {
        cartItems,
        orderedItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        clearCart,
        specialItems,
        vegetables,
        nutsGrains,
        pantryStaples,
        fruits,
        submitOrder,
        isAuthenticated,
        fetchCartItems, // Provide fetchCartItems in context
    };
 
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
            {showPopup && <PopupMessage message={popupMessage} onClose={closePopup} />}
        </StoreContext.Provider>
    );
};
 
export default StoreContextProvider;