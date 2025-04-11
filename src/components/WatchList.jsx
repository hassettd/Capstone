import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import { Link } from "react-router-dom";
import { Card, Button, Spinner, Pagination } from "react-bootstrap";
import { useGetSearchWatchesQuery } from "../app/watchApi"; 

const WatchList = () => {
  const location = useLocation(); // Use location to read the search query from the URL
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10); // Default limit of 10 watches per page
  const [page, setPage] = useState(1); // Default to page 1

  // Parse the query parameter from the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setSearchQuery(queryParams.get("query") || ""); // Set the search query from the URL
  }, [location]);

  // Fetch watches using the search query from the URL
  const {
    data: watches,
    error,
    isLoading,
  } = useGetSearchWatchesQuery(searchQuery); // Use the search query

  // Handle loading and error states
  if (isLoading) return <Spinner animation="border" variant="primary" />;
  if (error) return <p>Error loading watches!</p>;

  // If no watches are found, show a message
  if (watches && watches.length === 0) {
    return <p>No watches found matching your search.</p>;
  }

  // Pagination logic
  const totalCount = watches ? watches.length : 0; // Total count of the search results
  const totalPages = Math.ceil(totalCount / limit);

  const nextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

  const handlePageChange = (newPage) => setPage(newPage); // Set the new page when clicking on a number

  return (
    <div>
      <div className="row">
        {watches &&
          watches.slice((page - 1) * limit, page * limit).map((watch) => (
            <div
              key={watch.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
            >
              <Card>
                <Card.Body>
                  <Card.Title>{watch.name}</Card.Title>
                  <Link to={`/watches/${watch.id}`}>
                    <Button
                      className="btn"
                      style={{
                        backgroundColor: "#800020",
                        color: "white", // text color
                        border: "none", // Remove the default border if you like
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

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev
            onClick={prevPage}
            disabled={page === 1}
            style={{
              backgroundColor: "#800020", // Burgundy background for prev
              color: "white", // White text
              border: "none", // Remove default border
            }}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === page}
              onClick={() => handlePageChange(index + 1)} // Page change on number click
              style={{
                backgroundColor: index + 1 === page ? "#800020" : "", // Active page burgundy color
                color: index + 1 === page ? "white" : "", // Active page text color
                border: "none", // Remove default border
              }}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={nextPage}
            disabled={page === totalPages}
            style={{
              backgroundColor: "#800020", // Burgundy background for next
              color: "white", // White text
              border: "none", // Remove default border
            }}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default WatchList;
