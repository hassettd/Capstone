import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../app/authSlice.jsx";
import { useNavigate } from "react-router-dom";

function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      // If there's no token, redirect to login page
      navigate("/login");
      return;
    }

    // Fetch user details from the API
    fetch("https://fsa-watch-store-api.com/api/auth/me", {
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
        setUserData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching account data:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading account data: {error}</div>;

  return (
    <div>
      <h2>Account Details</h2>
      <p>
        <strong>First Name:</strong> {userData.firstname}
      </p>
      <p>
        <strong>Last Name:</strong> {userData.lastname}
      </p>
      <p>
        <strong>Email:</strong> {userData.email}
      </p>

      <h3>Your Reviews</h3>
      {userData.reviews && userData.reviews.length > 0 ? (
        <ul>
          {userData.reviews.map((review) => (
            <li key={review.id}>
              <strong>Watch:</strong> {review.watchName} - {review.reviewText}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet</p>
      )}

      <h3>Your Comments</h3>
      {userData.comments && userData.comments.length > 0 ? (
        <ul>
          {userData.comments.map((comment) => (
            <li key={comment.id}>
              <strong>Watch:</strong> {comment.watchName} -{" "}
              {comment.commentText}
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
