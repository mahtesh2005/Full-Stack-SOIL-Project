import React, { useContext } from 'react';
import { StoreContext } from '../StoreContext';
import addImage from "../Data/assets/add.png";
import deleteImage from "../Data/assets/delete.png";

const SpecialItem = ({ itemID, item_name, item_price, image, username }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  const handleAddToCart = () => {
    addToCart(itemID, username);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(itemID);
  };

  return (
    <div className='product-item'>
      <div className='product-image-container'>
        <img className='product-image' src={image} alt='' />
      </div>
      <div className='content'>
        <h1>{item_name}</h1>
        {cartItems[itemID] && <p>{cartItems[itemID].itemQuantity}</p>}
        <div className='item-controls'>
          {!cartItems[itemID] ? (
            <img className='add' onClick={handleAddToCart} src={addImage} alt='' />
          ) : (
            <div className='food-item-counter'>
              <img className='minus' onClick={handleRemoveFromCart} src={deleteImage} alt='' />
              <img className='plus' onClick={handleAddToCart} src={addImage} alt='' />
            </div>
          )}
        </div>
        <h2 className='special-item-price'>${item_price}</h2>
      </div>
    </div>
  );
};

export default SpecialItem;
