import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const getOrders = async () => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      console.error("User ID not found in local storage");
      return;
    }
    
    try {
      const response = await axios.get(`http://localhost:4000/api/orders/${userID}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleLeaveReview = (itemID, itemName) => {
    navigate(`/reviews/${itemID}/${itemName}`);
  };


  return (
    <div className='orders-container'>
      <div className="header-container">
        <h1 className="header-title">My Orders</h1>
      </div>
      {orders.length > 0 ? (
        orders.map(order => (
          <div key={order.cartID} className="order">
            <h3 className='order-id'>Order Number: {order.cartID}</h3>
            <div className='order-details'>
            <h4 className='itemName'>{order.itemName}</h4>

              <ul className='items-list'>
                <li key={order.itemID} className='item'>
                  Quantity: {order.itemQuantity} - Price: ${order.itemPrice}
                  <button className='review-button'
                    onClick={() => handleLeaveReview(order.itemID, order.itemName)}>Leave Review</button>
                </li>
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p className="no-orders">No orders found</p>
      )}
    </div>
  );
}

export default Orders;
  
