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

            <Link to="/">
              <Button variant="dark">Back</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    );

    /*return (
      
        <div className="container">
          <h1 className="value row col offset-2">{movie.Title}</h1>
          <div className="row offset-2">
            <div className="col-6">
            <br />
        <img className="fluid" src={movie.ImagePath} />
        <br />
        <div className="movie-title">
          <span className="label">Title: </span>
          <span className="value">{movie.Title}</span>
        </div>
        <div className="movie-description">
          <span className="label">Description: </span>
          <span className="value">{movie.Description}</span>
        </div>

        <div className="movie-genre">
          <span className="label">Genre: </span>
          <span className="value">{movie.Genre.Name}</span>
        </div>
        <div className="movie-director">
          <span className="label">Director: </span>
          <span className="value">{movie.Director.Name}</span>
          <br /><button className="btn-dark col-6" onClick={()=>onClick()}>BACK
          </button>
          
        </div>
        </div>
        </div>
       </div>
       


    );*/
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
