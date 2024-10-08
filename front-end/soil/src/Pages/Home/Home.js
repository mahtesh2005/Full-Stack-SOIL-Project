import React from "react";
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import { Navigation, Autoplay } from 'swiper/modules';

import Home1 from "../../Components/Data/assets/Home1.jpg";
import Home2 from "../../Components/Data/assets/Home2.jpg";
import Home3 from "../../Components/Data/assets/Home3.jpg";
import farmer from "../../Components/Data/assets/farmer.jpg"; // image by gpointstudio on Freepik
import sustainable from "../../Components/Data/assets/sustainable.jpg"; // Photo by Noah Buscher on Unsplash
import clients from "../../Components/Data/assets/clients.jpg"; // Image by DC Studio on Freepik
import "./Home.css";

function Home() {
    return (
        <div>
            <div className="swiper-container" style={{ marginTop: '0px' }}>
            <Swiper
            modules={[Navigation, Autoplay]}
                navigation={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
            >
                <SwiperSlide>
                    <div className='display-first-section'>
                    
                            <img
                                id="slide-1"
                                src={Home1}
                                alt="Landscape1"
                                style={{ width: '100%', height: '100%' }} // Adjusted style
                            />
                            <div className="home-content-sec-one">
                                <h2>DISCOVER</h2>
                                <h1>OUR WEEKLY</h1>
                                <h3>SPECIALS</h3>
                                <Link to="/shop">
                                    <button className="explore-btn">Shop Now</button>
                                </Link>
                            </div>
                        </div>
                    
                </SwiperSlide>

                <SwiperSlide>
                    <img
                        id="slide-2"
                        src={Home2}
                        alt="Landscape2"
                        style={{ width: '100%', height: '100%' }} // Adjusted style
                    />
                    <div className="home-content-sec-one">
                        <h2>LOGIN</h2>
                        <h1>TO SAVE ON</h1>
                        <h3>SELECTED ITEMS</h3>
                        <Link to="/login">
                            <button className="explore-btn">Log In</button>
                        </Link>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <img
                        id="slide-3"
                        src={Home3}
                        alt="Landscape3"
                        style={{ width: '100%', height: '100%' }} // Adjusted style
                    />
                    <div className="home-content-sec-one">
                        <h2>FIND OUT HOW</h2>
                        <h1>TO GROW IN</h1>
                        <h3>YOUR OWN BACKYARD</h3>
                        <Link to="/gardening">
                            <button className="explore-btn">Explore</button>
                        </Link>
                    </div>
                </SwiperSlide>
            </Swiper>
            </div>

            {/* About Us Section */}
            <section className="about-us-section">
                <div className="container">
                    <h2>About Us</h2>
                    <p>SOIL is a long-term organic food grocer with several store locations around Melbourne. Our mission is to provide the highest quality organic food 
                        to our community while promoting sustainable living practices.
                         We believe that by supporting local farmers and producers, we can create a healthier and more environmentally conscious society.</p>

                    <img
                        id="sustainable-img"
                        src={sustainable}
                        alt="sustainable-img"
                        style={{ width: '100%', height: '80%' }} // Adjusted style
                    />
                </div>
            </section>

            {/* Our Journey Section */}
            <section className="about-us-section">
                <div className="container">
                    <h2>Our Journey</h2>
                    <p>Our journey began with a passion for organic farming and a desire to share the benefits of fresh, chemical-free produce with others.
                         Over the years, we have grown into a trusted source for organic groceries, offering a wide range of products to meet the diverse needs of our customers.</p>
                    <p>In addition to our retail offerings, we also host educational seminars and workshops on topics such as nutrition, healthy cooking, and sustainable agriculture.
                         Our goal is not just to sell food but to empower our customers with knowledge and tools to make informed choices about their health and the environment.</p>
                    <img
                        id='farmer-img'
                        src={clients}
                        alt="farmer-img"
                        style={{ width: '100%', height: '80%' }} // Adjusted style
                    />
                </div>
            </section>

            {/* Our Goals and Values Section */}
            <section className="goals-values-section">
                <div className="container">
                    <h2>Our Goals and Values</h2>
                    <ul>
                        <li>Provide premium organic food to our community.</li>
                        <li>Promote sustainable farming practices and environmental conservation.</li>
                        <li>Support local farmers, artisans, and producers.</li>
                        <li>Empower our customers with knowledge through educational programs and workshops.</li>
                        <li>Foster a sense of community and connection among like-minded individuals.</li>
                        <li>Continuously innovate and improve to meet the evolving needs of our customers.</li>
                    </ul>

                    <img
                        id='farmer-img'
                        src={farmer}
                        alt="farmer-img"
                        style={{ width: '100%', height: '100%' }} // Adjusted style
                    />
                </div>
            </section>
        </div>
    );
}

export default Home;
