import React, { useEffect, useState } from 'react';
import client from "../apollo/client";
import { getReviews } from '../components/Data/repository';
import TopRatedProductsChart from '../components/TopRatedProductsBarChart'
import { gql } from '@apollo/client';
import './Home.css';
import { getOrders } from '../components/Data/repository';
import MyResponsivePie from '../components/ResponsivePieChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';



const ORDER_ADDED_SUBSCRIPTION = gql`
  subscription {
    order_added {
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

const REVIEW_ADDED_SUBSCRIPTION = gql`
  subscription {
    review_added {
      reviewID
      username
      itemID
      description
      stars
    }
  }
`;

const REVIEW_EDITED_SUBSCRIPTION = gql`
  subscription {
    review_edited {
      reviewID
      username
      itemID
      description
      stars
    }
  }
`;

const REVIEW_DELETED_SUBSCRIPTION = gql`
  subscription {
    review_deleted {
      reviewID
      itemID
    }
  }
`;

function Home() {
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [reviewsHistory, setReviewsHistory] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const subscription = client
      .subscribe({ query: ORDER_ADDED_SUBSCRIPTION })
      .subscribe({
        next: (payload) => {
          const newOrder = payload.data.order_added;
          setOrders((prevOrders) => {
            const updatedOrders = [...prevOrders, newOrder];
            updateChartData(updatedOrders);
            return updatedOrders;
          });
        },
        error: (err) => console.error("Subscription error:", err),
      });

    async function fetchOrders() {
      try {
        const ordersData = await getOrders();
        console.log("Orders Data:", ordersData); // Troubleshooting message
        setOrders(ordersData);
        updateChartData(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }

    fetchOrders();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateChartData = (orders) => {
    const orderQuantities = orders.reduce((acc, order) => {
      const existingOrder = acc.find((item) => item.id === order.itemName);
      if (existingOrder) {
        existingOrder.value += order.itemQuantity;
      } else {
        acc.push({ id: order.itemName, value: order.itemQuantity });
      }
      return acc;
    }, []);
    console.log("Chart Data updated:", orderQuantities); // Troubleshooting message
    setChartData(orderQuantities);
  };

  useEffect(() => {
    async function fetchReviews() {
      try {
        const reviewsData = await getReviews();
        setReviews(reviewsData);
        const sortedReviews = reviewsData.sort((a, b) => b.reviewID - a.reviewID); // Sort reviews by reviewID
        const lastThreeReviews = sortedReviews.slice(0, 3); // Get the three latest reviews
        setReviewsHistory(lastThreeReviews); // Set reviews to reviewsHistory with only the last three
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    fetchReviews();

    const addedSubscription = client
      .subscribe({
        query: REVIEW_ADDED_SUBSCRIPTION,
      })
      .subscribe({
        next: (payload) => {
          const newReview = payload.data.review_added;
          setReviews((prevReviews) => {
            const updatedReviews = [...prevReviews, newReview];
            const sortedReviews = updatedReviews.sort((a, b) => b.reviewID - a.reviewID); // Sort reviews by reviewID
            const lastThreeReviews = sortedReviews.slice(0, 3); // Get the three latest reviews
            setReviewsHistory(lastThreeReviews); // Set reviews to reviewsHistory with only the last three
            return updatedReviews;
          });
        },
        error: (err) => console.error("Subscription error:", err),
      });

    const editedSubscription = client
      .subscribe({
        query: REVIEW_EDITED_SUBSCRIPTION,
      })
      .subscribe({
        next: (payload) => {
          const editedReview = payload.data.review_edited;
          setReviews((prevReviews) =>
            prevReviews.map((review) =>
              review.reviewID === editedReview.reviewID ? editedReview : review
            )
          );
        },
        error: (err) => console.error("Subscription error:", err),
      });

    const deletedSubscription = client
      .subscribe({
        query: REVIEW_DELETED_SUBSCRIPTION,
      })
      .subscribe({
        next: (payload) => {
          const deletedReview = payload.data.review_deleted;
          setReviews((prevReviews) =>
            prevReviews.filter(
              (review) => review.reviewID !== deletedReview.reviewID
            )
          );
        },
        error: (err) => console.error("Subscription error:", err),
      });

    return () => {
      addedSubscription.unsubscribe();
      editedSubscription.unsubscribe();
      deletedSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="reviews-container">
      {reviewsHistory.map((review) => (
        <div className="review-card" key={review.reviewID}>
          <p className="username">{review.username}</p>
          <p className="description">{review.description}</p>
          <div className="stars">
            Rating:   
            {[...Array(review.stars)].map((_, i) => (
              <FontAwesomeIcon key={i} icon={faStar} className="star-icon" style={{ color: "#ffc107" }} />
            ))}
          </div>
        </div>
      ))}
  
      <div className="PieChart">
        <MyResponsivePie data={chartData} />
      </div>
  
      <div className="BarChart">
        <TopRatedProductsChart reviews={reviews} />
      </div>
    </div>
  );
  
}

export default Home;