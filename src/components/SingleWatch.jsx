import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  useGetWatchDetailsQuery,
  useGetWatchReviewsQuery,
  useCreateCommentMutation,
} from "../app/watchApi"; // Import API hooks

const SingleWatch = () => {
  const { watchId } = useParams();
  const [watch, setWatch] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageScore, setAverageScore] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [score, setScore] = useState(1);
  const [commentText, setCommentText] = useState(""); // New state for comments
  const [error, setError] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token")); // Store the token in local storage
  const [imageError, setImageError] = useState(false); // State to handle image errors

  // Use the Redux API hooks for fetching watch details and reviews
  const {
    data: watchDetails,
    error: watchError,
    isLoading: watchLoading,
  } = useGetWatchDetailsQuery(watchId);
  const {
    data: reviewsData,
    error: reviewsError,
    isLoading: reviewsLoading,
  } = useGetWatchReviewsQuery(watchId);

  // Create a new comment
  const [createComment] = useCreateCommentMutation();

  useEffect(() => {
    if (watchDetails) setWatch(watchDetails);
    if (reviewsData) setReviews(reviewsData);
  }, [watchDetails, reviewsData]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    // Make sure reviewText is not empty and score is between 1 and 5
    if (!reviewText.trim() || score < 1 || score > 5) {
      setError("Please provide a valid review text and score.");
      return;
    }

    axios
      .post(
        `/api/watches/${watchId}/reviews`,
        { reviewText, score },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setReviews([...reviews, response.data.review]);
        setReviewText("");
        setScore(1);
        setError(""); // Clear error if submission is successful
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        setError("Failed to submit review. Please try again later.");
      });
  };

  // Handle adding a comment
  const handleAddComment = (reviewId) => {
    if (!commentText.trim()) return; // Don't allow empty comments

    const commentData = {
      watchId,
      reviewId,
      comment: { text: commentText },
    };

    createComment(commentData) // Trigger the create comment mutation
      .then(() => {
        setCommentText(""); // Clear the input field
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
        setError("Failed to add comment.");
      });
  };

  // Function to handle image errors
  const handleImageError = () => {
    console.log("Image failed to load, fallback to default image");
    setImageError(true); // Set image error state if the image fails to load
  };

  if (watchLoading || reviewsLoading) return <div>Loading...</div>;
  if (watchError || reviewsError) return <div>Error loading data</div>;

  return (
    <div className="single-watch">
      {/* Watch details section */}
      <h1>
        {watch?.name} by {watch?.brand}
      </h1>
      <p>{watch?.model}</p>

      <p>
        {/* Watch Image with error handling */}
        <img
          src={imageError ? "/default-image.jpg" : watch?.imageUrl} // Use imageUrl from API data
          alt={watch?.name}
          style={{ maxWidth: "200px" }}
          onError={handleImageError} // Handle image loading error
        />
      </p>
      <p>{watch?.description}</p>
      {/* New fields to display */}
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

      {averageScore && <h3>Average Rating: {averageScore?.toFixed(2)} / 5</h3>}

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews?.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews?.map((review) => (
            <div key={review.id} className="review">
              <p>
                {review.user.username} - {review.score} / 5
              </p>
              <p>{review.reviewText}</p>

              {/* Comments Section for Each Review */}
              <div>
                {review.comments?.length > 0 ? (
                  review.comments.map((comment) => (
                    <div
                      key={comment.commentId}
                      style={{ marginBottom: "10px" }}
                    >
                      <p>
                        <strong>{comment.author}</strong>: {comment.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}

                {/* Add Comment */}
                <div>
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
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

        {/* Review Submission Form */}
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
    </div>
  );
};

export default SingleWatch;
// 3-20 starting version
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import {
//   useGetWatchDetailsQuery,
//   useGetWatchReviewsQuery,
//   useCreateCommentMutation,
// } from "../app/watchApi"; // Import API hooks

// const SingleWatch = () => {
//   const { watchId } = useParams();
//   const [watch, setWatch] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [averageScore, setAverageScore] = useState(null);
//   const [reviewText, setReviewText] = useState("");
//   const [score, setScore] = useState(1);
//   const [commentText, setCommentText] = useState(""); // New state for comments
//   const [error, setError] = useState("");
//   const [token, setToken] = useState(localStorage.getItem("token")); // Store the token in local storage
//   const [imageError, setImageError] = useState(false); // State to handle image errors

//   // Use the Redux API hooks for fetching watch details and reviews
//   const {
//     data: watchDetails,
//     error: watchError,
//     isLoading: watchLoading,
//   } = useGetWatchDetailsQuery(watchId);
//   const {
//     data: reviewsData,
//     error: reviewsError,
//     isLoading: reviewsLoading,
//   } = useGetWatchReviewsQuery(watchId);

//   // Create a new comment
//   const [createComment] = useCreateCommentMutation();

//   useEffect(() => {
//     if (watchDetails) setWatch(watchDetails);
//     if (reviewsData) setReviews(reviewsData);
//   }, [watchDetails, reviewsData]);

//   const handleReviewSubmit = (e) => {
//     e.preventDefault();

//     // Make sure reviewText is not empty and score is between 1 and 5
//     if (!reviewText.trim() || score < 1 || score > 5) {
//       setError("Please provide a valid review text and score.");
//       return;
//     }

//     axios
//       .post(
//         `/api/watches/${watchId}/reviews`,
//         { reviewText, score },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       .then((response) => {
//         setReviews([...reviews, response.data.review]);
//         setReviewText("");
//         setScore(1);
//         setError(""); // Clear error if submission is successful
//       })
//       .catch((error) => {
//         console.error("Error submitting review:", error);
//         setError("Failed to submit review. Please try again later.");
//       });
//   };

//   // Handle adding a comment
//   const handleAddComment = (reviewId) => {
//     if (!commentText.trim()) return; // Don't allow empty comments

//     const commentData = {
//       watchId,
//       reviewId,
//       comment: { text: commentText },
//     };

//     createComment(commentData) // Trigger the create comment mutation
//       .then(() => {
//         setCommentText(""); // Clear the input field
//       })
//       .catch((error) => {
//         console.error("Error adding comment:", error);
//         setError("Failed to add comment.");
//       });
//   };

//   // Function to handle image errors
//   const handleImageError = () => {
//     setImageError(true); // Set image error state if the image fails to load
//   };

//   if (watchLoading || reviewsLoading) return <div>Loading...</div>;
//   if (watchError || reviewsError) return <div>Error loading data</div>;

//   return (
//     <div className="single-watch">
//       {/* Watch details section */}
//       <h1>
//         {watch?.name} by {watch?.brand}
//       </h1>
//       <p>{watch?.model}</p>

//       {/* Watch Image with error handling */}
//       <img
//         src={imageError ? "/default-image.jpg" : watch?.imageUrl} // Show default image if error
//         alt={watch?.name}
//         style={{ maxWidth: "200px" }}
//         onError={handleImageError} // Handle image loading error
//       />

//       <p>{watch?.description}</p>
//       {/* New fields to display */}
//       <p>
//         <strong>Strap Material:</strong> {watch?.strapMaterial}
//       </p>
//       <p>
//         <strong>Metal Color:</strong> {watch?.metalColor}
//       </p>
//       <p>
//         <strong>Movement:</strong> {watch?.movement}
//       </p>
//       <p>
//         <strong>Case Size:</strong> {watch?.caseSize} mm
//       </p>

//       {averageScore && <h3>Average Rating: {averageScore?.toFixed(2)} / 5</h3>}

//       {/* Reviews Section */}
//       <div className="reviews-section">
//         <h2>Reviews</h2>
//         {reviews?.length === 0 ? (
//           <p>No reviews yet.</p>
//         ) : (
//           reviews?.map((review) => (
//             <div key={review.id} className="review">
//               <p>
//                 {review.user.username} - {review.score} / 5
//               </p>
//               <p>{review.reviewText}</p>

//               {/* Comments Section for Each Review */}
//               <div>
//                 {review.comments?.length > 0 ? (
//                   review.comments.map((comment) => (
//                     <div
//                       key={comment.commentId}
//                       style={{ marginBottom: "10px" }}
//                     >
//                       <p>
//                         <strong>{comment.author}</strong>: {comment.text}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p>No comments yet.</p>
//                 )}

//                 {/* Add Comment */}
//                 <div>
//                   <input
//                     type="text"
//                     value={commentText}
//                     onChange={(e) => setCommentText(e.target.value)}
//                     placeholder="Add a comment..."
//                   />
//                   <button onClick={() => handleAddComment(review.id)}>
//                     Add Comment
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}

//         {/* Review Submission Form */}
//         <h3>Leave a Review</h3>
//         {error && <p className="error">{error}</p>}
//         <form onSubmit={handleReviewSubmit}>
//           <textarea
//             value={reviewText}
//             onChange={(e) => setReviewText(e.target.value)}
//             placeholder="Write your review here..."
//             required
//           />
//           <div>
//             <label>
//               Rating:
//               <select value={score} onChange={(e) => setScore(e.target.value)}>
//                 {[1, 2, 3, 4, 5].map((rating) => (
//                   <option key={rating} value={rating}>
//                     {rating}
//                   </option>
//                 ))}
//               </select>
//             </label>
//           </div>
//           <button type="submit">Submit Review</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SingleWatch;
// 3-19 starting version
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Button, Card, Form, ListGroup } from "react-bootstrap";
// import axios from "axios";
// import { useSelector } from "react-redux"; // Assuming you use Redux for auth

// const SingleWatch = () => {
//   const { watchId } = useParams(); // Get watchId from URL params
//   const [watch, setWatch] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [averageRating, setAverageRating] = useState(null);
//   const [newReview, setNewReview] = useState("");
//   const [newRating, setNewRating] = useState(1);
//   const [commentText, setCommentText] = useState("");
//   const user = useSelector((state) => state.auth.user); // Assuming you store user in Redux

//   useEffect(() => {
//     // Fetch watch details
//     const fetchWatchDetails = async () => {
//       try {
//         const watchResponse = await axios.get(`/api/watches/${watchId}`);
//         setWatch(watchResponse.data);

//         // Fetch reviews
//         const reviewsResponse = await axios.get(
//           `/api/watches/${watchId}/reviews`
//         );
//         setReviews(reviewsResponse.data);

//         // Fetch average rating
//         const avgResponse = await axios.get(`/api/watches/${watchId}/average`);
//         setAverageRating(avgResponse.data.average_score);
//       } catch (error) {
//         console.error("Error fetching watch details or reviews", error);
//       }
//     };

//     fetchWatchDetails();
//   }, [watchId]);

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!newReview.trim()) {
//       return alert("Please enter a review.");
//     }
//     try {
//       await axios.post(
//         `/api/watches/${watchId}/reviews`,
//         { reviewText: newReview, score: newRating },
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );
//       setNewReview("");
//       setNewRating(1);
//       // Re-fetch reviews
//       const reviewsResponse = await axios.get(
//         `/api/watches/${watchId}/reviews`
//       );
//       setReviews(reviewsResponse.data);
//     } catch (error) {
//       console.error("Error submitting review:", error);
//     }
//   };

//   const handleCommentSubmit = async (reviewId) => {
//     if (!commentText.trim()) {
//       return alert("Please enter a comment.");
//     }
//     try {
//       await axios.post(
//         `/api/watches/${watchId}/reviews/${reviewId}/comments`,
//         { commentText },
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );
//       setCommentText("");
//       // Re-fetch reviews
//       const reviewsResponse = await axios.get(
//         `/api/watches/${watchId}/reviews`
//       );
//       setReviews(reviewsResponse.data);
//     } catch (error) {
//       console.error("Error submitting comment:", error);
//     }
//   };

//   if (!watch) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="container">
//       <Card>
//         <Card.Img
//           variant="top"
//           src="https://via.placeholder.com/500"
//           alt="Watch Image"
//         />
//         <Card.Body>
//           <Card.Title>{watch.name}</Card.Title>
//           <Card.Text>{watch.description}</Card.Text>
//           <Card.Text>Brand: {watch.brand}</Card.Text>
//           <Card.Text>Model: {watch.model}</Card.Text>
//           <Card.Text>
//             Average Rating: {averageRating ? averageRating.toFixed(1) : "N/A"}
//           </Card.Text>
//         </Card.Body>
//       </Card>

//       <div>
//         <h3>Reviews</h3>
//         {reviews.length === 0 ? (
//           <p>No reviews yet.</p>
//         ) : (
//           <ListGroup>
//             {reviews.map((review) => (
//               <ListGroup.Item key={review.id}>
//                 <div>
//                   <strong>{review.user.username}</strong> rated it{" "}
//                   {review.score} stars
//                 </div>
//                 <p>{review.reviewText}</p>
//                 <div>
//                   {review.comments && review.comments.length > 0 ? (
//                     <ul>
//                       {review.comments.map((comment) => (
//                         <li key={comment.id}>
//                           <strong>{comment.user.username}</strong>:{" "}
//                           {comment.commentText}
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p>No comments yet.</p>
//                   )}
//                   {user && (
//                     <Form>
//                       <Form.Control
//                         type="text"
//                         value={commentText}
//                         onChange={(e) => setCommentText(e.target.value)}
//                         placeholder="Add a comment"
//                       />
//                       <Button
//                         variant="primary"
//                         onClick={() => handleCommentSubmit(review.id)}
//                       >
//                         Add Comment
//                       </Button>
//                     </Form>
//                   )}
//                 </div>
//               </ListGroup.Item>
//             ))}
//           </ListGroup>
//         )}

//         {user && (
//           <div>
//             <h4>Write a Review</h4>
//             <Form onSubmit={handleReviewSubmit}>
//               <Form.Group>
//                 <Form.Label>Rating</Form.Label>
//                 <Form.Control
//                   as="select"
//                   value={newRating}
//                   onChange={(e) => setNewRating(Number(e.target.value))}
//                 >
//                   {[1, 2, 3, 4, 5].map((rating) => (
//                     <option key={rating} value={rating}>
//                       {rating} Star{rating > 1 ? "s" : ""}
//                     </option>
//                   ))}
//                 </Form.Control>
//               </Form.Group>
//               <Form.Group>
//                 <Form.Label>Review</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   value={newReview}
//                   onChange={(e) => setNewReview(e.target.value)}
//                   placeholder="Write your review"
//                 />
//               </Form.Group>
//               <Button type="submit">Submit Review</Button>
//             </Form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SingleWatch;
