import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
 
// Constants
const GRAPHQL_URL = "http://localhost:4000/graphql";
 
// Initialize Apollo Client
const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
});
 
// Functions
async function getReviews() {
  const query = gql`
    {
      reviews {
        reviewID
        username
        itemID
        description
        stars
      }
    }
  `;
 
  const { data } = await client.query({ query });
 
  return data.reviews;
}
 
async function getOrders() {
  const query = gql`
    {
      orders {
        cartID
        userID
        itemID
        itemName
        itemPrice
        itemQuantity
        totalPrice
      }
    }
  `;
 
  const { data } = await client.query({ query });
 
  return data.orders;
}
 
async function addReview(reviewID, username, itemID, description, stars) {
  const mutation = gql`
    mutation($reviewID: Int!, $username: String!, $itemID: Int!, $description: String!, $stars: Int!) {
      add_Review(reviewID: $reviewID, username: $username, itemID: $itemID, description: $description, stars: $stars) {
        reviewID
        username
        itemID
        description
        stars
      }
    }
  `;
 
  const { data } = await client.mutate({ mutation, variables: { reviewID, username, itemID, description, stars } });
 
  return data.add_Review;
}
 
async function editReview(reviewID, description, stars) {
  const mutation = gql`
    mutation($reviewID: Int!, $description: String!, $stars: Int!) {
      editReview(reviewID: $reviewID, description: $description, stars: $stars) {
        reviewID
        username
        itemID
        description
        stars
      }
    }
  `;
 
  const { data } = await client.mutate({ mutation, variables: { reviewID, description, stars } });
 
  return data.editReview;
}
 
async function deleteReview(reviewID) {
  const mutation = gql`
    mutation($reviewID: Int!) {
      adminDeleteReview(reviewID: $reviewID)
    }
  `;
 
  const { data } = await client.mutate({ mutation, variables: { reviewID } });
 
  return data.deleteReview;
}
 
async function addOrder(cartID, userID, itemID, itemName, itemPrice, itemQuantity, totalPrice) {
  const mutation = gql`
    mutation($cartID: Int!, $userID: Int!, $itemID: Int!, $itemName: String!, $itemPrice: Float!, $itemQuantity: Int!, $totalPrice: Float!) {
      add_Order(cartID: $cartID, userID: $userID, itemID: $itemID, itemName: $itemName, itemPrice: $itemPrice, itemQuantity: $itemQuantity, totalPrice: $totalPrice) {
        cartID
        userID
        itemID
        itemName
        itemPrice
        itemQuantity
        totalPrice
      }
    }
  `;
 
  const { data } = await client.mutate({ mutation, variables: { cartID, userID, itemID, itemName, itemPrice, itemQuantity, totalPrice } });
 
  return data.add_Order;
}
 
export { getReviews, addReview, editReview, deleteReview, getOrders, addOrder };
 