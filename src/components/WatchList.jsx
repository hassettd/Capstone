import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetWatchesQuery } from "../app/watchApi";
import { Card, Button } from "react-bootstrap";

const WatchList = () => {
  const [limit, setLimit] = useState(10); // Default limit of 10 watches per page
  const [page, setPage] = useState(1); // Default to page 1

  // Fetch watches with dynamic limit and page
  const {
    data: watches,
    error,
    isLoading,
  } = useGetWatchesQuery({ limit, page });

  // Assuming you get total count from your API response
  const totalCount = 20; // Adjust this as needed based on your API response

  // Handle loading and error states
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading watches!</p>;

  // Calculate total pages based on totalCount and limit
  const totalPages = Math.ceil(totalCount / limit);

  // Handle pagination logic
  const nextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1); // Only move to next page if it's not the last page
    }
  };

  const prevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

  // Disable next button if we're on the last page
  const disableNext = page === totalPages;

  return (
    <div>
      <div className="row">
        {watches.map((watch) => (
          <div key={watch.id} className="col-12 col-md-4 mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{watch.name}</Card.Title>
                <Link to={`/watches/${watch.id}`}>
                  {/* Correct link for details */}
                  <Button variant="primary">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <Button onClick={prevPage} disabled={page === 1}>
          Previous
        </Button>
        <Button onClick={nextPage} disabled={disableNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default WatchList;
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
