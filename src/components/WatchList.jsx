import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; // Import for accessing the URL and link navigation
import { Card, Button, Dropdown, Spinner, Pagination } from "react-bootstrap";
import { useGetSearchWatchesQuery } from "../app/watchApi"; // Import the API query hook

const WatchList = () => {
  const location = useLocation(); // Access the current location (URL) to parse the query parameters
  const [searchQuery, setSearchQuery] = useState(""); // Store the search query
  const [limit, setLimit] = useState(10); // Default number of watches per page
  const [page, setPage] = useState(1); // Default to page 1
  const [sortOrder, setSortOrder] = useState("name_asc"); // Default sort order

  // Parse query parameters from the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setSearchQuery(queryParams.get("query") || ""); // Set search query from URL, default to empty string
  }, [location]); // Re-run effect when URL changes

  // Fetch watches based on the query, limit, page, and sort order
  const {
    data: watches,
    error,
    isLoading,
  } = useGetSearchWatchesQuery({ searchQuery, limit, page, sort: sortOrder });

  // Handle loading and error states
  if (isLoading) return <Spinner animation="border" variant="primary" />;
  if (error) return <p>Error loading watches!</p>;

  // If no watches are found, display a message
  if (watches && watches.length === 0) {
    return <p>No watches found matching your search.</p>;
  }

  // Handle sorting option change
  const handleSortChange = (sortOption) => {
    setSortOrder(sortOption); // Update the sort order based on the user's selection
    setPage(1); // Reset to the first page whenever the sort option changes
  };

  // Pagination logic
  const totalCount = watches ? watches.length : 0; // Total count of watches
  const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

  const nextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1); // Go to the next page
    }
  };

  const prevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : 1)); // Go to the previous page
  };

  // Disable next button if on the last page
  const disableNext = page === totalPages;

  return (
    <div>
      {/* Sort Dropdown */}
      <Dropdown className="mb-4">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Sort By
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleSortChange("name_asc")}>
            Name A-Z
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange("name_desc")}>
            Name Z-A
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange("case_size_asc")}>
            Case Size Small to Large
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange("case_size_desc")}>
            Case Size Large to Small
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Watch List */}
      <div className="row">
        {watches &&
          watches
            .slice((page - 1) * limit, page * limit) // Slice the data based on the current page and limit
            .map((watch) => (
              <div
                key={watch.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
              >
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

export default WatchList;
// 3-26 starting
// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom"; // For accessing the search query in URL
// import { Link } from "react-router-dom";
// import { Card, Button, Spinner, Pagination } from "react-bootstrap";
// import { useGetSearchWatchesQuery } from "../app/watchApi"; // Import the new search hook

// const WatchList = () => {
//   const location = useLocation(); // Use location to read the search query from the URL
//   const [searchQuery, setSearchQuery] = useState("");
//   const [limit, setLimit] = useState(10); // Default limit of 10 watches per page
//   const [page, setPage] = useState(1); // Default to page 1

//   // Parse the query parameter from the URL
//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     setSearchQuery(queryParams.get("query") || ""); // Set the search query from the URL
//   }, [location]);

//   // Fetch watches using the search query from the URL
//   const {
//     data: watches,
//     error,
//     isLoading,
//   } = useGetSearchWatchesQuery(searchQuery); // Use the search query

//   // Handle loading and error states
//   if (isLoading) return <Spinner animation="border" variant="primary" />;
//   if (error) return <p>Error loading watches!</p>;

//   // If no watches are found, show a message
//   if (watches && watches.length === 0) {
//     return <p>No watches found matching your search.</p>;
//   }

//   // Pagination logic
//   const totalCount = watches ? watches.length : 0; // Total count of the search results
//   const totalPages = Math.ceil(totalCount / limit);

//   const nextPage = () => {
//     if (page < totalPages) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   const prevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

//   const handlePageChange = (newPage) => setPage(newPage); // Set the new page when clicking on a number

//   return (
//     <div>
//       <div className="row">
//         {watches &&
//           watches.slice((page - 1) * limit, page * limit).map((watch) => (
//             <div
//               key={watch.id}
//               className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
//             >
//               <Card>
//                 <Card.Body>
//                   <Card.Title>{watch.name}</Card.Title>
//                   <Link to={`/watches/${watch.id}`}>
//                     <Button variant="primary">View Details</Button>
//                   </Link>
//                 </Card.Body>
//               </Card>
//             </div>
//           ))}
//       </div>

//       {/* Pagination Controls */}
//       <div className="d-flex justify-content-center mt-4">
//         <Pagination>
//           <Pagination.Prev onClick={prevPage} disabled={page === 1} />
//           {[...Array(totalPages)].map((_, index) => (
//             <Pagination.Item
//               key={index + 1}
//               active={index + 1 === page}
//               onClick={() => handlePageChange(index + 1)} // Page change on number click
//             >
//               {index + 1}
//             </Pagination.Item>
//           ))}
//           <Pagination.Next onClick={nextPage} disabled={page === totalPages} />
//         </Pagination>
//       </div>
//     </div>
//   );
// };

// export default WatchList;
// 3-25 working version
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useGetWatchesQuery } from "../app/watchApi";
// import { Card, Button } from "react-bootstrap";

// const WatchList = () => {
//   const [limit, setLimit] = useState(10); // Default limit of 10 watches per page
//   const [page, setPage] = useState(1); // Default to page 1

//   // Fetch watches with dynamic limit and page
//   const {
//     data: watches,
//     error,
//     isLoading,
//   } = useGetWatchesQuery({ limit, page });

//   // Assuming you get total count from your API response
//   const totalCount = 20; // Adjust this as needed based on your API response

//   // Handle loading and error states
//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error loading watches!</p>;

//   // Calculate total pages based on totalCount and limit
//   const totalPages = Math.ceil(totalCount / limit);

//   // Handle pagination logic
//   const nextPage = () => {
//     if (page < totalPages) {
//       setPage((prev) => prev + 1); // Only move to next page if it's not the last page
//     }
//   };

//   const prevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

//   // Disable next button if we're on the last page
//   const disableNext = page === totalPages;

//   return (
//     <div>
//       <div className="row">
//         {watches.map((watch) => (
//           <div key={watch.id} className="col-12 col-md-4 mb-4">
//             <Card>
//               <Card.Body>
//                 <Card.Title>{watch.name}</Card.Title>
//                 <Link to={`/watches/${watch.id}`}>
//                   {/* Correct link for details */}
//                   <Button variant="primary">View Details</Button>
//                 </Link>
//               </Card.Body>
//             </Card>
//           </div>
//         ))}
//       </div>

//       {/* Pagination Controls */}
//       <div className="pagination">
//         <Button onClick={prevPage} disabled={page === 1}>
//           Previous
//         </Button>
//         <Button onClick={nextPage} disabled={disableNext}>
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default WatchList;
// 3-17 working
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useGetWatchesQuery } from "../app/watchApi";
// import { Card, Button } from "react-bootstrap";

// const WatchList = () => {
//   const [limit, setLimit] = useState(10); // Default limit of 10 watches per page
//   const [page, setPage] = useState(1); // Default to page 1

//   // Fetch watches with dynamic limit and page
//   const {
//     data: watches,
//     error,
//     isLoading,
//   } = useGetWatchesQuery({ limit, page });

//   // Assuming you get total count from your API response
//   const totalCount = 20; // Adjust this as needed based on your API response

//   // Handle loading and error states
//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error loading watches!</p>;

//   // Calculate total pages based on totalCount and limit
//   const totalPages = Math.ceil(totalCount / limit);

//   // Handle pagination logic
//   const nextPage = () => {
//     if (page < totalPages) {
//       setPage((prev) => prev + 1); // Only move to next page if it's not the last page
//     }
//   };

//   const prevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

//   // Disable next button if we're on the last page
//   const disableNext = page === totalPages;

//   return (
//     <div>
//       <div className="row">
//         {watches.map((watch) => (
//           <div key={watch.id} className="col-12 col-md-4 mb-4">
//             <Card>
//               <Card.Body>
//                 <Card.Title>{watch.name}</Card.Title>
//                 <Link to={`/watches/${watch.id}`}>
//                   {" "}
//                   {/* Correct link for details */}
//                   <Button variant="primary">View Details</Button>
//                 </Link>
//               </Card.Body>
//             </Card>
//           </div>
//         ))}
//       </div>

//       {/* Pagination Controls */}
//       <div className="pagination">
//         <Button onClick={prevPage} disabled={page === 1}>
//           Previous
//         </Button>
//         <Button onClick={nextPage} disabled={disableNext}>
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default WatchList;
// 3-17
// import React from "react";
// import { useGetWatchesQuery } from "../app/watchApi";
// import { Card, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";

// const WatchList = () => {
//   const { data: watches, error, isLoading } = useGetWatchesQuery();

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error loading watches!</p>;

//   return (
//     <div className="row">
//       {watches.map((watch) => (
//         <div key={watch.id} className="col-12 col-md-4 mb-4">
//           <Card>
//             <Card.Body>
//               <Card.Title>{watch.name}</Card.Title>
//               <Link to={`/watches/${watch.id}`}>
//                 <Button>View Details</Button>
//               </Link>
//             </Card.Body>
//           </Card>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default WatchList;
