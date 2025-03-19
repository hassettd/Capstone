import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetWatchesQuery } from "../app/watchApi"; // Make sure this is the correct hook to fetch search results
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const SearchResults = () => {
  // Get the query parameter from the URL using useLocation hook
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  const [searchQuery, setSearchQuery] = useState(query || "");

  // Use the query to get watches using the correct API query
  const {
    data: watches,
    error,
    isLoading,
  } = useGetWatchesQuery({
    query: searchQuery, // Pass the search query to the API hook
    limit: 20, // Example limit, adjust as needed
    page: 1, // Example page, adjust if you have pagination
  });

  // If the query is empty, show a message to prompt the user to search
  if (!searchQuery) {
    return (
      <div className="alert alert-info">
        Please enter a search query to see results.
      </div>
    );
  }

  // Handle loading, error, and rendering results
  if (isLoading) return <p>Loading search results...</p>;
  if (error) return <p>Error loading search results. Please try again.</p>;

  // If no watches are found
  if (watches && watches.length === 0) {
    return <p>No watches found for your search query: "{searchQuery}"</p>;
  }

  return (
    <div className="row">
      {watches.map((watch) => (
        <div key={watch.id} className="col-12 col-md-4 mb-4">
          <Card>
            <Card.Body>
              <Card.Title>{watch.name}</Card.Title>
              <Link to={`/watches/${watch.id}`}>
                <Button variant="primary">View Details</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
