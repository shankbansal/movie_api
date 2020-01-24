import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
export class MovieView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movie } = this.props;

    if (!movie) return null;

    return (
      <div className="col-lg-6 offset-lg-3">
        <Card className="movie-card">
          <Card.Img variant="top" src={movie.ImagePath} />
          <Card.Body>
            <Card.Title>{movie.Title}</Card.Title>
            <Card.Text>{movie.Description}</Card.Text>
            <Card.Text>
              <Link to={`/genres/${movie.Genre.Name}`}>
                {movie.Genre.Name}
              </Link>
            </Card.Text>

            <Card.Text>
              <Link to={`/directors/${movie.Director.Name}`}>
                {movie.Director.Name}
              </Link>
            </Card.Text>

            
              <Button href="/" variant="dark">Back</Button>
            
          </Card.Body>
        </Card>
      </div>
    );

   
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string,
    Description: PropTypes.string,
    Genre: PropTypes.shape({
      Name: PropTypes.string
    }).isRequired,
    Director: PropTypes.shape({
      Name: PropTypes.string
    }).isRequired
  }).isRequired
};
