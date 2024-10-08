import React, { useContext } from 'react';
import { StoreContext } from '../StoreContext';
import VeggieItem from '../Vegetables/VeggieItem';

import "../Fruits/FruitDisplay.css";
import { vegetables_list as assets } from '../Data/assets'; // Import the vegetable items from assets.js

const VeggieDisplay = ({ username }) => {
    const { vegetables } = useContext(StoreContext); // Get vegetables from context

    return (
        <div className='food-display' id='food-display'>
            <h2>Fresh Garden Greens</h2>
            <div className='food-display-list'>
                {vegetables.map((item, index) => {
                    // Find the corresponding image from assets.js based on item name
                    //const itemImage = assets.find(asset => asset.name === item.item_name)?.image;
                    
                    return (
                        <VeggieItem
                            key={index}
                            itemID={item.itemID}
                            item_name={item.item_name}
                            item_price={item.item_price}
                            image={item.item_image} // Pass the image from assets.js as prop
                            username={username}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default VeggieDisplay;
