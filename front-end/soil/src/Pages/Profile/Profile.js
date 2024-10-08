import React, { useState, useEffect } from "react";
import { getUser, getProfileData, removeUser, verifyUser, updateUser } from "../../Components/Data/userInfo";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile(props) {
  const navigate = useNavigate();
  const [user, setUserState] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [infoForm, setinfoForm] = useState(false);
  const [Info, setInfo] = useState({ username: "", email: "", newPassword: "", currPassword: "" });
  const [confPassword, setConfPassword] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const fetchUser = async () => {
    const storedID = localStorage.getItem('userID');
    if (storedID) {
      const fetchedUser = await getUser('id', storedID);
      setUserState(fetchedUser);
      console.log(fetchedUser);

      const fetchedProfileData = await getProfileData(fetchedUser.userID);
      setProfileData(fetchedProfileData);
      console.log(fetchedProfileData);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEditInfo = () => {
    setinfoForm(true);
    setEditMessage("");
    setDeleteConfirmation(false);
  };

  const deleteUser = () => {
    setDeleteConfirmation(true);
    setinfoForm(false);
  };

  const confirmDelete = async () => {
    try {
      const isPasswordValid = await verifyUser(user.email, Info.currPassword);
      console.log(isPasswordValid);

      if (!isPasswordValid) {
        setEditMessage("Incorrect Password");
        return;
      }

      await removeUser(user.username);
      setEditMessage("Success, Bye :)");

      setTimeout(() => {
        navigate("/");
        localStorage.removeItem('userID');
        props.logoutUser()
        setDeleteConfirmation(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to delete user:", error);
      setEditMessage("Failed to delete user");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let { username, email, newPassword, currPassword } = Info;

    const isPasswordValid = await verifyUser(user.email, Info.currPassword);

    if (!isPasswordValid) {
      setEditMessage("Incorrect Password");
      return;
    }

    if (newPassword !== confPassword) {
      setEditMessage("Passwords do not match.");
      return;
    }

    if (username && username !== user.username) {
      const userExists = await getUser('username', username);
      if (userExists !== null) {
        setEditMessage("This username is already taken!");
        return false;
      }
    }

    if (email && email !== user.email) {
      const emailExists = await getUser('email', email);
      if (emailExists !== null) {
        setEditMessage("This email is already taken!");
        return false;
      }
    }

    const updatedPassword = newPassword !== "" ? newPassword : currPassword;
    username = username !== "" ? username : user.username;
    email = email !== "" ? email : user.email;

    const updatedUser = { ...user, username, email, password: updatedPassword };
    props.changeUserName(updatedUser.username)
    console.log(updatedUser)

    try {
      const updatedUserData = await updateUser(updatedUser);
      setEditMessage("Success");
      setUserState(updatedUserData)
      console.log(updatedUserData)

      setTimeout(() => {
        setinfoForm(false);
        setInfo({ username: "", email: "", newPassword: "", currPassword: "" });
        setConfPassword("");
      }, 1500);

    } catch (error) {
      setEditMessage("Error updating user");
    }
  };

  const handleViewPreviousOrders = () => {
    navigate("/orders");
  };

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="profile-info-container">
      <div className="profile-info-wrapper">
        <h1>Username: {user.username}</h1>
        <h1>Email: {user.email}</h1>
        {profileData && <h1>Date Of Joining: {profileData.dateOfJoining}</h1>}

        {!infoForm && !deleteConfirmation && (
          <div className="edit-profile-buttons">
            <button onClick={handleEditInfo}>Edit User Details</button>
            <button onClick={deleteUser}>Delete User</button>
          </div>
        )}

        {infoForm && (
          <div className="edit-profile-form">
            <form onSubmit={handleSubmit}>
              <div className="profile-input-box">
                <input placeholder="Change Name" name="username" value={Info.username} onChange={handleInputChange}></input>
              </div>
              <div className="profile-input-box">
                <input placeholder="Change Email" name="email" value={Info.email} onChange={handleInputChange}></input>
              </div>
              <div className="profile-input-box">
                <input placeholder="Change Password" type="password" name="newPassword" value={Info.newPassword} onChange={handleInputChange}></input>
              </div>
              <div className="profile-input-box">
                <input placeholder="Confirm New Password" type="password" value={confPassword} onChange={(event) => setConfPassword(event.target.value)} />
              </div>
              <div className="profile-input-box">
                <input placeholder="Current Password" type="password" name="currPassword" value={Info.currPassword} onChange={handleInputChange} required/>
              </div>
              <div className="button-container">
                <button>Save</button>
                <button onClick={() => {
                  setinfoForm(false);
                  setInfo({ name: "", email: "", newPassword: "", currPassword: "" });
                  setConfPassword("");
                }}>Cancel</button>
              </div>
            </form>
            {editMessage && <h2>{editMessage}</h2>}
          </div>
        )}

        {deleteConfirmation && (
          <div>
            <p>Enter your password to confirm deletion:</p>
            <input placeholder="Current Password" type="password" name="currPassword" value={Info.currPassword} onChange={handleInputChange}></input>
            <button onClick={confirmDelete}>Confirm</button>
            <button onClick={() => setDeleteConfirmation(false)}>No</button>
            {editMessage && <h2>{editMessage}</h2>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;