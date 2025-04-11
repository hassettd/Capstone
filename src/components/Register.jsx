import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 
import { useRegisterMutation } from "../app/watchApi"; 
import { registerSuccess } from "../app/authSlice"; 

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // New username state
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use the useRegisterMutation hook for the register API
  const [register] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Basic validation for form fields
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/[a-zA-Z]/.test(password)) {
      setError("Password must contain at least one letter.");
      return;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Log data for debugging
      console.log("Registering with", { username, email, password });

      // Register the user with the mutation
      const response = await register({ username, email, password }).unwrap();

      console.log("API response:", response); // Log the response for debugging

      if (response?.user) {
        // Dispatch the registerSuccess action to store user data and token
        dispatch(
          registerSuccess({ user: response.user, token: response.token })
        );
        navigate("/login"); // Redirect to login after successful registration
      } else {
        setError(response?.message || "Failed to register. Please try again.");
      }
    } catch (err) {
      console.error("Error during registration:", err); // Log any errors
      setError("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form">
      <h2>Create an Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </Form>
    </div>
  );
};

export default Register;

