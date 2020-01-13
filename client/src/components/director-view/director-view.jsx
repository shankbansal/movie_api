import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export class DirectorView extends React.Component {
  render() {
    const { director } = this.props;
    return (
      <div>
        <div>{director.Name}</div>
        <p>{director.Bio}</p>
        <p>{director.Birth}</p>
        <Link to="/">
          <Button variant="dark">Back</Button>
        </Link>
      </div>
    );
  }
}
