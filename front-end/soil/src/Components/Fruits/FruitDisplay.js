// Importing necessary modules and components from React and the local project files.
import React, { useContext } from 'react';
import { StoreContext } from '../StoreContext'; // Importing the context to access the global store.
import FruitItem from './FruitItem'; // Importing the FruitItem component to render individual fruit items.

import "./FruitItem.css"; // Importing CSS styles specific to FruitItem.


// Functional component to display a list of fruits.
const FruitDisplay = ({ username }) => {
    // Using useContext hook to access the fruits from the global store.
    const { fruits } = useContext(StoreContext);

    // Returning JSX to render the fruit display.
    return (
        <div className='food-display' id='food-display'>
            <h2>Farm-Fresh Fruit Picks</h2> {/* Heading for the fruit display section */}
            <div className='food-display-list'>
                {/* Mapping through the fruits array to render each fruit item */}
                {fruits.map((item, index) => {
                    
                    return (
                        <FruitItem
                            key={index} // Using index as key for each FruitItem component.
                            itemID={item.itemID} // Passing item ID as a prop to FruitItem.
                            item_name={item.item_name} // Passing item name as a prop to FruitItem.
                            item_price={item.item_price} // Passing item price as a prop to FruitItem.
                            image={item.item_image} // Passing item image as a prop to FruitItem.
                            username={username} // Passing username as a prop to FruitItem.
                        />
                    );
                })}
            </div>
        </div>
    );
};

// Exporting the FruitDisplay component as the default export of this module.
export default FruitDisplay;
