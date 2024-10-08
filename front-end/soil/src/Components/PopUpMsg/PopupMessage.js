import React from "react"; // Import React

import "../PopUpMsg/PopupMessage.css"; // Import CSS for styling

const PopupMessage = ({ message, onClose }) => {
    return (
        <div className="popup-container"> {/* Container for popup message */}
            <div className="popup-content"> {/* Content of the popup */}
                <p>{message}</p> {/* Display the message */}
                <button onClick={onClose}>Close</button> {/* Close button */}
            </div>
        </div>
    );
};

export default PopupMessage; 
