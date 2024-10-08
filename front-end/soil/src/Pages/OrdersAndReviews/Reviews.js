import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './Reviews.css';
import client from "../../apollo/client";
import { getReviews, addReview, editReview, deleteReview } from "../../Components/Data/repository";
import { getUser, addFollower, removeFollower, verifyFollowing } from "../../Components/Data/userInfo";
import { gql } from "@apollo/client";
 
function Reviews(props) {
  const { itemID, itemName } = useParams();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ description: '', stars: 1 });
  const [editMode, setEditMode] = useState({ reviewID: null, description: '', stars: 1 });
  const [errorMessage, setErrorMessage] = useState('');
  const [editModeOnly, setEditModeOnly] = useState(false);
  const [followedReviewers, setFollowedReviewers] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
 
  // Fetch reviews for the item
  useEffect(() => {
    getReviews()
      .then((fetchedReviews) => {
        const itemReviews = fetchedReviews.filter(review => review.itemID === parseInt(itemID, 10));
        setReviews(itemReviews);
      })
      .catch((error) => console.error('Error fetching reviews:', error));
  }, [itemID]);
 
  // Fetch followed reviewers for the current user
  useEffect(() => {
    const fetchFollowedReviewers = async () => {
      try {
        const { followedIDs } = await verifyFollowing(props.userID);
        setFollowedReviewers(followedIDs);
      } catch (error) {
        console.error('Error fetching followed reviewers:', error);
      }
    };
 
    fetchFollowedReviewers();
  }, [props.userID]);
 
// Initialize follow status for the newly added review
useEffect(() => {
  const initializeFollowStatusForNewReview = async () => {
    if (reviews.length === 0) return; // No reviews yet
    const newReview = reviews[reviews.length - 1]; // Get the newly added review
    const { isFollowed } = await isUserFollowed(newReview.username);
    setFollowStatus(prevStatus => ({
      ...prevStatus,
      [newReview.username]: isFollowed,
    }));
  };
 
  initializeFollowStatusForNewReview();
}, [reviews]);
 
  // Memoized function to check if a user is followed
  const isUserFollowed = useCallback(async (reviewerUsername) => {
    console.log("check");
    const userFromReview = await getUser('username', reviewerUsername);
    const isFollowed = followedReviewers.includes(userFromReview.userID);
    return { isFollowed, userFromReview };
  }, [followedReviewers]);
 
  // Subscription for new, edited, and deleted reviews
  useEffect(() => {
    const addSubscription = client.subscribe({
      query: gql`
        subscription {
          review_added {
            username
            itemID
            description
            stars
          }
        }
      `,
    }).subscribe({
      next: (payload) => {
        const newReview = payload.data.review_added;
        if (newReview.itemID === parseInt(itemID, 10)) {
          setReviews((prevReviews) => [...prevReviews, newReview]);
        }
      },
    });
 
    const editSubscription = client.subscribe({
      query: gql`
        subscription {
          review_edited {
            reviewID
            username
            itemID
            description
            stars
          }
        }
      `,
    }).subscribe({
      next: (payload) => {
        const editedReview = payload.data.review_edited;
        if (editedReview.itemID === parseInt(itemID, 10)) {
          setReviews((prevReviews) => prevReviews.map(review =>
            review.reviewID === editedReview.reviewID ? editedReview : review
          ));
        }
      },
    });
 
    const deleteSubscription = client.subscribe({
      query: gql`
        subscription {
          review_deleted {
            reviewID
            itemID
          }
        }
      `,
    }).subscribe({
      next: (payload) => {
        const deletedReview = payload.data.review_deleted;
        if (deletedReview.itemID === parseInt(itemID, 10)) {
          setReviews((prevReviews) => prevReviews.filter(review => review.reviewID !== deletedReview.reviewID));
        }
      },
    });
 
    return () => {
      addSubscription.unsubscribe();
      editSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    };
  }, [itemID, reviews]);
 
  // Function to add a review
  const handleAddReview = async () => {
    try {
      if (!newReview.description.trim()) {
        setErrorMessage('Description cannot be empty.');
        return;
      }
 
      const wordCount = newReview.description.split(' ').filter((word) => word !== '').length;
      if (wordCount > 100) {
        setErrorMessage('Description should not exceed 100 words.');
        return;
      }
      
      const addedReview = await addReview(props.username, parseInt(itemID, 10), newReview.description, newReview.stars);
 
      setReviews([...reviews, addedReview]);
      setNewReview({ description: '', stars: 1 });
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };
 
  // Function to edit a review
  const handleEditReview = async (reviewID) => {
    try {
      if (!editMode.description.trim()) {
        setErrorMessage("Description cannot be empty.");
        return;
      }
 
      const wordCount = editMode.description.split(" ").filter(word => word !== "").length;
      if (wordCount > 100) {
        setErrorMessage("Description should not exceed 100 words.");
        return;
      }
 
      const editedReview = await editReview(reviewID, editMode.description, editMode.stars);
 
      setEditMode({ reviewID: null, description: "", stars: 1 });
      setEditModeOnly(false);
      getReviews()
        .then(fetchedReviews => {
          const itemReviews = fetchedReviews.filter(review => review.itemID === parseInt(itemID, 10));
          setReviews(itemReviews);
        })
        .catch(error => console.error("Error fetching reviews:", error));
    } catch (error) {
      console.error("Error editing review:", error);
    }
  };
 
  // Function to delete a review
  const handleDeleteReview = async (reviewID) => {
    try {
      const deleted = await deleteReview(reviewID);
      if (deleted) {
        setReviews(reviews.filter(review => review.reviewID !== reviewID));
      } else {
        console.error("Error deleting review: Review not found");
      }
    } catch (error) {
      console.error
      ("Error deleting review:", error);
    }
  };
 
  // Function to handle click on edit button
  const handleEditButtonClick = (reviewID) => {
    const selectedReview = reviews.find(review => review.reviewID === reviewID);
    setEditMode({ reviewID, description: selectedReview.description, stars: selectedReview.stars });
    setEditModeOnly(true);
  };
    
  // Function to exit edit mode
  const exitEditMode = () => {
    setEditMode({ reviewID: null, description: '', stars: 1 });
    setEditModeOnly(false);
  };
 
  // Function to handle star hover
  const handleStarHover = (star) => {
    if (!editModeOnly) return;
    setNewReview({ ...newReview, stars: star });
  };
 
  // Function to handle star click
  const handleStarClick = (star) => {
    if (!editModeOnly) return;
    setNewReview({ ...newReview, stars: star });
  };
 
  // Function to handle follow/unfollow
  const handleFollow = async (followedUsername) => {
    try {
      // Check if the reviewer is the current user
      if (followedUsername === props.username) {
        console.log("This is your own review.");
        return;
      }
 
      const { isFollowed, userFromReview } = await isUserFollowed(followedUsername);
      if (!userFromReview) {
        console.error(`User not found: ${followedUsername}`);
        return;
      }
      const followedID = userFromReview.userID;
 
      if (isFollowed) {
        // If already following, unfollow the reviewer
        await removeFollower(props.userID, followedID);
        setFollowedReviewers(prev => prev.filter(id => id !== followedID));
        setFollowStatus(prev => ({ ...prev, [followedUsername]: false }));
      } else {
        // If not following, follow the reviewer
        await addFollower(props.userID, followedID);
        setFollowedReviewers(prev => [...prev, followedID]);
        setFollowStatus(prev => ({ ...prev, [followedUsername]: true }));
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };
 
  return (
    <div className="reviews-container">
      <h1 className="reviews-header">Reviews for {itemName}</h1>
      <ul className="reviews-list">
        {/* Render edit mode if editModeOnly is true */}
        {editModeOnly && (
          <li className="review-item">
            <div className="review-edit">
              <textarea
                className="review-textarea"
                value={editMode.description}
                onChange={e => setEditMode({ ...editMode, description: e.target.value })}
              />
                <select
                className="review-select"
                value={editMode.stars}
                onChange={e => setEditMode({ ...editMode, stars: Number(e.target.value) })}
              >
                {[0, 1, 2, 3, 4, 5].map(rating => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
              <button className="review-button" onClick={() => handleEditReview(editMode.reviewID)}>Save</button>
              <button className="review-button" onClick={exitEditMode}>Cancel</button>
            </div>
          </li>
        )}
      </ul>
      {/* Render add review form if not in edit mode */}
      {!editModeOnly && (
        <div className="add-review-container">
          <h2>Add a Review</h2>
          <textarea
            className="review-textarea"
            value={newReview.description}
            onChange={e => setNewReview({ ...newReview, description: e.target.value })}
            placeholder="Write your review"
          />
                      <p> Stars Rating:</p>
          <select
            className="review-select"
            value={newReview.stars}
            onChange={e => setNewReview({ ...newReview, stars: Number(e.target.value) })}
          >
              <option disabled>Stars rating</option>
              {[0, 1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>{rating}</option>
              ))}
            </select>
          <button className="review-button" onClick={handleAddReview}>Submit Review</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <ul className="reviews-list">
            {reviews.map(review => (
              <li className="review-item" key={review.reviewID}>
                {review.isDeleted ? (
                  <div className="review-content">
                    <p>[**** This review has been deleted by the admin ***]</p>
                  </div>
                ) : (
                  <div className="review-content">
                    <p>
                      <strong>Reviewer:</strong> {review.username}
                      {/* Render follow/unfollow button for reviewers other than the current user */}
                      {props.username !== review.username && (
                        <button className="follow-button" onClick={() => handleFollow(review.username)}>
                          {followStatus[review.username] ? 'Unfollow' : 'Follow'}
                        </button>
                      )}
                    </p>
                    <p><strong>Description:</strong> {review.description}</p>
                    <p><strong>Rating:</strong> {[...Array(review.stars)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
                    ))}</p>
                    {/* Render edit and delete buttons for reviews by the current user */}
                    {props.username === review.username && (
                      <div className="review-actions">
                        <button className="review-button" onClick={() => handleEditButtonClick(review.reviewID)}>Edit</button>
                        <button className="review-button" onClick={() => handleDeleteReview(review.reviewID)}>Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
 
export default Reviews;