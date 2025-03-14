import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../app/authSlice.jsx";
import { useNavigate } from "react-router-dom";

function MyReviews() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      // If there's no token, redirect to login page
      navigate("/login");
      return;
    }

    // Fetch user reviews from the API
    fetch("https://fsa-watch-store-api.com/api/reviews/me", {
      // Replace with the correct URL for your API
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
        setReviews(data); // Assuming data is an array of reviews
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading reviews: {error}</div>;

  return (
    <div>
      <h2>Your Reviews</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <h4>{review.watchName}</h4>
              <p>{review.reviewText}</p>
              <p>
                <strong>Rating:</strong> {review.rating}
              </p>
              <p>
                <strong>Posted on:</strong>{" "}
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet</p>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default MyReviews;
