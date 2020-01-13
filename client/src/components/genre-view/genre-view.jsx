import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export function GenreView(props) {
  const { genre } = props;
  return (
    <div>
      <p>{genre.Name}</p>
      <p>{genre.Description}</p>
      <Link to="/">
        <Button variant="dark">Back</Button>
      </Link>
    </div>
  );
}
