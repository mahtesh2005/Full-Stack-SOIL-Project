import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { verifyUser, getUser } from "../../Components/Data/userInfo";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./Login.css";

function Login({ loginUser, isBlocked, setIsBlocked }) {
  // State for displaying error/success messages
  const [message, changeMessage] = useState("");
  // State for storing input values
  const [Info, changeInfo] = useState({ email: "", password: "" });

  // Navigation hook for redirecting users
  const navigate = useNavigate();

  // Function to handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    changeInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = Info;

    // Check if the user exists based on email
    const user = await getUser('email', email);

    if (user === null) {
      changeMessage("Email does not exist. Return to the sign up page if you have not registered.");
      return;
    }

    // Check if the user is blocked
    if (user.isBlocked) {
      setIsBlocked(true);
      return;
    }

    // Verify the user's credentials
    const verified = await verifyUser(email, password);

    if (verified !== null) {
      // If verified, log in the user
      loginUser(verified.username, verified.userID);
      changeMessage(`Success, Welcome ${verified.username}`);
      // Redirect to the homepage after a delay
      setTimeout(() => { navigate('/'); }, 1500);
      return;
    }

    // If verification fails, display an error message
    changeMessage("Invalid password, please try again.");
  };

  // Render a blocked message if the user is blocked
  if (isBlocked) {
    return (
      <div className="blocked-message">
        <h1>You have been blocked.</h1>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input type="email" placeholder="Email" name="email" value={Info.email} onChange={handleInputChange} />
            <MdEmail className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" name="password" value={Info.password} onChange={handleInputChange} />
            <FaLock className="icon" />
          </div>
          <div className="Submit">
            <button>Login</button>
          </div>

          {/* Display error/success message */}
          {message && <div className="message">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;
