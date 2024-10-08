// Importing necessary modules and components from React and the local project files.
import React, { useContext } from 'react';
import { StoreContext } from '../StoreContext'; // Importing the context to access the global store.

// Importing images for the add and delete buttons.
import addImage from "../Data/assets/add.png";
import deleteImage from "../Data/assets/delete.png";


// Importing CSS styles specific to FruitItem and a general slider style.
import "../Fruits/FruitItem.css";
import "../SliderOne.css";

// Functional component to display an individual fruit item.
const FruitItem = ({ itemID, item_name, item_price, image, username }) => {
    // Using useContext hook to access cart items and actions from the global store.
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

    // Returning JSX to render the fruit item.
    return (
        <div className='product-item'>
            <div className='product-image-container'>
                {/* Displaying the fruit image */}
                <img className='product-image' src={image} alt='' />
            </div>
            <div className='content'>
                {/* Displaying the name of the fruit */}
                <h1>{item_name}</h1>
                {/* Displaying the quantity of the item in the cart, if it exists */}
                {cartItems[itemID] && <p>{cartItems[itemID].itemQuantity}</p>}
                <div className='food-item-buttons'> {/* Container for buttons */}
                    {/* Conditional rendering based on whether the item is in the cart */}
                    {!cartItems[itemID] 
                        ? (
                            // If the item is not in the cart, display the add button
                            <img className='add' onClick={() => addToCart(itemID, username)} src={addImage} alt='' />
                          )
                        : (
                            // If the item is in the cart, display the delete and add buttons
                            <div className='food-item-counter'>
                                <img className='minusOne' onClick={() => removeFromCart(itemID)} src={deleteImage} alt="" />
                                <img className='plusOne' onClick={() => addToCart(itemID, username)} src={addImage} alt="" />
                            </div>
                          )
                    }
                </div>
                {/* Displaying the price of the fruit */}
                <h2 className='food-item-price'>${item_price}/kg</h2>
            </div>
        </div>
    );
};


export default FruitItem;
