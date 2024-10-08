// Tailwind CSS Styling Trial

import React from 'react';
import './Footer.css'; // Import the CSS file for additional styling

// Define an object to store shared CSS class names for reuse throughout the component
const sharedClasses = {
  textColor: 'text-zinc-400', // Sets the text color to a shade of zinc
  hoverTextColor: 'hover:text-white', // Changes the text color to white on hover
  bgZinc: 'bg-zinc-900', // Sets the background color to a shade of zinc
  flex: 'flex', // Applies flexbox display mode
  justifyBetween: 'justify-between', // Distributes space between flex items
  itemsCenter: 'items-center', // Centers flex items along the cross axis
  spaceX: 'space-x-4', // Adds horizontal spacing between child elements
  p4: 'p-4', // Adds padding of 4 units on all sides
  fontSemibold: 'font-semibold', // Applies a semi-bold font weight
  h10: 'h-10', // Sets the height to 10 units
  w10: 'w-10', // Sets the width to 10 units
  textLg: 'text-lg', // Sets the font size to large
};

// Define the Footer functional component
const Footer = () => {
  return (
    <div
      // Apply shared CSS classes to the footer container
      className={`${sharedClasses.bgZinc} ${sharedClasses.textColor} ${sharedClasses.p4} ${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter}`}
    >
      {/* Left section of the footer with logo and company name */}
      <div className={`${sharedClasses.flex} ${sharedClasses.itemsCenter} ${sharedClasses.spaceX}`}>
        <img
          src="https://placehold.co/40x40" // Placeholder image for the logo
          alt="logo" // Alt text for the image
          className={`${sharedClasses.h10} ${sharedClasses.w10}`} // Apply height and width classes to the image
        />
        <span className={`${sharedClasses.textLg} ${sharedClasses.fontSemibold}`}>
          Your Company
        </span>
      </div>

      {/* Center section of the footer with navigation links */}
      <div className={`${sharedClasses.flex} ${sharedClasses.spaceX}`}>
        <a href="#" className={`${sharedClasses.textColor} ${sharedClasses.hoverTextColor}`}>
          Privacy Policy
        </a>
        <a href="#" className={`${sharedClasses.textColor} ${sharedClasses.hoverTextColor}`}>
          Terms of Service
        </a>
        <a href="#" className={`${sharedClasses.textColor} ${sharedClasses.hoverTextColor}`}>
          Contact Us
        </a>
      </div>

      {/* Right section of the footer with copyright information */}
      <div className={sharedClasses.textColor}>&copy; 2023 Your Company. All rights reserved.</div>
    </div>
  );
}

export default Footer;
