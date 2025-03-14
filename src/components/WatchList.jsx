import React from "react";
import { useGetWatchesQuery } from "../app/watchApi";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const WatchList = () => {
  const { data: watches, error, isLoading } = useGetWatchesQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading watches!</p>;

  return (
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
  );
};

export default WatchList;
