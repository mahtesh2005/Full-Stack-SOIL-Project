import React from 'react';
import { Link } from 'react-scroll'; // Importing Link component from react-scroll for smooth scrolling

import facebook_icon from "../Data/assets/facebook_icon.png"; // Importing Facebook icon
import linkedin_icon from "../Data/assets/linkedin_icon.png"; // Importing LinkedIn icon
import twitter_icon from "../Data/assets/twitter_icon.png"; // Importing Twitter icon

import "../Footer/Footer.css"; // Importing CSS styles for the footer



// Define Footer component as a functional component
const Footer = () => {
    return (
        <div className='footer' id='footer'> {/* Main container for the footer */}
            <div className='footer-content'> {/* Container for footer content */}
                <div className='footer-content-left'> {/* Left section of the footer */}
                    <img src={twitter_icon} alt='' /> {/* Twitter icon */}
                    <p>Short description about the website and whatnot</p> {/* Description */}
                </div>
                <div className='footer-content-center'> {/* Center section of the footer */}
                    <h2>COMPANY</h2> {/* Company heading */}
                    <ul> {/* Unordered list for company links */}
                        {/* Link to Home section with smooth scrolling */}
                        <Link
                            to="display-first-section"
                            spy={true}
                            smooth={true}
                            offset={-70} // Adjust this offset based on the header height
                            duration={500}
                        >
                            <li>Home</li>
                        </Link>
                        <li>About Us</li> {/* About Us link */}
                        <li>Delivery</li> {/* Delivery link */}
                        <li>Privacy Policy</li> {/* Privacy Policy link */}
                    </ul>
                </div>
                <div className='footer-content-right'> {/* Right section of the footer */}
                    <h2>GET IN TOUCH</h2> {/* Get in touch heading */}
                    <ul> {/* Unordered list for contact information */}
                        <li>97489475</li> {/* Phone number */}
                        <li>OrganicProducts@store.com</li> {/* Email */}
                    </ul>
                </div>
            </div>
            <div className='footer-social-icons'> {/* Container for social media icons */}
                <img src={facebook_icon} alt='Facebook' /> {/* Facebook icon */}
                <img src={linkedin_icon} alt='LinkedIn' /> {/* LinkedIn icon */}
                <img src={twitter_icon} alt='Twitter' /> {/* Twitter icon */}
            </div>
            <hr /> {/* Horizontal line */}
            <p className='footer-copyright'>RMIT - Full Stack Development - Code by Mohammed Ahtesh and Abdullah Abdosh</p> {/* Copyright information */}
        </div>
    )
}

export default Footer; 
