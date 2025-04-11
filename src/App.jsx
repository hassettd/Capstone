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
import SingleWatch from "./components/SingleWatch"; 
import AccountPage from "./components/AccountPage"; 
import MyReviews from "./components/MyReviews"; 
import MyComments from "./components/MyComments"; 
import { Container } from "react-bootstrap";
import SearchResults from "./components/SearchResults"; 

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
    <Navigation /> 
    <Container className="mt-5">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WatchList />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        {/* Watch details route */}
        <Route path="/watches/:watchId" element={<SingleWatch />} />
        {/* Route for Search Results */}
        <Route path="/search" element={<SearchResults />} /> {/* Fix here */}
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
