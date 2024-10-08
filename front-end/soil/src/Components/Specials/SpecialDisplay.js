import React, { useContext } from 'react';
import { StoreContext } from '../StoreContext';
import SpecialItem from './SpecialItem';

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import { Navigation, Autoplay } from 'swiper/modules';

import "./SpecialDisplay.css";
import "../Fruits/FruitDisplay.css"
import { special_list as assets } from '../Data/assets';

const SpecialDisplay = ({ username }) => {
    const { specialItems } = useContext(StoreContext);

    return (
        <div className='special-display' id='special-display'>
            <h2 className='special-title'>Our Specials</h2>
            <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                slidesPerView={4}
                spaceBetween={0}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                className="mySwiper"
            >
                {specialItems.map((item, index) => {
                    // Find the corresponding image from assets.js based on item name
                    const itemImage = assets.find(asset => asset.name === item.item_name)?.image;
                    
                    return (
                        <SwiperSlide key={index}>
                            <SpecialItem
                                key={index}
                                itemID={item.itemID}
                                item_name={item.item_name}
                                item_price={item.item_price}
                                image={itemImage} // Pass the image from assets.js as prop
                                username={username}
                            />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default SpecialDisplay;
