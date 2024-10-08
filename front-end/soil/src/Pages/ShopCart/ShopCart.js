
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../Components/StoreContext'; // Importing the context to access the global store.
import "./ShopCart.css"; // Importing CSS styles specific to the ShopCart component.
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook for navigation.

const ShopCart = () => {
    // Using useContext hook to access cart items and actions from the global store.
    const { cartItems, removeFromCart, getTotalCartAmount, isAuthenticated, fetchCartItems } = useContext(StoreContext);
    const navigate = useNavigate(); // Initializing useNavigate hook for navigation.

    // Checking if there are items in the cart.
    const hasItemsInCart = Object.keys(cartItems).length > 0;

    // Dummy state to force re-render.
    const [dummyState, setDummyState] = useState(0);

    // Handler function for checkout button.
    const handleCheckout = () => {
        if (!hasItemsInCart) {
            alert("Please add items to the cart before proceeding to checkout.");
        } else {
            navigate('/place-order');
        }
    };

    // Fetch cart items and force re-render when component mounts.
    useEffect(() => {
        fetchCartItems();
        setDummyState(dummyState => dummyState + 1); // Increment dummy state to force re-render.
    }, []);

    return (
        <div className='cart'>
            <div className='cart-items'>
                <div className='cart-items-title'>
                    {/* Titles for the cart items list */}
                    <p>Image</p> 
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <hr />

                {/* Mapping through cart items and displaying each item */}
                {Object.values(cartItems).map((item, index) => (
                    <div key={index} className='cart-items-item'>
                        {/* Displaying item image */}
                        <img src={item.itemImage} alt={item.itemName} />
                        <p>{item.itemName}</p>
                        <p>${item.itemPrice}</p>
                        <p>{item.itemQuantity}</p> {/* Displaying item quantity */}
                        <p>${(item.totalPrice).toFixed(2)}</p> {/* Displaying total price */}
                        <p onClick={() => removeFromCart(item.itemID)} className='cross'>x</p> {/* Remove item from cart */}
                    </div>
                ))}
            </div>

            <div className="cart-bottom">
                <div className='cart-total'>
                    <h2>Cart Totals</h2>
                    <div>
                        <div className='cart-total-details'>
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className='cart-total-details'>
                            <p>Delivery Fee</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : 2.00}</p>
                        </div>
                        <hr />
                        <div className='cart-total-details'>
                            <b>Total</b>
                            <b>${(getTotalCartAmount() === 0 ? 0 : (parseFloat(getTotalCartAmount()) + 2).toFixed(2))}</b>
                        </div>
                    </div>
                    {/* Checkout button */}
                    <button onClick={handleCheckout} disabled={!hasItemsInCart}>PROCEED TO CHECKOUT</button>
                </div>
                <div className='cart-promocode'>
                    <div>
                        <p>If you have a promo code, Enter it here</p>
                        <div className='cart-promocode-input'>
                            <input type='text' placeholder='promo code' />
                            <button>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Exporting the ShopCart component as the default export of this module.
export default ShopCart;
