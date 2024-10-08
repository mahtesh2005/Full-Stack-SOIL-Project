import React, { useContext} from 'react';
import { StoreContext } from '../StoreContext';
// eslint-disable-next-line
import Nuts_GrainsItem from './Nuts_GrainsItem';

import "../Fruits/FruitDisplay.css";


const Nuts_GrainsDisplay = ({ username }) => {
    const { nutsGrains } = useContext(StoreContext); // Access nuts_grains_list from StoreContext

    return (
        <div className='food-display' id='food-display'>
            <h2>Nutty Delights and Healthy Grains</h2>
            <div className='food-display-list'>
                {nutsGrains.map((item, index) => {
                    // Find the corresponding image from assets.js based on item name
                    
                    return (
                        // eslint-disable-next-line
                        <Nuts_GrainsItem
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

export default Nuts_GrainsDisplay;
