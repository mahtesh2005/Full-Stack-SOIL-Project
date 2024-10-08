import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from '@apollo/client';
import BadWords from 'bad-words';
import './getBadReviews.css';

const API_KEY = "randoAPIBOZO";
const endpoint = "https://api.openai.com/v1/moderations";
const badWordsFilter = new BadWords();

// Query to fetch unflagged reviews
const GET_UNFLAGGED_REVIEWS = gql`
  query getUnflaggedReviews {
    reviewsByFlagged(isFlagged: false, isDeleted: false) {
      reviewID
      username
      description
      stars
      item {
        item_name
      }
    }
  }
`;

// Mutation to delete a review
const DELETE_REVIEW = gql`
  mutation adminDeleteReview($reviewID: Int!) {
    adminDeleteReview(reviewID: $reviewID)
  }
`;

// Mutation to flag a review
const FLAG_REVIEW = gql`
  mutation flagReview($reviewID: Int!) {
    flagReview(reviewID: $reviewID) {
      reviewID
      isFlagged
    }
  }
`;

function GetBadReviews() {
  const { loading, error, data, refetch } = useQuery(GET_UNFLAGGED_REVIEWS);
  const [inappropriateReviews, setInappropriateReviews] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (!loading && data) {
      analyzeReviews(data.reviewsByFlagged);
    }
  }, [loading, data]);

  const [deleteReviewMutation] = useMutation(DELETE_REVIEW);
  const [flagReviewMutation] = useMutation(FLAG_REVIEW);

  const analyzeReviews = async (reviews) => {
    const flaggedReviews = [];

    for (const review of reviews) {
      let flags = [];

      // Check for profanity using bad-words
      if (badWordsFilter.isProfane(review.description)) {
        flags.push("Profanity");
        console.log(review);
      }

      // Analyze review using OpenAI
      const openAIResult = await openAiAnalyse(review);
      if (openAIResult && openAIResult.results && openAIResult.results[0].flagged) {
        const categories = openAIResult.results[0].categories;
        for (const category in categories) {
          if (categories[category]) {
            flags.push(category);
          }
        }
      }

      if (flags.length > 0) {
        flaggedReviews.push({
          reviewID: review.reviewID,
          username: review.username,
          description: review.description,
          flags: flags
        });
      }
    }

    setInappropriateReviews(flaggedReviews);
  };

  const openAiAnalyse = async (review) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          input: review.description
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error analyzing review:", error);
      return null;
    }
  };

  const confirmAndDeleteReview = (reviewID) => {
    setConfirmAction({ type: 'delete', reviewID });
  };

  const confirmAndFlagReview = (reviewID) => {
    setConfirmAction({ type: 'flag', reviewID });
  };

  const handleConfirmAction = async () => {
    if (confirmAction.type === 'delete') {
      await deleteReviewMutation({ variables: { reviewID: confirmAction.reviewID } });
    } else if (confirmAction.type === 'flag') {
      await flagReviewMutation({ variables: { reviewID: confirmAction.reviewID } });
    }
    setConfirmAction(null);
    refetch(); // Refetch reviews after action
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="reviewPage">
      {inappropriateReviews.length > 0 ? (
        <div>
          <h2>Inappropriate Reviews:</h2>
          <ul>
            {inappropriateReviews.map((result, index) => (
              <li key={index}>
                <strong>Username:</strong> {result.username}<br />
                <strong>Description:</strong> {result.description}<br />
                <em>This Review was flagged for containing the following:</em>
                <ul>
                  {result.flags.map((flag, flagIndex) => (
                    <li key={flagIndex}> {flag}</li>
                  ))}
                </ul>
                <div className="buttonContainer">
                  <button onClick={() => confirmAndDeleteReview(result.reviewID)}>Delete Review</button>
                  <button onClick={() => confirmAndFlagReview(result.reviewID)}>Flag as OK</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>No current reviews to analyze.</h2>
          <button onClick={() => refetch()}>Refresh</button>
        </div>
      )}
      {confirmAction && (
        <div className="confirmDialog">
          <p>Are you sure you want to {confirmAction.type === 'delete' ? 'delete' : 'flag'} this review?</p>
          <button onClick={handleConfirmAction}>Yes</button>
          <button onClick={() => setConfirmAction(null)}>No</button>
        </div>
      )}
    </div>
  );
}

export default GetBadReviews;