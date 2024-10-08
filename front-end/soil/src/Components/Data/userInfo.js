import axios from "axios";

// API host URL
const API_HOST = "http://localhost:4000";

// Function to fetch user data based on a specified key and value
async function getUser(key, value) {
    const response = await axios.get(API_HOST + `/api/users/select/${key}/${value}`);
    return response.data;
}
  
// Function to create a new user
async function setUser(user, dateOfJoining) {
    const response = await axios.post(API_HOST + `/api/users`, user);

    // After creating the user, create a corresponding profile with default values
    await createProfile(user.username, dateOfJoining, response.data.userID);

    return response.data;
}

// Function to verify user credentials during login
async function verifyUser(email, password) {
    const response = await axios.get(API_HOST + `/api/users/login`, { params: { email, password } }) 
    return response.data
}

// Function to create a new user profile with default values
async function createProfile(username, dateOfJoining, userID) {
    const profileData = {
        username,
        dateOfJoining,
        userID,
    };
    
    await axios.post(API_HOST + `/api/profiles`, profileData);
}

// Function to fetch profile data for a given user ID
async function getProfileData(userID) {
    const response = await axios.get(API_HOST + `/api/profiles/select/${userID}`);
    return response.data;
}

// Function to remove a user
async function removeUser(username) {
    const response = await axios.delete(API_HOST + `/api/users/${username}`);
    return response.data;
}

// Function to update user data
async function updateUser(user) {
    const response = await axios.put(API_HOST + `/api/users/${user.userID}`, user);
    console.log(response.data)
    return response.data;
}

// Function to add a follower for a user
async function addFollower(followerID, followedID) {
    const response = await axios.post(API_HOST + `/api/followers/follow`, { followerID, followedID });
    return response.data;
}

// Function to verify if a user is followed by another user
async function verifyFollowing(userID) {
    const response = await axios.get(API_HOST + `/api/followers/followed/${userID}`);
    return response.data;
}

// Function to remove a follower for a user
async function removeFollower(followerID, followedID) {
    console.log(followerID, followedID)
    const response = await axios.delete(API_HOST + `/api/followers/unfollow?followerID=${followerID}&followedID=${followedID}`);
    return response.data;
}

// Exporting the functions for use in other modules
export { getUser, setUser, verifyUser, getProfileData, removeUser, updateUser, addFollower, verifyFollowing, removeFollower };
