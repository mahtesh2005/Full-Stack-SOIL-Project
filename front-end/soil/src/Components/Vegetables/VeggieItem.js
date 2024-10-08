import React, { useContext } from 'react'; // Import React and useContext hook
import { StoreContext } from '../StoreContext'; // Import StoreContext

import addImage from "../Data/assets/add.png"; // Import add image
import deleteImage from "../Data/assets/delete.png"; // Import delete image
import plusImage from "../Data/assets/plus.png"; // Import plus image

import "../SliderOne.css"; // Import CSS for styling
import "../Fruits/FruitItem.css"; // Import CSS for styling

const VeggieItem = ({ itemID, item_name, item_price, image, username }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext); // Access cartItems, addToCart, removeFromCart from StoreContext

    return (
        <div className='product-item'> {/* Container for displaying a veggie item */}
            <div className='product-image-container'> {/* Container for product image */}
                <img className='product-image' src={image} alt='' /> {/* Display product image */}
            </div>
            <div className='content'> {/* Container for product information */}
                <h1>{item_name}</h1> {/* Display product name */}
                {cartItems[itemID] && <p>{cartItems[itemID].itemQuantity}</p>}
                <div className='food-item-buttons'> {/* Container for buttons */}
                    {!cartItems[itemID]
                        ? <img className='add' onClick={() => addToCart(itemID, username)} src={addImage} alt='' />
                        : <div className='food-item-counter'>
                            <img className='minusOne' onClick={() => removeFromCart(itemID)} src={deleteImage} alt="" />
                            <img className='plusOne' onClick={() => addToCart(itemID, username)} src={addImage} alt="" />
                        </div>
                    }
                </div>
                <h2 className='food-item-price'>${item_price}/kg</h2> {/* Display product price */}
            </div>
        </div>
    );
};

export default VeggieItem;
