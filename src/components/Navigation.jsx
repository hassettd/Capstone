import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../app/authSlice";
import { useMeQuery } from "../app/watchApi"; // Import the hooks

function Navigation() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  // Use the hook to fetch the logged-in user's data
  const { data: user } = useMeQuery();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle search form submission (you can modify this based on how you want to implement the search functionality)
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      // Implement the search functionality, for example, redirect to a search page or filter watches in the WatchList
      console.log("Searching for:", searchQuery);
      // Example: Navigate to search results page (if implemented)
      // window.location.href = `/search?query=${searchQuery}`;
    }
  };

  return (
    <>
      {/* Navbar Section */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Watch Store
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/watches">
                  Watches
                </Link>
              </li>
              {token ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/account">
                      {user ? `${user.username}'s Account` : "Account"}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-link nav-link"
                      onClick={() => dispatch(logout())}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Search Form */}
            <form className="d-flex" onSubmit={handleSearchSubmit}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search for watches"
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
// // 3-17 starting point
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../app/authSlice";
// import { useMeQuery, useGetWatchesQuery } from "../app/watchApi"; // Import the hooks

// function Navigation() {
//   const token = useSelector((state) => state.auth.token);
//   const dispatch = useDispatch();

//   // Use the hook to fetch the logged-in user's data
//   const { data: user, error: userError } = useMeQuery();

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageLimit, setPageLimit] = useState(10); // Define how many items per page

//   // Fetch watches data based on pagination
//   const { data: watches, error: watchesError } = useGetWatchesQuery({
//     page: currentPage,
//     limit: pageLimit,
//   });

//   // Handle page change when a pagination button is clicked
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <nav className="navbar navbar-dark bg-primary">
//       <button
//         className="navbar-toggler"
//         type="button"
//         data-bs-toggle="collapse"
//         data-bs-target="#navbarTogglerDemo01"
//         aria-controls="navbarTogglerDemo01"
//         aria-expanded="false"
//         aria-label="Toggle navigation"
//       >
//         <span className="navbar-toggler-icon"></span>
//       </button>
//       <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
//         <a className="navbar-brand" href="#">
//           Watch Store
//         </a>
//         <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
//           <li className="nav-item active">
//             <Link className="nav-link" to="/">
//               Home <span className="sr-only">(current)</span>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/watches">
//               Watches
//             </Link>
//           </li>
//           {token ? (
//             <>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/account">
//                   {user ? `${user.username}'s Account` : "Account"}
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <button
//                   className="btn btn-link nav-link"
//                   onClick={() => dispatch(logout())}
//                 >
//                   Logout
//                 </button>
//               </li>
//             </>
//           ) : (
//             <>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/login">
//                   Login
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/register">
//                   Register
//                 </Link>
//               </li>
//             </>
//           )}
//         </ul>
//         <form className="form-inline my-2 my-lg-0">
//           <input
//             className="form-control mr-sm-2"
//             type="search"
//             placeholder="Search"
//             aria-label="Search"
//           />
//           <button
//             className="btn btn-outline-success my-2 my-sm-0"
//             type="submit"
//           >
//             Search
//           </button>
//         </form>
//       </div>

//       {/* Pagination Section */}
//       <nav aria-label="Page navigation example" className="mt-3">
//         <ul className="pagination justify-content-center">
//           <li className="page-item">
//             <a
//               className="page-link"
//               href="#"
//               aria-label="Previous"
//               onClick={() => handlePageChange(currentPage - 1)}
//             >
//               <span aria-hidden="true">&laquo;</span>
//             </a>
//           </li>
//           {Array.from({ length: Math.ceil(watches?.length / pageLimit) }).map(
//             (_, index) => (
//               <li
//                 key={index}
//                 className={`page-item ${
//                   currentPage === index + 1 ? "active" : ""
//                 }`}
//               >
//                 <a
//                   className="page-link"
//                   href="#"
//                   onClick={() => handlePageChange(index + 1)}
//                 >
//                   {index + 1}
//                 </a>
//               </li>
//             )
//           )}
//           <li className="page-item">
//             <a
//               className="page-link"
//               href="#"
//               aria-label="Next"
//               onClick={() => handlePageChange(currentPage + 1)}
//             >
//               <span aria-hidden="true">&raquo;</span>
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </nav>
//   );
// }

// export default Navigation;
// working version before pagination
// import React from "react";
// import { Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../app/authSlice";
// import { useMeQuery } from "../app/watchApi"; // Import the useMeQuery hook

// function Navigation() {
//   const token = useSelector((state) => state.auth.token);
//   const dispatch = useDispatch();

//   // Use the hook to fetch the logged-in user's data
//   const { data: user, error } = useMeQuery();

//   return (
//     <nav className="navbar navbar-dark bg-primary">
//       <button
//         className="navbar-toggler"
//         type="button"
//         data-bs-toggle="collapse"
//         data-bs-target="#navbarTogglerDemo01"
//         aria-controls="navbarTogglerDemo01"
//         aria-expanded="false"
//         aria-label="Toggle navigation"
//       >
//         <span className="navbar-toggler-icon"></span>
//       </button>
//       <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
//         <a className="navbar-brand" href="#">
//           Watch Store
//         </a>
//         <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
//           <li className="nav-item active">
//             <Link className="nav-link" to="/">
//               Home <span className="sr-only">(current)</span>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/watches">
//               Watches
//             </Link>
//           </li>
//           {token ? (
//             <>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/account">
//                   {user ? `${user.username}'s Account` : "Account"}
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <button
//                   className="btn btn-link nav-link"
//                   onClick={() => dispatch(logout())}
//                 >
//                   Logout
//                 </button>
//               </li>
//             </>
//           ) : (
//             <>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/login">
//                   Login
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/register">
//                   Register
//                 </Link>
//               </li>
//             </>
//           )}
//         </ul>
//         <form className="form-inline my-2 my-lg-0">
//           <input
//             className="form-control mr-sm-2"
//             type="search"
//             placeholder="Search"
//             aria-label="Search"
//           />
//           <button
//             className="btn btn-outline-success my-2 my-sm-0"
//             type="submit"
//           >
//             Search
//           </button>
//         </form>
//       </div>
//     </nav>
//   );
// }

// export default Navigation;

// import React from "react";
// import { Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../app/authSlice";

// function Navigation() {
//   const token = useSelector((state) => state.auth.token);
//   const dispatch = useDispatch();

//   return (
//     <nav className="navbar navbar-dark bg-primary">
//       <button
//         className="navbar-toggler"
//         type="button"
//         data-bs-toggle="collapse"
//         data-bs-target="#navbarTogglerDemo01"
//         aria-controls="navbarTogglerDemo01"
//         aria-expanded="false"
//         aria-label="Toggle navigation"
//       >
//         <span className="navbar-toggler-icon"></span>
//       </button>
//       <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
//         <a className="navbar-brand" href="#">
//           Watch Store
//         </a>
//         <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
//           <li className="nav-item active">
//             <Link className="nav-link" to="/">
//               Home <span className="sr-only">(current)</span>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/watches">
//               Watches
//             </Link>
//           </li>
//           {token ? (
//             <>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/account">
//                   Account
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <button
//                   className="btn btn-link nav-link"
//                   onClick={() => dispatch(logout())}
//                 >
//                   Logout
//                 </button>
//               </li>
//             </>
//           ) : (
//             <>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/login">
//                   Login
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/register">
//                   Register
//                 </Link>
//               </li>
//             </>
//           )}
//         </ul>
//         <form className="form-inline my-2 my-lg-0">
//           <input
//             className="form-control mr-sm-2"
//             type="search"
//             placeholder="Search"
//             aria-label="Search"
//           />
//           <button
//             className="btn btn-outline-success my-2 my-sm-0"
//             type="submit"
//           >
//             Search
//           </button>
//         </form>
//       </div>
//     </nav>
//   );
// }

// export default Navigation;

// import React from "react";
// import { Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../features/authSlice";

// function Navigation() {
//   const token = useSelector((state) => state.auth.token); // Get the token from Redux store
//   const dispatch = useDispatch();

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/">
//           Watch Store
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav">
//             {/* Always visible */}
//             <li className="nav-item">
//               <Link className="nav-link" to="/watches">
//                 Watches
//               </Link>
//             </li>
//             {token ? (
//               <>
//                 {/* Account and Review-related Links for Authenticated Users */}
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/account">
//                     Account
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/reviews/me">
//                     My Reviews
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/comments/me">
//                     My Comments
//                   </Link>
//                 </li>
//                 {/* Logout */}
//                 <li className="nav-item">
//                   <button
//                     className="btn btn-link nav-link"
//                     onClick={() => dispatch(logout())}
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 {/* Login and Register Links for Unauthenticated Users */}
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/login">
//                     Login
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/register">
//                     Register
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navigation;
