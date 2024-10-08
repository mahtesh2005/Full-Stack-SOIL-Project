import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Components/StoreContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const { getTotalCartAmount } = useContext(StoreContext);
    const navigate = useNavigate();

    // State to track form input values
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        postCode: '',
        country: '',
        phone: '',
    });

    // State to track form errors
    const [formErrors, setFormErrors] = useState({});

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Validate form inputs
    const validateForm = () => {
        const errors = {};
        for (const key in formData) {
            if (!formData[key]) {
                errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
            }
        }

        // Validate email format
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(formData.email)) {
            errors.email = 'Invalid email address';
        }

        // Validate street format (contains a number)
        const streetRegex = /\d/;
        if (!streetRegex.test(formData.street)) {
            errors.street = 'Invalid street address (should contain a number)';
        }

        // Validate postcode format (contains a 4-digit number)
        const postcodeRegex = /^\d{4}$/;
        if (!postcodeRegex.test(formData.postCode)) {
            errors.postCode = 'Invalid postcode (should be a 4-digit number)';
        }

        // Validate phone number format (contains 10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            errors.phone = 'Invalid phone number (should contain 10 digits)';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            navigate('/payment');
        } else {
            alert('Please fill out all required fields.');
        }
    };


    return (
        <div>
            <br />
            <br />
            <br />
            <br />
            <form className='place-order' onSubmit={handleSubmit}>
                <div className='place-order-left'>
                    <p className='title'>Delivery Information</p>
                    <div className='multi-fields'>
                        <input type='text' placeholder='First name' name='firstName' value={formData.firstName} onChange={handleInputChange} />
                        {formErrors.firstName && <p className='error-message'>{formErrors.firstName}</p>}
                        <input type='text' placeholder='Last name' name='lastName' value={formData.lastName} onChange={handleInputChange} />
                        {formErrors.lastName && <p className='error-message'>{formErrors.lastName}</p>}
                    </div>

                    {formErrors.email && <p className='error-message'>{formErrors.email}</p>}
                    <input type='text' placeholder='Email address' name='email' value={formData.email} onChange={handleInputChange} />
                    

                    {formErrors.street && <p className='error-message'>{formErrors.street}</p>}
                    <input type='text' placeholder='Street' name='street' value={formData.street} onChange={handleInputChange} />
                    
                    <div className='multi-fields'>
                        <input type='text' placeholder='City' name='city' value={formData.city} onChange={handleInputChange} />
                        {formErrors.city && <p className='error-message'>{formErrors.city}</p>}
                        <input type='text' placeholder='State' name='state' value={formData.state} onChange={handleInputChange} />
                        {formErrors.state && <p className='error-message'>{formErrors.state}</p>}
                    </div>
                    <div className='multi-fields'>
                        <input type='text' placeholder='Post Code' name='postCode' value={formData.postCode} onChange={handleInputChange} />
                        {formErrors.postCode && <p className='error-message'>{formErrors.postCode}</p>}
                        <input type='text' placeholder='Country' name='country' value={formData.country} onChange={handleInputChange} />
                        {formErrors.country && <p className='error-message'>{formErrors.country}</p>}
                    </div>
                    
                    <input type='text' placeholder='Phone' name='phone' value={formData.phone} onChange={handleInputChange} />
                    {formErrors.phone && <p className='error-message'>{formErrors.phone}</p>}
                </div>

                <div className='place-order-right'>
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
                                <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                            </div>
                            <hr />
                            <div className='cart-total-details'>
                                <b>Total</b>
                                <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                            </div>
                        </div>
                        <button type='submit'>PROCEED TO PAYMENT</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PlaceOrder;
