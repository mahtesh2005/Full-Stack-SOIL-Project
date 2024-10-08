import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from '@apollo/client';
import './BlockAndUnblock.css';

// Query to fetch users
const GET_USERS = gql`
  query {
    users {
      userID
      username
      isBlocked
    }
  }
`;

// Mutation to block or unblock a user
const BLOCK_USER = gql`
  mutation blockUser($userID: Int!, $isBlocked: Boolean!) {
    blockUser(input:{
      userID: $userID
      isBlocked: $isBlocked
    }) {
      userID
      isBlocked
    }
  }
`;

function BlockAndUnblock() {
  const { loading, error, data } = useQuery(GET_USERS);
  const [blockUserMutation] = useMutation(BLOCK_USER);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!loading && data) {
      setUsers(data.users);
    }
  }, [loading, data]);

  const handleUserBlock = async (userID, isBlocked) => {
    try {
      // Toggle the isBlocked value
      isBlocked = !isBlocked;
  
      const { data } = await blockUserMutation({
        variables: { userID, isBlocked }
      });
  
      // Update the users state to reflect the updated isBlocked value
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.userID === userID ? { ...user, isBlocked } : user
        )
      );
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
    }
  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="block-unblock-userPage">
      <h1 className="block-unblock-h1">Users</h1>
      <ul className="block-unblock-ul">
        {users.map(user => (
          <li className="block-unblock-li" key={user.userID}>
            User ID: {user.userID} | Username: {user.username}
            <button className="block-unblock-button" onClick={() => handleUserBlock(user.userID, user.isBlocked)}>
              {user.isBlocked ? 'Unblock' : 'Block'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlockAndUnblock;
