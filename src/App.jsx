import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import LoginForm from "./components/LoginForm";
import Register from "./components/Register";
import Navigation from "./components/Navigation";
import WatchList from "./components/WatchList";
import SingleWatch from "./components/SingleWatch"; // Import the new SingleWatch component
import AccountPage from "./components/AccountPage"; // Create this component
import MyReviews from "./components/MyReviews"; // Create this component
import MyComments from "./components/MyComments"; // Create this component
import { Container } from "react-bootstrap";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => (
  <Router>
    <Navigation /> {/* Navigation is always rendered at the top */}
    <Container className="mt-5">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WatchList />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        {/* Watch details route */}
        <Route path="/watches/:watchId" element={<SingleWatch />} />
        {/* New route for Single Watch details */}
        {/* Protected routes */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews/me"
          element={
            <ProtectedRoute>
              <MyReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/comments/me"
          element={
            <ProtectedRoute>
              <MyComments />
            </ProtectedRoute>
          }
        />
        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  </Router>
);

export default App;
// // const App = () => {
// //   return (
// //     <Router>
// //       <Container className="mt-5">
// //         <Routes>
// //           {/* Public routes */}
// //           <Route path="/" element={<WatchList />} />
// //           <Route path="/login" element={<LoginForm />} />

// //           {/* Protected routes - Only accessible by authenticated users */}
// //           <Route
// //             path="/account"
// //             element={
// //               <ProtectedRoute>
// //                 <AccountPage />
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/reviews/me"
// //             element={
// //               <ProtectedRoute>
// //                 <MyReviews />
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/comments/me"
// //             element={
// //               <ProtectedRoute>
// //                 <MyComments />
// //               </ProtectedRoute>
// //             }
// //           />

// //           {/* Optionally add 404 route */}
// //           <Route path="*" element={<Navigate to="/" />} />
// //         </Routes>
// //       </Container>
// //     </Router>
// //   );
// // };

// // export default App;

// // working version 3-12
// // import React from "react";
// // import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// // import LoginForm from "./components/LoginForm";
// // import WatchList from "./components/WatchList";
// // import { Container } from "react-bootstrap";

// // const App = () => {
// //   return (
// //     <Router>
// //       <Container className="mt-5">
// //         <Routes>
// //           {/* Ensure each route has an element prop with JSX */}
// //           <Route path="/" element={<WatchList />} />
// //           <Route path="/login" element={<LoginForm />} />
// //         </Routes>
// //       </Container>
// //     </Router>
// //   );
// // };

// // export default App;
