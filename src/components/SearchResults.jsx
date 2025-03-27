// 3-26 Working version
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; // To read query from URL and navigate
import { useGetSearchWatchesQuery } from "../app/watchApi"; // Import the search hook
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
                  <Button variant="primary">View Details</Button>
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
