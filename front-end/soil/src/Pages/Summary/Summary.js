import React, { useContext, useEffect, useState } from 'react';
import './Summary.css';
import { StoreContext } from '../../Components/StoreContext';
import { useNavigate } from 'react-router-dom';

const Summary = () => {
    const { getTotalCartAmount, clearCart, fetchCartItems, cartItems } = useContext(StoreContext);
    const navigate = useNavigate();

    const handleReturnHome = () => {
        clearCart();
        navigate('/');
    };

    const handleContinueShopping = () => {
        clearCart();
        navigate('/shop');
    };

    // Fetch cart items and calculate total amount when component mounts
    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <div className="summary-container">
            <h1>Payment Confirmation</h1>
            <div className="summary-details">
                <div className="detail">
                    <p>Subtotal</p>
                    <p>${getTotalCartAmount()}</p>
                </div>
                <hr />
                <div className="detail">
                    <p>Delivery Fee</p>
                    <p>${getTotalCartAmount() === 0 ? 0 : 2.00}</p>
                </div>
                <hr />
                <div className="detail total">
                    <p>Total</p>
                    <p>${(getTotalCartAmount() === 0 ? 0 : (getTotalCartAmount() + 2))}</p>
                </div>
            </div>
            <p className="confirmation-message">Your payment has been confirmed.</p>
            <div className="buttons-container">
                <button className="return-home" onClick={handleReturnHome}>Return Home</button>
                <button className="continue-shopping" onClick={handleContinueShopping}>Continue Shopping</button>
            </div>
        </div>
    );
};

export default Summary;
