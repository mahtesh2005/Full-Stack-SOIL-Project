import React, { useState, useContext, useEffect, useCallback } from 'react';
import './Payment.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Components/StoreContext'; // Update the path
import client from '../../apollo/client';
import { getOrders, addOrder } from '../../Components/Data/repository'; // Import addOrder function
import { gql } from "graphql-tag";

import visaImage from "../../Components/Data/assets/visa.png";
import chipImage from "../../Components/Data/assets/chip.png";

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

const Payment = () => {
    const navigate = useNavigate();
    const { submitOrder, cartItems } = useContext(StoreContext); // Access submitOrder from context

    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [orders, setOrders] = useState([]);
    const [chartData, setChartData] = useState([]);

    // Event handlers for input changes
    const handleCardNumberChange = (event) => {
        setCardNumber(event.target.value);
    };

    const handleCardHolderChange = (event) => {
        setCardHolder(event.target.value);
    };

    const handleExpMonthChange = (event) => {
        let inputMonth = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (inputMonth.length > 2) {
            inputMonth = inputMonth.slice(0, 2); // Keep only the first two characters
        }
        if (inputMonth.length === 2) {
            inputMonth += '/';
        }
        setExpMonth(inputMonth);
    };

    const handleExpYearChange = (event) => {
        setExpYear(event.target.value);
    };

    const handleCvvChange = (event) => {
        let inputCvv = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (inputCvv.length > 3) {
            inputCvv = inputCvv.slice(0, 3); // Keep only the first three characters
        }
        setCvv(inputCvv);
    };

    const updateChartData = useCallback((orders) => {
        const orderQuantities = orders.reduce((acc, order) => {
            const existingOrder = acc.find((item) => item.id === order.itemName);
            if (existingOrder) {
                existingOrder.value += order.itemQuantity;
            } else {
                acc.push({ id: order.itemName, value: order.itemQuantity });
            }
            return acc;
        }, []);
        setChartData(orderQuantities);
    }, []);

    useEffect(() => {
        const subscription = client
            .subscribe({ query: ORDER_ADDED_SUBSCRIPTION })
            .subscribe({
                next: (payload) => {
                    const newOrder = payload.data.order_added;
                    setOrders((prevOrders) => {
                        const updatedOrders = [...prevOrders, newOrder];
                        updateChartData(updatedOrders);
                        return updatedOrders;
                    });
                },
                error: (err) => console.error('Subscription error:', err),
            });

        async function fetchOrders() {
            try {
                const ordersData = await getOrders();
                setOrders(ordersData);
                updateChartData(ordersData);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }

        fetchOrders();

        return () => {
            subscription.unsubscribe();
        };
    }, [updateChartData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};

        // Card number validation
        if (!cardNumber) errors.cardNumber = 'Card number is required';

        // Card holder validation
        if (!cardHolder) errors.cardHolder = 'Card holder name is required';

        // Expiration month validation
        if (!expMonth) errors.expMonth = 'Expiration month is required';
        else if (!expMonth.match(/^(0[1-9]|1[0-2])\/?$/)) errors.expMonth = 'Expiration month must be a valid month number (01-12)';

        // Expiration year validation
        if (!expYear) errors.expYear = 'Expiration year is required';
        else if (!/^\d{4}$/.test(expYear)) errors.expYear = 'Expiration year must be a valid 4-digit number';
        else if (parseInt(expYear, 10) < 2024) errors.expYear = 'Expiration year is expired';

        // CVV validation
        if (!cvv) errors.cvv = 'CVV is required';
        else if (!/^\d{3}$/.test(cvv)) errors.cvv = 'CVV must be a three-digit number';

        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            submitOrder(); // Call submitOrder function to add the order
            navigate('/summary'); // Assuming navigate is defined to redirect the user
        }
    };

    return (
        <div className="payment-css">
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className="container">
                <div className="card-container">
                    <div className="front">
                        <div className="image">
                            <img src={chipImage} alt="chip" />
                            <img src={visaImage} alt="visa" />
                        </div>
                        <div className="card-number-box">{cardNumber}</div>
                        <div className="flexbox">
                            <div className="box">
                                <span>card holder</span>
                                <div className="card-holder-name">{cardHolder}</div>
                            </div>
                            <div className="box">
                                <span>expires</span>
                                <div className="expiration">
                                    <span className="exp-month">{expMonth}</span>
                                    <span className="exp-year">{expYear}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="back">
                        <div className="stripe"></div>
                        <div className="box">
                            <span>cvv</span>
                            <div className="cvv-box">{cvv}</div>
                            <img src={visaImage} alt="visa" />
                        </div>
                    </div>
                </div>
                <form className="payment-form" onSubmit={handleSubmit}>
                    <div className='inputBox'>
                        <span>card number</span>
                        <input type='text' maxLength={16} className='card-number-input' onChange={handleCardNumberChange} />
                        {formErrors.cardNumber && <p className='error-message'>{formErrors.cardNumber}</p>}
                    </div>

                    <div className='inputBox'>
                        <span>card holder</span>
                        <input type='text' className='card-holder-input' onChange={handleCardHolderChange} />
                        {formErrors.cardHolder && <p className='error-message'>{formErrors.cardHolder}</p>}
                    </div>

                    <div className='flexbox'>
                        <div className='inputBox'>
                            <span>expiration mm</span>
                            <input type='text' className='card-holder-input' onChange={handleExpMonthChange} />
                            {formErrors.expMonth && <p className='error-message'>{formErrors.expMonth}</p>}
                        </div>

                        <div className='inputBox'>
                            <span>expiration yy</span>
                            <input type='text' className='card-holder-input' onChange={handleExpYearChange} />
                            {formErrors.expYear && <p className='error-message'>{formErrors.expYear}</p>}
                        </div>

                        <div className='inputBox'>
                            <span>cvv</span>
                            <input type='text' maxLength='3' className='cvv-input' onChange={handleCvvChange} />
                            {formErrors.cvv && <p className='error-message'>{formErrors.cvv}</p>}
                        </div>
                    </div>
                    <button className="submit" id="submit-btn" type="submit">
                        SUBMIT
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
