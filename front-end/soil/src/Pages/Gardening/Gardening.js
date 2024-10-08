import React from 'react'; // Import React
import { Link } from 'react-scroll'; // Import Link from react-scroll for smooth scrolling

import "./Gardening.css"; // Import Gardening component styling

import garden1 from "../../Components/Data/assets/Garden.jpg"; // Import garden images from Unsplash
import garden2 from "../../Components/Data/assets/Garden2.jpg";
import garden3 from "../../Components/Data/assets/Garden3.jpg";
import garden4 from "../../Components/Data/assets/Garden4.jpg";
import garden5 from "../../Components/Data/assets/Garden5.jpg";
import garden6 from "../../Components/Data/assets/Garden6.jpg";
import garden7 from "../../Components/Data/assets/Garden7.jpg";


function Gardening() {
    return (
        <div className='gardening'> {/* Main container for Gardening component */}
            <div> {/* First section */}
                <div className='garden-display-first-section'> {/* Container for first section display */}
                    <img
                        id='slide2'
                        src={garden1}
                        alt='Gardening'
                        style={{ width: '100%', height: '100%' }} // Adjusted style for image
                    />

                    <div className='garden-content-sec-one'> {/* Content section for first section */}
                        <h2>HOW TO GROW</h2>
                        <h1>IN YOUR OWN</h1>
                        <h3>BACKYARD</h3>
                        <Link to="garden-content" spy={true} smooth={true} offset={50} duration={500}> {/* Link for smooth scrolling */}
                            <button className="learn-more-btn">Learn More</button> {/* Learn More button */}
                        </Link>
                    </div>
                </div>

                <div className="garden-content" id="garden-content"> {/* Main content section */}
                    {/* Subsections with content */}
                    <div className="garden-content-container">
                        <div className="hero-text">
                            <h1>A Guideline To Growing At Home</h1>
                            <p>Tips and tricks to help you start growing fruits and vegetables in your backyard</p>
                        </div>
                    </div>


                    <div className='first-des'>
                        <div className='des-text'>
                            <h2> Welcome to Backyard Vegetable Gardening! </h2>
                            <p>  If you're interested in growing smaller vegetables in your backyard, you've come to the right place.
                                Our component provides useful information and tips to help you get started with your own backyard garden. </p>
                        </div>
                    </div>

                    <div className='garden-2-img'>
                        <img
                            alt='img'
                            src={garden2}
                            style={{ width: '50%', height: '30%' }} />
                    </div>


                    <div className='first-des'>
                        <div className='des-text'>
                            <h2>Planning Your Garden Space</h2>
                            <p>Picture this: a vibrant garden oasis right in your backyard, filled with lush greenery and bursting with delicious fruits and veggies.
                                But before we get ahead of ourselves, let's start with some planning. Choose a sunny spot in your yard with good drainage,
                                six hours of sunlight a day is ideal for most plants. Think about how much space you have and what you want to grow.
                                With a bit of creativity, even the smallest of spaces can be transformed into a thriving garden paradise!</p>

                        </div>
                    </div>

                    <div className='garden-3-img'>
                        <img
                            alt='img'
                            src={garden3}
                            style={{ width: '50%', height: '30%' }} />
                    </div>


                    <div className='first-des'>
                        <div className='des-text'>
                            <h2>Selecting Suitable Varieties</h2>
                            <p>Now, let's talk about the stars of the show, the fruits and veggies themselves! The best part about growing your own produce is that you get to choose exactly what you want to plant.
                                Whether you're dreaming of juicy tomatoes, crisp lettuce, or sweet strawberries, there's a world of possibilities waiting for you.
                                Look for varieties that are well-suited to your climate and growing conditions, and don't be afraid to get adventurous with your choices!</p>
                        </div>
                    </div>

                    <div className='garden-4-img'>
                        <img
                            alt='img'
                            src={garden4}
                            style={{ width: '50%', height: '30%' }} />
                    </div>


                    <div className='first-des'>
                        <div className='des-text'>
                            <h2>Preparing the Soil</h2>
                            <p>Alright, it's time to get your hands dirty, literally! Preparing the soil is key to ensuring your plants have everything they need to thrive.
                                Start by clearing the area of any weeds or debris, then loosen up the soil to give those roots plenty of room to spread out.
                                Mix in some compost or aged manure to give your plants a nutritious boost,
                                and you'll be well on your way to growing a garden that's the envy of the neighborhood!</p>
                        </div>
                    </div>

                    <div className='garden-5-img'>
                        <img
                            alt='img'
                            src={garden5}
                            style={{ width: '50%', height: '30%' }} />
                    </div>


                    <div className='first-des'>
                        <div className='des-text'>
                            <h2>Planting and Care</h2>
                            <p>Now comes the fun part, planting your garden! Follow the instructions on your seed packets or plant labels to give your fruits and veggies the best possible start.
                                Keep an eye on the weather and water your plants regularly to keep them happy and hydrated.
                                And don't forget to give them plenty of love and attention along the way, a little bit of TLC goes a long way when it comes to gardening!</p>
                        </div>
                    </div>

                    <div className='garden-6-img'>
                        <img
                            alt='img'
                            src={garden6}
                            style={{ width: '50%', height: '30%' }} />
                    </div>


                    <div className='first-des'>
                        <div className='des-text'>
                            <h2> Harvesting and Enjoying the Fruits of Your Labor</h2>
                            <p>Finally, the moment we've all been waiting for, harvest time! There's nothing quite like the feeling of picking your own ripe tomatoes or crisp cucumbers straight from the vine.
                                Get creative in the kitchen and whip up some delicious meals using your homegrown produce, or share the bounty with friends and family.
                                The possibilities are endless when you're growing your own fruits and veggies!</p>
                        </div>
                    </div>


                    <div className='garden-7-img'>
                        <img
                            alt='img'
                            src={garden7}
                            style={{ width: '50%', height: '30%' }} />
                    </div>


                </div>
            </div>
        </div >
    );
}

export default Gardening;