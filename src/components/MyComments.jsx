import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../app/authSlice.jsx";
import { useNavigate } from "react-router-dom";

function MyComments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      // If there's no token, redirect to login page
      navigate("/login");
      return;
    }

    // Fetch user comments from the API
    fetch("https://capstone-backend2-2gcs.onrender.com/api/comments/me", {
      
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
        console.log("Fetched comments:", data); // Log the structure of the fetched data
        setComments(data); // Assuming data is an array of comments
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading comments: {error}</div>;

  return (
    <div>
      <h2>Your Comments</h2>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <h4>{comment.watchName}</h4>
              <p>{comment.commentText}</p>
              <p>
                <strong>Posted on:</strong>{" "}
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
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

export default MyComments;
