import React, { useState } from "react";
import { useGetWatchesQuery } from "../app/watchApi";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const WatchList = () => {
  const [limit, setLimit] = useState(10); // Default limit of 10 watches per page
  const [page, setPage] = useState(1); // Default to page 1

  // Fetch watches with dynamic limit and page
  const {
    data: watches,
    error,
    isLoading,
  } = useGetWatchesQuery({ limit, page });

  // Handle loading and error states
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading watches!</p>;

  // Pagination navigation
  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div>
      <div className="row">
        {watches.map((watch) => (
          <div key={watch.id} className="col-12 col-md-4 mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{watch.name}</Card.Title>
                <Link to={`/watches/${watch.id}`}>
                  <Button>View Details</Button>
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
        <Button onClick={nextPage}>Next</Button>
      </div>
    </div>
  );
};

export default WatchList;
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
