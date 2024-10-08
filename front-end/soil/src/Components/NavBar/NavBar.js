import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { StoreContext } from '../StoreContext'; 

import Home1 from "../../Components/Data/assets/Home1.jpg";
import basket_icon from '../../Components/Data/assets/shopping-basket.png';
import logo_icon from '../../Components/Data/assets/logo.jpg';

import './NavBar.css'; 

function NavBar(props) {
    const [showDropdown, setShowDropdown] = useState(false);
    const { cartItems, clearCart } = useContext(StoreContext); // Access clearCart from StoreContext
    const navigate = useNavigate();

    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const logoutAndClearCart = () => {
        clearCart(); // Call clearCart when user logs out
        props.logoutUser();
        navigate('/');
        props.onNavClick();
    };

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const shouldBeScrolled = scrollTop > 0;
            setIsScrolled(shouldBeScrolled);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <Link to="/" className="nav-logo-link" onClick={props.onNavClick}>
                <div className='nav-logo'>
                    <img src={logo_icon} alt="" />
                </div>
            </Link>
            <div className='bx bx-menu' id="menu-icon"></div>
            <nav>
                <ul className="nav">
                    <li><Link to="/" onClick={props.onNavClick}>Home</Link></li>
                    <li><Link to="/shop" onClick={props.onNavClick}>Shop</Link></li>
                    <li><Link to="/gardening" onClick={props.onNavClick}>Gardening</Link></li>
                    {props.username === null ?
                        <>
                            <li><Link to="/login" onClick={props.onNavClick}>Login</Link></li>
                            <li><Link to="/SignUp" onClick={props.onNavClick}>SignUp</Link></li>
                        </>
                        :
                        <></>
                    }
                </ul>
            </nav>
            <div className="profile-wrapper">
                <div className="Profile-image">
                    <Link to="/cart" className="cart-link" style={{ position: 'relative', display: 'inline-block' }} onClick={props.onNavClick}>
                        <img src={basket_icon} alt="cart-pic" style={{ width: '40px', height: '40px' }} />
                        {Object.keys(cartItems).length > 0 && (
                            <FontAwesomeIcon icon={faCircle} style={{ color: "#cc0000", position: 'absolute', top: '8px', right: '5px' }} />
                        )}
                    </Link>
                    <img src={Home1} alt="profile-pic" style={{ width: '40px', height: '40px' }} />
                </div>
                <div className="DropDown" onMouseEnter={handleDropdown} onMouseLeave={handleDropdown}>
                    {props.username !== null ? (
                        <div className="DropDown-Items">
                            <a href="#" id="TopText">
                                Welcome {props.username} <FontAwesomeIcon icon={faCaretDown} style={{ color: "#000000", position: 'relative', top: '0px', left: '3px' }} />
                            </a>
                            {showDropdown && (
                                <ul>
                                    <li><Link to="/Profile" className='profile-link' onClick={props.onNavClick}>My Profile</Link></li>
                                    <li><Link to="/Orders" className='profile-link' onClick={props.onNavClick}>Order History</Link></li>
                                    <li><button onClick={logoutAndClearCart} className='logout-link'>Logout</button></li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </header>
    );
}

export default NavBar;
