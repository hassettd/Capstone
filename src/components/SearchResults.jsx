import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; // To read query from URL and navigate
import { useGetSearchWatchesQuery } from "../app/watchApi"; // Import the search hook
import { Card, Button, Pagination, Spinner } from "react-bootstrap";

const SearchResults = () => {
  const location = useLocation(); // To get the current URL
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10); // Default limit of 10 watches per page
  const [page, setPage] = useState(1); // Default to page 1
  const [sortOrder, setSortOrder] = useState("name_asc"); // Default sort order

  // Parse query parameters from the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    console.log("Query Params: ", queryParams.toString()); // Debug log for query params
    setSearchQuery(queryParams.get("query") || ""); // Set the search query from the URL or default to an empty string
    setPage(parseInt(queryParams.get("page")) || 1); // Set the page from the URL or default to 1
    setSortOrder(queryParams.get("sort") || "name_asc"); // Set the sort order from the URL or default to name_asc
  }, [location]);

  console.log("Search Query: ", searchQuery); // Debug: Check if searchQuery is correct

  // Fetch search results based on the query, page, and sort order
  const {
    data: { watches, totalCount } = { watches: [], totalCount: 0 },
    error,
    isLoading,
  } = useGetSearchWatchesQuery({
    searchQuery,
    limit,
    page,
    sort: sortOrder,
  });

  console.log("Watches from API: ", watches); // Debug log for API response
  console.log("Is Loading: ", isLoading); // Check if loading state is triggered
  console.log("Error: ", error); // Check for any error

  // Handle loading and error states
  if (isLoading) return <Spinner animation="border" variant="primary" />;
  if (error) return <p>Error loading watches!</p>;

  // If no watches are found, display a message
  if (watches.length === 0) {
    console.log("No watches found for the query:", searchQuery); // Debug log
    return <p>No watches found matching your search.</p>;
  }

  // Pagination logic
  const totalPages = Math.ceil(totalCount / limit);

  const nextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

  // Disable next button if we're on the last page
  const disableNext = page === totalPages;

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
                  <Button variant="primary">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev onClick={prevPage} disabled={page === 1} />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === page}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={nextPage} disabled={disableNext} />
        </Pagination>
      </div>
    </div>
  );
};

export default SearchResults;
// 3-26 Working version
// import React, { useState, useEffect } from "react";
// import { useLocation, Link } from "react-router-dom"; // To read query from URL and navigate
// import { useGetSearchWatchesQuery } from "../app/watchApi"; // Import the search hook
// import { Card, Button } from "react-bootstrap";

// const SearchResults = () => {
//   const location = useLocation(); // To get the current URL
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     // Parse query parameters from the URL
//     const queryParams = new URLSearchParams(location.search);
//     setSearchQuery(queryParams.get("query") || ""); // Set the search query from the URL or default to an empty string
//   }, [location]);

//   // Fetch search results based on the query
//   const {
//     data: watches,
//     error,
//     isLoading,
//   } = useGetSearchWatchesQuery(searchQuery);

//   // Handle loading and error states
//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error loading watches!</p>;

//   // If no watches are found, display a message
//   if (watches && watches.length === 0) {
//     return <p>No watches found matching your search.</p>;
//   }

//   return (
//     <div>
//       <h2>Search Results</h2>
//       <div className="row">
//         {watches.map((watch) => (
//           <div key={watch.id} className="col-12 col-md-4 mb-4">
//             <Card>
//               <Card.Body>
//                 <Card.Title>{watch.name}</Card.Title>
//                 <Link to={`/watches/${watch.id}`}>
//                   <Button variant="primary">View Details</Button>
//                 </Link>
//               </Card.Body>
//             </Card>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SearchResults;
// 3-25 start point
// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom"; // To read query from URL
// import { useGetSearchWatchesQuery } from "../app/watchApi"; // Import the search hook
// import { Card, Button } from "react-bootstrap";

// const SearchResults = () => {
//   const location = useLocation();
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     setSearchQuery(queryParams.get("query") || ""); // Set search query from URL
//   }, [location]);

//   // Fetch search results using the search query
//   const {
//     data: watches,
//     error,
//     isLoading,
//   } = useGetSearchWatchesQuery(searchQuery);

//   // Handle loading and error states
//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error loading watches!</p>;

//   // If no watches are found, show a message
//   if (watches && watches.length === 0) {
//     return <p>No watches found matching your search.</p>;
//   }

//   return (
//     <div>
//       <div className="row">
//         {watches.map((watch) => (
//           <div key={watch.id} className="col-12 col-md-4 mb-4">
//             <Card>
//               <Card.Body>
//                 <Card.Title>{watch.name}</Card.Title>
//                 <Link to={`/watches/${watch.id}`}>
//                   <Button variant="primary">View Details</Button>
//                 </Link>
//               </Card.Body>
//             </Card>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SearchResults;
