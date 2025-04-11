import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../app/authSlice.jsx";
import { useNavigate } from "react-router-dom";

function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState(null);
  const [reviews, setReviews] = useState([]); // To hold the reviews of the logged-in user
  const [comments, setComments] = useState([]); // To hold the comments of the logged-in user
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editCommentId, setEditCommentId] = useState(null); // Track which comment is being edited
  const [editedCommentText, setEditedCommentText] = useState(""); // Store the new comment text
  const [editReviewId, setEditReviewId] = useState(null); // Track which review is being edited
  const [editedReviewText, setEditedReviewText] = useState(""); // Store the new review text
  const [editedReviewScore, setEditedReviewScore] = useState(5); // Store the new review score (default to 5)

  useEffect(() => {
    if (!token) {
      // If there's no token, redirect to login page
      navigate("/login");
      return;
    }

    // Fetch user details from the API
    fetch("https://capstone-backend2-2gcs.onrender.com/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching account data:", err);
        setError(err.message);
        setIsLoading(false);
      });

    // Fetch reviews for the logged-in user
    fetch("https://capstone-backend2-2gcs.onrender.com/api/reviews/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 404) {
          // No reviews found — treat as empty list
          return [];
        }
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setReviews(data);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setError(err.message);
      });
    // .then((response) => {
    //   if (!response.ok) {
    //     throw new Error(`Error ${response.status}: ${response.statusText}`);
    //   }
    //   return response.json();
    // })
    // .then((data) => {
    //   setReviews(data); // Store reviews in the state
    // })
    // .catch((err) => {
    //   console.error("Error fetching reviews:", err);
    //   setError(err.message);
    // });

    // Fetch comments for the logged-in user
    fetch("https://capstone-backend2-2gcs.onrender.com/api/comments/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 404) {
          // No comments found — treat as empty list
          return [];
        }
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setComments(data);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setError(err.message);
      });
    // .then((response) => {
    //   if (!response.ok) {
    //     throw new Error(`Error ${response.status}: ${response.statusText}`);
    //   }
    //   return response.json();
    // })
    // .then((data) => {
    //   setComments(data); // Store comments in the state
    // })
    // .catch((err) => {
    //   console.error("Error fetching comments:", err);
    //   setError(err.message);
    // });
  }, [token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Handle delete review
  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      fetch(
        `https://capstone-backend2-2gcs.onrender.com/api/users/${userData.id}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete review");
          }
          setReviews((prevReviews) =>
            prevReviews.filter((review) => review.id !== reviewId)
          ); // Update local state
        })
        .catch((err) => {
          console.error("Error deleting review:", err);
          setError("Failed to delete review. Please try again later.");
        });
    }
  };

  // Handle delete comment
  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      const userId = userData.id;

      if (!userId) {
        console.error("User ID not found.");
        setError("User ID is missing.");
        return;
      }

      fetch(
        `https://capstone-backend2-2gcs.onrender.com/api/users/${userId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete comment");
          }
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          ); // Update local state
        })
        .catch((err) => {
          console.error("Error deleting comment:", err);
          setError("Failed to delete comment. Please try again later.");
        });
    }
  };

  // Handle update review
  const handleUpdateReview = (reviewId) => {
    if (!editedReviewText || !editedReviewScore) {
      setError("Review text and score cannot be empty.");
      return;
    }

    const userId = userData.id;

    if (!userId) {
      console.error("User ID not found.");
      setError("User ID is missing.");
      return;
    }

    fetch(
      `https://capstone-backend2-2gcs.onrender.com/api/users/${userId}/reviews/${reviewId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewText: editedReviewText,
          score: editedReviewScore,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update review");
        }
        return response.json(); // Get the updated review
      })
      .then((updatedReview) => {
        // Update the review in the local state
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId ? updatedReview : review
          )
        );
        setEditReviewId(null); // Close the edit mode
        setEditedReviewText(""); // Reset the edited review text
        setEditedReviewScore(5); // Reset the edited review score
      })
      .catch((err) => {
        console.error("Error updating review:", err);
        setError("Failed to update review. Please try again later.");
      });
  };

  // Handle update comment
  const handleUpdateComment = (commentId) => {
    if (!editedCommentText) {
      setError("Comment text cannot be empty.");
      return;
    }

    const userId = userData.id;

    if (!userId) {
      console.error("User ID not found.");
      setError("User ID is missing.");
      return;
    }

    fetch(
      `https://capstone-backend2-2gcs.onrender.com/api/users/${userId}/comments/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          commentText: editedCommentText,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update comment");
        }
        return response.json(); // Get the updated comment
      })
      .then((updatedComment) => {
        // Update the comment in the local state
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId ? updatedComment : comment
          )
        );
        setEditCommentId(null); // Close the edit mode
        setEditedCommentText(""); // Reset the edited comment text
      })
      .catch((err) => {
        console.error("Error updating comment:", err);
        setError("Failed to update comment. Please try again later.");
      });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading account data: {error}</div>;

  return (
    <div className="account-page">
      <h2>Account Details</h2>
      <p>
        <strong>Username:</strong> {userData.username}
      </p>
      <p>
        <strong>Email:</strong> {userData.email}
      </p>

      <h3>Your Reviews</h3>
      {reviews && reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <strong>Watch:</strong>
              {review.watch
                ? `${review.watch.brand} ${review.watch.model}`
                : "Unknown Watch"}{" "}
              -{" "}
              {editReviewId === review.id ? (
                <div>
                  <textarea
                    value={editedReviewText}
                    onChange={(e) => setEditedReviewText(e.target.value)}
                  />
                  <input
                    type="number"
                    value={editedReviewScore}
                    min="1"
                    max="5"
                    onChange={(e) => setEditedReviewScore(e.target.value)}
                  />
                  <button onClick={() => handleUpdateReview(review.id)}>
                    Save
                  </button>
                  <button onClick={() => setEditReviewId(null)}>Cancel</button>
                </div>
              ) : (
                <span>
                  {review.reviewText} (Rating: {review.score} / 5)
                </span>
              )}
              <button onClick={() => handleDeleteReview(review.id)}>
                Delete
              </button>
              <button
                onClick={() => {
                  setEditReviewId(review.id);
                  setEditedReviewText(review.reviewText);
                  setEditedReviewScore(review.score);
                }}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet</p>
      )}

      <h3>Your Comments</h3>
      {comments && comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>Watch:</strong>{" "}
              {comment.review && comment.review.watch
                ? `${comment.review.watch.brand} ${comment.review.watch.name}` // Correctly accessing nested data
                : "Unknown Watch"}{" "}
              -{" "}
              {editCommentId === comment.id ? (
                <div>
                  <input
                    type="text"
                    value={editedCommentText}
                    onChange={(e) => setEditedCommentText(e.target.value)}
                  />
                  <button onClick={() => handleUpdateComment(comment.id)}>
                    Save
                  </button>
                  <button onClick={() => setEditCommentId(null)}>Cancel</button>
                </div>
              ) : (
                <span>{comment.commentText}</span>
              )}
              <button onClick={() => handleDeleteComment(comment.id)}>
                Delete
              </button>
              <button
                onClick={() => {
                  setEditCommentId(comment.id);
                  setEditedCommentText(comment.commentText);
                }}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Account;
