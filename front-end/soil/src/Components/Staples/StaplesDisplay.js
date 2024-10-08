import React, { useContext} from 'react'; // Import React and useContext hook
import { StoreContext } from '../StoreContext'; // Import StoreContext
import "../Fruits/FruitDisplay.css"; // Import CSS for styling
import StaplesItem from './StaplesItem'; // Import StaplesItem component



const StaplesDisplay = ({ username }) => {
    const { pantryStaples } = useContext(StoreContext); // Get pantryStaples from context

    return (
        <div className='food-display' id='food-display'> {/* Container for displaying pantry staples */}
            <h2>Essential Pantry Staples</h2> {/* Heading for pantry staples */}
            <div className='food-display-list'> {/* Container for list of pantry staples */}
                {/* Map through pantryStaples and render StaplesItem component for each item */}
                {pantryStaples.map((item, index) => {

                    
                    return (
                        <StaplesItem
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

export default StaplesDisplay;
