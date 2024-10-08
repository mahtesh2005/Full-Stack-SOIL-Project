import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home/Home';
import SignUp from './Pages/LoginandSignUp/SignUp';
import Login from './Pages/LoginandSignUp/Login';
import Shop from './Pages/Shop/Shop';
import NavBar from './Components/NavBar/NavBar';
import Gardening from './Pages/Gardening/Gardening';
import Profile from './Pages/Profile/Profile';
import ShopCart from './Pages/ShopCart/ShopCart';
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder';
import Orders from "./Pages/OrdersAndReviews/Orders";
import Payment from './Pages/Payment/Payment';
import Summary from './Pages/Summary/Summary';
import Footer from './Components/Footer/Footer';
import Reviews from './Pages/OrdersAndReviews/Reviews';

import { getUser } from './Components/Data/userInfo';

function Main() {
  const [username, setUsername] = useState(null);
  const [userID, setUserID] = useState(localStorage.getItem('userID')); // Initialize userID from localStorage
  const [isBlocked, setIsBlocked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      if (userID) {
        const user = await getUser('id', userID);
        if (user && user.username) {
          setUsername(user.username);
        } else {
          // If the user data is not valid, clear the local storage and state
          localStorage.removeItem('userID');
          setUserID(null);
        }
      }
    };

    fetchUserData();
  }, [userID]); // Only fetch when userID changes

  const loginUser = (username, userID) => {
    localStorage.setItem('userID', userID);
    setUsername(username);
    setUserID(userID);
  };

  const logoutUser = () => {
    localStorage.removeItem('userID');
    setUsername(null);
    setUserID(null);
  };

  const changeUserName = (newUsername) => {
    setUsername(newUsername);
  };

  const handleNavClick = () => {
    setIsBlocked(false); // Reset blocked state on navbar click
  };

  return (
    <div className="app">
      <NavBar username={username} logoutUser={logoutUser} onNavClick={handleNavClick} />
      <div className="main-content">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login key={location.pathname} loginUser={loginUser} isBlocked={isBlocked} setIsBlocked={setIsBlocked} />} />
          <Route path="/signup" element={<SignUp loginUser={loginUser} />} />
          <Route path="/shop" element={<Shop username={username} />} />
          <Route path="/gardening" element={<Gardening />} />
          <Route path="/profile" element={<Profile username={username} changeUserName={changeUserName} logoutUser={logoutUser} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<ShopCart username={username} />} />
          <Route path="/place-order" element={<PlaceOrder username={username} />} />
          <Route path="/payment" element={<Payment username={username} />} />
          <Route path="/summary" element={<Summary username={username} />} />
          <Route path="/reviews/:itemID/:itemName" element={<Reviews userID={userID} username={username} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default Main;
