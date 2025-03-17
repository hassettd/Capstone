import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // For navigation after registration
import { useRegisterMutation } from "../app/watchApi"; // Use register mutation from API
import { registerSuccess } from "../app/authSlice"; // Import the registerSuccess action

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

// 3-17 start point
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { Button, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom"; // For navigation after registration
// import { useRegisterMutation } from "../app/watchApi"; // Use register mutation from API

// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState(""); // New username state
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Use the useRegisterMutation hook for the register API
//   const [register] = useRegisterMutation();

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent page reload

//     // Debugging log to see if the submit handler is triggered
//     console.log("Submit button clicked");

//     // Basic validation for form fields
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     if (password.length < 8) {
//       setError("Password must be at least 8 characters long.");
//       return;
//     }

//     if (!/[a-zA-Z]/.test(password)) {
//       setError("Password must contain at least one letter.");
//       return;
//     }

//     if (!/\d/.test(password)) {
//       setError("Password must contain at least one number.");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       // Log data for debugging
//       console.log("Registering with", { username, email, password });

//       // Register the user with the mutation
//       const response = await register({ username, email, password }).unwrap();

//       console.log("API response:", response); // Log the response for debugging

//       if (response?.user) {
//         dispatch(registerUser({ user: response.user, token: response.token }));
//         navigate("/login"); // Redirect to login after successful registration
//       } else {
//         setError(response?.message || "Failed to register. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error during registration:", err); // Log any errors
//       setError("An error occurred during registration.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="register-form">
//       <h2>Create an Account</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="username">
//           <Form.Label>Username</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter your username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="email">
//           <Form.Label>Email</Form.Label>
//           <Form.Control
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="password">
//           <Form.Label>Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="confirmPassword">
//           <Form.Label>Confirm Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Confirm your password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? "Registering..." : "Register"}
//         </Button>
//       </Form>
//     </div>
//   );
// };

// export default Register;
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { Button, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom"; // For navigation after registration
// import { registerUser } from "../app/authSlice"; // Import the registerUser action from authSlice

// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
// //   const [firstName, setFirstName] = useState("");
// //   const [lastName, setLastName] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation for form fields
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       // API call for registration
//       const response = await fetch(
//         "https://capstone-backend2-ssa6.onrender.com/api/auth/register",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email,
//             password,
//             firstName,
//             lastName,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         // Log the response data to debug
//         console.log("Registration successful", data);

//         // Dispatch the action to update the Redux store with the user data and token
//         dispatch(
//           registerUser({
//             user: data.user,
//             token: data.token,
//           })
//         );

//         // Redirect to login page after successful registration
//         navigate("/login"); // Redirect to login after successful registration
//       } else {
//         // Handle errors returned from the server
//         setError(data.message || "Failed to register. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error during registration:", err);
//       setError("An error occurred during registration.");
//     } finally {
//       setIsLoading(false); // Set loading state to false
//     }
//   };

//   return (
//     <div className="register-form">
//       <h2>Create an Account</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="firstName">
//           <Form.Label>First Name</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter your first name"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="lastName">
//           <Form.Label>Last Name</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter your last name"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="email">
//           <Form.Label>Email</Form.Label>
//           <Form.Control
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="password">
//           <Form.Label>Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="confirmPassword">
//           <Form.Label>Confirm Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Confirm your password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? "Registering..." : "Register"}
//         </Button>
//       </Form>
//     </div>
//   );
// };

// export default Register;

// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { Button, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom"; // For navigation after registration
// import { registerUser } from "../app/authSlice"; // Import the registerUser action from authSlice

// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation for form fields
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       // Replace this with your actual API call
//       const response = await fetch(
//         "https://capstone-backend2-ssa6.onrender.com/api/auth/register",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email,
//             password,
//             firstName,
//             lastName,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         // Assuming the response contains user data and token
//         console.log(data); // Check the data structure
//         dispatch(
//           registerUser({
//             user: data.user,
//             token: data.token,
//           })
//         );

//         dispatch(
//           registerUser({
//             user: data.user, // Save user data in the Redux store
//             token: data.token, // Save token in the Redux store
//           })
//         );
//         navigate("/login"); // Redirect to login after successful registration
//       } else {
//         setError(data.message || "Failed to register. Please try again.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("An error occurred during registration.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="register-form">
//       <h2>Create an Account</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="firstName">
//           <Form.Label>First Name</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter your first name"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="lastName">
//           <Form.Label>Last Name</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter your last name"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="email">
//           <Form.Label>Email</Form.Label>
//           <Form.Control
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="password">
//           <Form.Label>Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="confirmPassword">
//           <Form.Label>Confirm Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Confirm your password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? "Registering..." : "Register"}
//         </Button>
//       </Form>
//     </div>
//   );
// };

// export default Register;

// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { Button, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom"; // For navigation after registration
// import { registerUser } from "../app/authSlice"; // Assuming you have a redux slice for auth

// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation for form fields
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       // Replace this with your actual API call
//       const response = await fetch("https://your-api.com/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//           firstName,
//           lastName,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Assuming the response contains a token or user info, and you're using Redux to store it
//         dispatch(registerUser(data)); // Assuming you have a registerUser action in your authSlice
//         navigate("/login"); // Redirect to login after successful registration
//       } else {
//         setError(data.message || "Failed to register. Please try again.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("An error occurred during registration.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="register-form">
//       <h2>Create an Account</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="firstName">
//           <Form.Label>First Name</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter your first name"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="lastName">
//           <Form.Label>Last Name</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter your last name"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="email">
//           <Form.Label>Email</Form.Label>
//           <Form.Control
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="password">
//           <Form.Label>Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="confirmPassword">
//           <Form.Label>Confirm Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Confirm your password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? "Registering..." : "Register"}
//         </Button>
//       </Form>
//     </div>
//   );
// };

// export default Register;
