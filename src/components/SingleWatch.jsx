import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetWatchDetailsQuery,
  useGetWatchReviewsQuery,
  useCreateReviewMutation,
  useCreateCommentMutation,
  useMeQuery,
} from "../app/watchApi";

const SingleWatch = () => {
  const { watchId } = useParams();
  const [watch, setWatch] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageScore, setAverageScore] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [score, setScore] = useState(1);
  const [commentTexts, setCommentTexts] = useState({});
  const [error, setError] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [imageError, setImageError] = useState(false);

  // Fetching watch details and reviews
  const {
    data: watchDetails,
    error: watchError,
    isLoading: watchLoading,
  } = useGetWatchDetailsQuery(watchId);

  const {
    data: reviewsData,
    error: reviewsError,
    isLoading: reviewsLoading,
    refetch,
  } = useGetWatchReviewsQuery(watchId);

  // RTK Query mutations for creating reviews and comments
  const [createReview] = useCreateReviewMutation();
  const [createComment] = useCreateCommentMutation();

  // Fetch current user data
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useMeQuery(undefined, {
    skip: !token, // ✅ Only run the /me query if a token exists
  });
  // const {
  //   data: userData,
  //   error: userError,
  //   isLoading: userLoading,
  // } = useMeQuery();

  useEffect(() => {
    if (watchDetails) setWatch(watchDetails);
    if (reviewsData) {
      setReviews(reviewsData);
      calculateAverageScore(reviewsData); // Recalculate the average score when reviews data changes
    }
  }, [watchDetails, reviewsData]);

  // Helper function to calculate average score
  const calculateAverageScore = (reviews) => {
    const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
    const average = reviews.length > 0 ? totalScore / reviews.length : 0;
    setAverageScore(average);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim() || score < 1 || score > 5) {
      setError("Please provide a valid review text and score.");
      return;
    }

    const scoreInt = parseInt(score, 10);
    createReview({ watchId, review: { reviewText, score: scoreInt } })
      .unwrap()
      .then((response) => {
        setReviews([response.review, ...reviews]);
        setReviewText("");
        setScore(1);
        setError("");
        refetch();
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        setError("Failed to submit review. Try logging in first.");
      });
  };

  const handleAddComment = (reviewId) => {
    const commentText = commentTexts[reviewId];
    if (!commentText.trim()) return;

    const commentData = { watchId, reviewId, comment: { commentText } };
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    createComment({ ...commentData, headers })
      .then((response) => {
        setCommentTexts((prev) => ({
          ...prev,
          [reviewId]: "",
        }));

        const newComment = response?.data?.comment;
        if (newComment) {
          setReviews((prevReviews) =>
            prevReviews.map((review) =>
              review.id === reviewId
                ? {
                    ...review,
                    comments: [...(review.comments || []), newComment],
                  }
                : review
            )
          );
        }
        refetch();
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
        setError("Failed to add comment.");
      });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCommentTextChange = (reviewId, value) => {
    setCommentTexts((prev) => ({
      ...prev,
      [reviewId]: value,
    }));
  };

  if (watchLoading || reviewsLoading || userLoading)
    return <div>Loading...</div>;
  if (watchError || userError) return <div>Error loading data</div>;

  return (
    <div className="single-watch">
      <h1>
        {watch?.name} by {watch?.brand}
      </h1>
      <p>{watch?.model}</p>

      <p>
        <img
          src={imageError ? "/default-image.jpg" : watch?.imageUrl}
          alt={watch?.name}
          style={{ maxWidth: "200px" }}
          onError={handleImageError}
        />
      </p>
      <p>{watch?.description}</p>
      <p>
        <strong>Strap Material:</strong> {watch?.strapMaterial}
      </p>
      <p>
        <strong>Metal Color:</strong> {watch?.metalColor}
      </p>
      <p>
        <strong>Movement:</strong> {watch?.movement}
      </p>
      <p>
        <strong>Case Size:</strong> {watch?.caseSize} mm
      </p>

      {averageScore !== null && (
        <h3 style={{ fontWeight: "bold", fontSize: "16px" }}>
          Average Rating:{" "}
          <span style={{ fontSize: "20px", fontWeight: "normal" }}>
            {averageScore.toFixed(1)}
          </span>{" "}
          / 5
        </h3>
      )}

      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews?.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <p>
                {review.user ? (
                  <span>
                    {review.user.username} - {review.score} / 5
                  </span>
                ) : (
                  <span>Anonymous - {review.score} / 5</span>
                )}
              </p>
              <p>{review.reviewText}</p>

              <div>
                {review.comments?.length > 0 ? (
                  review.comments.map((comment, index) => (
                    <div key={comment?.id || `${index}`}>
                      <p>
                        <strong>
                          {comment.userId === userData?.id
                            ? userData?.username
                            : "Anonymous"}
                        </strong>{" "}
                        : {comment.commentText}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}

                <div>
                  <input
                    type="text"
                    value={commentTexts[review.id] || ""}
                    onChange={(e) =>
                      handleCommentTextChange(review.id, e.target.value)
                    }
                    placeholder="Add a comment..."
                  />
                  <button onClick={() => handleAddComment(review.id)}>
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <h3>Leave a Review</h3>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleReviewSubmit}>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
          required
        />
        <div>
          <label>
            Rating:
            <select value={score} onChange={(e) => setScore(e.target.value)}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default SingleWatch;
