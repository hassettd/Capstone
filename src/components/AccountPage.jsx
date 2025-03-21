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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setReviews(data); // Store reviews in the state
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setError(err.message);
      });
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
              - {review.reviewText} (Rating: {review.score} / 5)
              <button onClick={() => handleDeleteReview(review.id)}>
                Delete
              </button>
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
              <strong>Watch:</strong>{" "}
              {comment.watch ? comment.watch.name : "Unknown Watch"} -{" "}
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
// 3-21 working
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../app/authSlice.jsx";
// import { useNavigate } from "react-router-dom";

// function Account() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const token = useSelector((state) => state.auth.token);
//   const [userData, setUserData] = useState(null);
//   const [reviews, setReviews] = useState([]); // To hold the reviews of the logged-in user
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (!token) {
//       // If there's no token, redirect to login page
//       navigate("/login");
//       return;
//     }

//     // Fetch user details from the API
//     fetch("https://capstone-backend2-2gcs.onrender.com/api/auth/me", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`Error ${response.status}: ${response.statusText}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setUserData(data);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching account data:", err);
//         setError(err.message);
//         setIsLoading(false);
//       });

//     // Fetch reviews for the logged-in user
//     fetch("https://capstone-backend2-2gcs.onrender.com/api/reviews/me", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`Error ${response.status}: ${response.statusText}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setReviews(data); // Store reviews in the state
//       })
//       .catch((err) => {
//         console.error("Error fetching reviews:", err);
//         setError(err.message);
//       });
//   }, [token, navigate]);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading account data: {error}</div>;

//   return (
//     <div className="account-page">
//       <h2>Account Details</h2>
//       <p>
//         <strong>Username:</strong> {userData.username}
//       </p>
//       <p>
//         <strong>Email:</strong> {userData.email}
//       </p>

//       <h3>Your Reviews</h3>
//       {reviews && reviews.length > 0 ? (
//         <ul>
//           {reviews.map((review) => (
//             <li key={review.id}>
//               <strong>Watch:</strong>
//               {review.watch
//                 ? `${review.watch.brand} ${review.watch.model}`
//                 : "Unknown Watch"}{" "}
//               -{review.reviewText} (Rating: {review.score} / 5)
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No reviews yet</p>
//       )}

//       <h3>Your Comments</h3>
//       {userData.comments && userData.comments.length > 0 ? (
//         <ul>
//           {userData.comments.map((comment) => (
//             <li key={comment.id}>
//               <strong>Watch:</strong>{" "}
//               {comment.watch ? comment.watch.name : "Unknown Watch"} -{" "}
//               {comment.commentText}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No comments yet</p>
//       )}

//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// }

// export default Account;
// 3-21 working version
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../app/authSlice.jsx";
// import { useNavigate } from "react-router-dom";

// function Account() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const token = useSelector((state) => state.auth.token);
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (!token) {
//       // If there's no token, redirect to login page
//       navigate("/login");
//       return;
//     }

//     // Fetch user details from the API
//     fetch("https://capstone-backend2-2gcs.onrender.com/api/auth/me", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`Error ${response.status}: ${response.statusText}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setUserData(data);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching account data:", err);
//         setError(err.message);
//         setIsLoading(false);
//       });
//   }, [token, navigate]);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading account data: {error}</div>;

//   return (
//     <div className="account-page">
//       <h2>Account Details</h2>
//       <p>
//         <strong>Username:</strong> {userData.username}
//       </p>

//       <p>
//         <strong>Email:</strong> {userData.email}
//       </p>

//       <h3>Your Reviews</h3>
//       {userData.reviews && userData.reviews.length > 0 ? (
//         <ul>
//           {userData.reviews.map((review) => (
//             <li key={review.id}>
//               <strong>Watch:</strong> {review.watchName} - {review.reviewText}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No reviews yet</p>
//       )}

//       <h3>Your Comments</h3>
//       {userData.comments && userData.comments.length > 0 ? (
//         <ul>
//           {userData.comments.map((comment) => (
//             <li key={comment.id}>
//               <strong>Watch:</strong> {comment.watchName} -{" "}
//               {comment.commentText}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No comments yet</p>
//       )}

//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// }

// export default Account;
// 3-19 version
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../app/authSlice.jsx";
// import { useNavigate } from "react-router-dom";

// function Account() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const token = useSelector((state) => state.auth.token);
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (!token) {
//       // If there's no token, redirect to login page
//       navigate("/login");
//       return;
//     }

//     // Fetch user details from the API
//     fetch("https://capstone-backend2-ssa6.onrender.com/api/auth/me", {
//       // Replace with the correct URL for your API
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`Error ${response.status}: ${response.statusText}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setUserData(data);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching account data:", err);
//         setError(err.message);
//         setIsLoading(false);
//       });
//   }, [token, navigate]);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading account data: {error}</div>;

//   return (
//     <div>
//       <h2>Account Details</h2>
//       <p>
//         <strong>Username:</strong> {userData.username}
//       </p>

//       <p>
//         <strong>Email:</strong> {userData.email}
//       </p>

//       <h3>Your Reviews</h3>
//       {userData.reviews && userData.reviews.length > 0 ? (
//         <ul>
//           {userData.reviews.map((review) => (
//             <li key={review.id}>
//               <strong>Watch:</strong> {review.watchName} - {review.reviewText}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No reviews yet</p>
//       )}

//       <h3>Your Comments</h3>
//       {userData.comments && userData.comments.length > 0 ? (
//         <ul>
//           {userData.comments.map((comment) => (
//             <li key={comment.id}>
//               <strong>Watch:</strong> {comment.watchName} -{" "}
//               {comment.commentText}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No comments yet</p>
//       )}

//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// }

// export default Account;
