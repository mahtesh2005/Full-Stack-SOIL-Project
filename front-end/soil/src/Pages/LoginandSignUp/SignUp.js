import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getUser, setUser } from "../../Components/Data/userInfo";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./Login.css";

function SignUp(props) {
  // State for displaying error/success messages
  const [message, changeMessage] = useState("");
  // State for storing input values
  const [Info, changeInfo] = useState({ username: "", email: "", password: "" });
  // State for storing confirmed password
  const [confPassword, setConfPassword] = useState("");

  // Navigation hook for redirecting users
  const navigate = useNavigate();

  // Function to validate email format
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  // Function to check if password is strong
  const isStrongPassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return re.test(password);
  }

  // Function to handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    changeInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  }

  // Function to handle form validation
  const handleValidation = async () => {
    const { username, email, password } = Info;

    if (!username || !email || !password || !confPassword) {
      changeMessage("Please fill in all fields.");
      return false;
    }

    if (!validateEmail(email)) {
      changeMessage("Please enter a valid email address.");
      return false;
    }

    if (password !== confPassword) {
      changeMessage("Passwords do not match.");
      return false;
    }

    if (!isStrongPassword(password)) {
      changeMessage("Password must contain at least 8 characters including uppercase, lowercase, and special characters.");
      return false;
    }

    const userExists = await getUser('username', username);
    if (userExists !== null) {
      changeMessage("User already exists. Please log in instead.");
      return false;
    }

    const emailExists = await getUser('email', email);
    if (emailExists !== null) {
      changeMessage("Email is already in use. Please use a different email.");
      return false;
    }

    return true;
  }

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = await handleValidation();
    if (!isValid) {
      return;
    }

    // Get current date for date of joining
    const dateOfJoining = new Date().toISOString().split('T')[0];

    // Create user and set profile
    const user = await setUser({ ...Info, joined: dateOfJoining }, dateOfJoining);

    // Log in the user
    props.loginUser(user.user.username, user.user.userID)

    // Display success message and redirect after a delay
    changeMessage("Registration successful.");
    setTimeout(() => { navigate('/'); }, 1000);
  }

  return (
    <div className="login-page">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" name="username" value={Info.username} onChange={handleInputChange} />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input type="email" placeholder="Email" name="email" value={Info.email} onChange={handleInputChange} />
            <MdEmail className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" name="password" value={Info.password} onChange={handleInputChange} />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Confirm Password" value={confPassword} onChange={(event) => setConfPassword(event.target.value)} />
            <FaLock className="icon" />
          </div>
          <div className="Submit">
            <button>Sign Up</button>
          </div>
          {/* Display error/success message */}
          {message && <div className="message">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default SignUp;
