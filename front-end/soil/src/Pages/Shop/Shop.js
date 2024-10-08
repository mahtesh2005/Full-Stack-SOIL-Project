import React from 'react'; // Import React
import { Link } from 'react-scroll'; // Import Link for smooth scrolling

import FruitDisplay from '../../Components/Fruits/FruitDisplay'; // Import FruitDisplay component
import SpecialDisplay from '../../Components/Specials/SpecialDisplay'; // Import SpecialDisplay component
import VeggieDisplay from '../../Components/Vegetables/VeggieDisplay'; // Import VeggieDisplay component
import StaplesDisplay from '../../Components/Staples/StaplesDisplay'; // Import StaplesDisplay component
import Nuts_GrainsDisplay from '../../Components/Nuts_Grains/Nuts_GrainsDisplay'; // Import Nuts_GrainsDisplay component

import image4 from "../../Components/Data/assets/image4.jpg"; // Import image

import "./Shop.css"; // Import Shop component styling



const Shop = ({ username }) => { // Shop component with username prop
    return (
        <div className='content' style={{ paddingTop: '0px' }}> {/* Main container */}
            
            <div className='flex gap-[51px]'> {/* Flex container */}
                <div className='display-first-section'> {/* First section */}
                    {/* Image section */}
                    <img
                        id="slide-2"
                        src={image4}
                        alt="Landscape4"
                        style={{ width: '100%', height: '100%' }} // Adjusted style
                    />

                    <div className='content-sec-one'> {/* Content section */}
                        <h2>DISCOVER</h2> {/* Heading */}
                        <h1>OUR WEEKLY</h1> {/* Heading */}
                        <h3>SPECIALS</h3> {/* Heading */}
                        {/* Learn More button with smooth scroll */}
                        <Link to="special-display" spy={true} smooth={true} offset={50} duration={500}>
                            <button className="shop-now-btn">Learn More</button>
                        </Link>
                    </div>
                </div>

                {/* Render different displays */}
                <SpecialDisplay username={username} /> {/* SpecialDisplay component */}
                <FruitDisplay username={username} /> {/* FruitDisplay component */}
                <VeggieDisplay username={username} /> {/* VeggieDisplay component */}
                <StaplesDisplay username={username} /> {/* StaplesDisplay component */}
                <Nuts_GrainsDisplay username={username} /> {/* Nuts_GrainsDisplay component */}
            </div>
        </div>
    );
}

export default Shop; 
