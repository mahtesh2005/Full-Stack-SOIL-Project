import React, { useState } from "react";
import { useQuery, useMutation, gql } from '@apollo/client';
import "./EditProducts.css";

const GET_STANDARD_ITEMS = gql`
  query GetStandardItems {
    standardItems {
      itemID
      item_name
      item_price
      category
      item_image
    }
  }
`;

const GET_SPECIAL_ITEMS = gql`
  query GetSpecialItems {
    specialItems {
      itemID
      item_name
      original_price
      item_price
      category
      item_image
    }
  }
`;

const ADD_STANDARD_ITEM = gql`
  mutation AddStandardItem($input: StandardInput!) {
    addStandardItem(input: $input) {
      itemID
      item_name
      item_price
      category
      item_image
    }
  }
`;

const ADD_SPECIAL_ITEM = gql`
  mutation AddSpecialItem($input: SpecialInput!) {
    addSpecialItem(input: $input) {
      itemID
      item_name
      original_price
      item_price
      category
      item_image
    }
  }
`;

const UPDATE_STANDARD_ITEM = gql`
  mutation UpdateStandardItem($itemID: Int!, $input: StandardInput!) {
    updateStandardItem(itemID: $itemID, input: $input) {
      itemID
      item_name
      item_price
      category
      item_image
    }
  }
`;

const UPDATE_SPECIAL_ITEM = gql`
  mutation UpdateSpecialItem($itemID: Int!, $input: SpecialInput!) {
    updateSpecialItem(itemID: $itemID, input: $input) {
      itemID
      item_name
      original_price
      item_price
      category
      item_image
    }
  }
`;

const DELETE_STANDARD_ITEM = gql`
  mutation DeleteStandardItem($itemID: Int!) {
    deleteStandardItem(itemID: $itemID)
  }
`;

const DELETE_SPECIAL_ITEM = gql`
  mutation DeleteSpecialItem($itemID: Int!) {
    deleteSpecialItem(itemID: $itemID)
  }
`;

function EditProducts() {
  const { loading: standardLoading, error: standardError, data: standardData, refetch: standardRefetch } = useQuery(GET_STANDARD_ITEMS);
  const { loading: specialLoading, error: specialError, data: specialData, refetch: specialRefetch } = useQuery(GET_SPECIAL_ITEMS);

  const [addStandardItem] = useMutation(ADD_STANDARD_ITEM);
  const [addSpecialItem] = useMutation(ADD_SPECIAL_ITEM);

  const [updateStandardItem] = useMutation(UPDATE_STANDARD_ITEM);
  const [updateSpecialItem] = useMutation(UPDATE_SPECIAL_ITEM);

  const [deleteStandardItem] = useMutation(DELETE_STANDARD_ITEM);
  const [deleteSpecialItem] = useMutation(DELETE_SPECIAL_ITEM);

  const [input, setInput] = useState({ itemID: 0, item_name: "", item_price: 0, original_price: 0, category: "", item_image: "" });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [addItemType, setAddItemType] = useState(""); // State to track the selected item type

  const handleAddStandardItem = async () => {
    try {
      const { original_price, ...inputWithoutOriginalPrice } = input; // Exclude original_price for standard item
      await addStandardItem({ variables: { input: inputWithoutOriginalPrice } });
      setInput({ itemID: 0, item_name: "", item_price: 0, category: "", item_image: "" });
      standardRefetch();
    } catch (error) {
      console.error("Error adding standard item:", error.message);
    }
  };
  
  const handleAddSpecialItem = async () => {
    try {
      await addSpecialItem({ variables: { input } }); // Include original_price for special item
      setInput({ itemID: 0, item_name: "", item_price: 0, original_price: 0, category: "", item_image: "" });
      specialRefetch();
    } catch (error) {
      console.error("Error adding special item:", error.message);
    }
  };
  

  const handleOpenPopup = (item) => {
    setInput(item);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setInput({ itemID: 0, item_name: "", item_price: 0, original_price: 0, category: "", item_image: "" });
  };

  const handleUpdateItem = async (isSpecialItem) => {
    try {
      const mutation = isSpecialItem ? updateSpecialItem : updateStandardItem;
      const { __typename, ...inputWithoutTypename } = input;  // Ensure __typename is removed
      await mutation({ variables: { itemID: input.itemID, input: inputWithoutTypename } });
      setSuccessMessage(`${input.item_name} has been updated successfully!`);
      handleClosePopup();
      isSpecialItem ? specialRefetch() : standardRefetch();
    } catch (error) {
      console.error("Error updating item:", error.message);
    }
  };

  const handleDeleteItem = async (itemID, isSpecialItem) => {
    try {
      // Get the item name based on whether it's a special item or standard item
      const itemName = isSpecialItem ? specialData.specialItems.find(item => item.itemID === itemID)?.item_name : standardData.standardItems.find(item => item.itemID === itemID)?.item_name;
  
      // Show a confirmation dialog
      const isConfirmed = window.confirm(`Are you sure you want to delete ${itemName}?`);
      if (!isConfirmed) return;
  
      // Proceed with deletion if confirmed
      const mutation = isSpecialItem ? deleteSpecialItem : deleteStandardItem;
      await mutation({ variables: { itemID } });
      setSuccessMessage(`${itemName} has been deleted successfully!`);
      isSpecialItem ? specialRefetch() : standardRefetch();
    } catch (error) {
      console.error(error.message);
    }
  };
  

  const handleChooseItemType = (type) => {
    setAddItemType(type);
  };

  if (standardLoading || specialLoading) return <p>Loading...</p>;
  if (standardError || specialError) return <p>Error: {standardError ? standardError.message : specialError.message}</p>;

  return (
    <div className="example1-container">
      {successMessage && <div className="success-message">{successMessage}</div>}
  
      {/* Display the choice between standard and special items */}
      {!addItemType && (
        <div className="choose-item-type">
          <h2>Choose Item Type</h2>
          <button onClick={() => handleChooseItemType("standard")}>Add Standard Item</button>
          <button onClick={() => handleChooseItemType("special")}>Add Special Item</button>
        </div>
      )}
  
      {/* Display the form based on the selected item type */}
      {(addItemType === "standard" || addItemType === "special") && (
        <div className="add-item-form">
          {/* Back button */}
          <button onClick={() => setAddItemType(null)} className="back-arrow">&#8592; Back</button>
          
          {/* Render form inputs based on the selected item type */}
          <input type="number" value={input.itemID || ''} onChange={(e) => setInput({ ...input, itemID: parseFloat(e.target.value) })} placeholder="Item ID" />
          <input type="text" value={input.item_name} onChange={(e) => setInput({ ...input, item_name: e.target.value })} placeholder="Item Name" />
          {addItemType === "standard" && (
            <input type="number" value={input.item_price || ''} onChange={(e) => setInput({ ...input, item_price: parseFloat(e.target.value) })} placeholder="Item Price" />
          )}
          {addItemType === "special" && (
            <>
              <input type="number" value={input.original_price || ''} onChange={(e) => setInput({ ...input, original_price: parseFloat(e.target.value) })} placeholder="Original Price" />
              <input type="number" value={input.item_price || ''} onChange={(e) => setInput({ ...input, item_price: parseFloat(e.target.value) })} placeholder="Item Price" />
            </>
          )}
          <input type="text" value={input.category} onChange={(e) => setInput({ ...input, category: e.target.value })} placeholder="Category" />
          <input type="text" value={input.item_image} onChange={(e) => setInput({ ...input, item_image: e.target.value })} placeholder="Image URL" />
          {addItemType === "standard" && (
            <button onClick={handleAddStandardItem}>Add Standard Item</button>
          )}
          {addItemType === "special" && (
            <button onClick={handleAddSpecialItem}>Add Special Item</button>
          )}
        </div>
      )}


  <div className="standard-items">
          <h2>Special Items</h2>
          {specialData.specialItems.map(item => (
            <div key={item.itemID} className="standard-item">
              <img src={item.item_image} alt={item.item_name} />
              <h2>{item.item_name}</h2>
              <p>{item.category}</p>
              <p>${item.item_price.toFixed(2)}</p>
              <button className="item-button" onClick={() => handleDeleteItem(item.itemID, true)}>Delete</button>
              <button className="item-button" onClick={() => handleOpenPopup(item)}>Update</button>
            </div>
          ))}
        </div>
  
      {/* Render standard and special items */}
      <div className="standard-items">
        <h2>Standard Items</h2>
        {standardData.standardItems.map(item => (
          <div key={item.itemID} className="standard-item">
            <img src={item.item_image} alt={item.item_name} />
            <h2>{item.item_name}</h2>
            <p>{item.category}</p>
            <p>${item.item_price.toFixed(2)}</p>
            <button className="item-button" onClick={() => handleDeleteItem(item.itemID, false)}>Delete</button>
            <button className="item-button" onClick={() => handleOpenPopup(item)}>Update</button>
          </div>
        ))}
      </div>
  

  
      {/* Render update item popup */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Update Item</h2>
            <input type="number" value={input.itemID} onChange={(e) => setInput({ ...input, itemID: parseFloat(e.target.value) })} placeholder="Item ID" />
            <input type="text" value={input.item_name} onChange={(e) => setInput({ ...input, item_name: e.target.value })} placeholder="Item Name" />
            <input type="number" value={input.item_price} onChange={(e) => setInput({ ...input, item_price: parseFloat(e.target.value) })} placeholder="Item Price" />
            <input type="text" value={input.category} onChange={(e) => setInput({ ...input, category: e.target.value })} placeholder="Category" />
            <input type="text" value={input.item_image} onChange={(e) => setInput({ ...input, item_image: e.target.value })} placeholder="Image URL" />
            <button className="item-button" onClick={() => handleUpdateItem(specialData.specialItems.some(item => item.itemID === input.itemID))}>Update</button>
            <button className="item-button" onClick={handleClosePopup}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
  
  
}

export default EditProducts;
