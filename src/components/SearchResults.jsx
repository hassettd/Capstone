import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; 
import { useGetSearchWatchesQuery } from "../app/watchApi"; 
import { Card, Button } from "react-bootstrap";

const SearchResults = () => {
  const location = useLocation(); // To get the current URL
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Parse query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    setSearchQuery(queryParams.get("query") || ""); // Set the search query from the URL or default to an empty string
  }, [location]);

  // Fetch search results based on the query
  const {
    data: watches,
    error,
    isLoading,
  } = useGetSearchWatchesQuery(searchQuery);

  // Handle loading and error states
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading watches!</p>;

  // If no watches are found, display a message
  if (watches && watches.length === 0) {
    return <p>No watches found matching your search.</p>;
  }

  return (
    <div>
      <h2>Search Results</h2>
      <div className="row">
        {watches.map((watch) => (
          <div key={watch.id} className="col-12 col-md-4 mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{watch.name}</Card.Title>
                <Link to={`/watches/${watch.id}`}>
                  <Button
                    className="btn"
                    style={{
                      backgroundColor: "#800020",
                      color: "white", // text color
                      border: "none", // Remove the default border 
                    }}
                  >
                    View Details
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
