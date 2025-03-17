import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Form, ListGroup } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux"; // Assuming you use Redux for auth

const SingleWatch = () => {
  const { watchId } = useParams(); // Get watchId from URL params
  const [watch, setWatch] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(1);
  const [commentText, setCommentText] = useState("");
  const user = useSelector((state) => state.auth.user); // Assuming you store user in Redux

  useEffect(() => {
    // Fetch watch details
    const fetchWatchDetails = async () => {
      try {
        const watchResponse = await axios.get(`/api/watches/${watchId}`);
        setWatch(watchResponse.data);

        // Fetch reviews
        const reviewsResponse = await axios.get(
          `/api/watches/${watchId}/reviews`
        );
        setReviews(reviewsResponse.data);

        // Fetch average rating
        const avgResponse = await axios.get(`/api/watches/${watchId}/average`);
        setAverageRating(avgResponse.data.average_score);
      } catch (error) {
        console.error("Error fetching watch details or reviews", error);
      }
    };

    fetchWatchDetails();
  }, [watchId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) {
      return alert("Please enter a review.");
    }
    try {
      await axios.post(
        `/api/watches/${watchId}/reviews`,
        { reviewText: newReview, score: newRating },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setNewReview("");
      setNewRating(1);
      // Re-fetch reviews
      const reviewsResponse = await axios.get(
        `/api/watches/${watchId}/reviews`
      );
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleCommentSubmit = async (reviewId) => {
    if (!commentText.trim()) {
      return alert("Please enter a comment.");
    }
    try {
      await axios.post(
        `/api/watches/${watchId}/reviews/${reviewId}/comments`,
        { commentText },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setCommentText("");
      // Re-fetch reviews
      const reviewsResponse = await axios.get(
        `/api/watches/${watchId}/reviews`
      );
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (!watch) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Card>
        <Card.Img
          variant="top"
          src="https://via.placeholder.com/500"
          alt="Watch Image"
        />
        <Card.Body>
          <Card.Title>{watch.name}</Card.Title>
          <Card.Text>{watch.description}</Card.Text>
          <Card.Text>Brand: {watch.brand}</Card.Text>
          <Card.Text>Model: {watch.model}</Card.Text>
          <Card.Text>
            Average Rating: {averageRating ? averageRating.toFixed(1) : "N/A"}
          </Card.Text>
        </Card.Body>
      </Card>

      <div>
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ListGroup>
            {reviews.map((review) => (
              <ListGroup.Item key={review.id}>
                <div>
                  <strong>{review.user.username}</strong> rated it{" "}
                  {review.score} stars
                </div>
                <p>{review.reviewText}</p>
                <div>
                  {review.comments && review.comments.length > 0 ? (
                    <ul>
                      {review.comments.map((comment) => (
                        <li key={comment.id}>
                          <strong>{comment.user.username}</strong>:{" "}
                          {comment.commentText}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No comments yet.</p>
                  )}
                  {user && (
                    <Form>
                      <Form.Control
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment"
                      />
                      <Button
                        variant="primary"
                        onClick={() => handleCommentSubmit(review.id)}
                      >
                        Add Comment
                      </Button>
                    </Form>
                  )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        {user && (
          <div>
            <h4>Write a Review</h4>
            <Form onSubmit={handleReviewSubmit}>
              <Form.Group>
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  as="select"
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating > 1 ? "s" : ""}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Write your review"
                />
              </Form.Group>
              <Button type="submit">Submit Review</Button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleWatch;
