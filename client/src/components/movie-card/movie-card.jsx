import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './movie-card.scss';

export class MovieCard extends React.Component {

 
  render() {
    // This is given to the <MovieCard/> component by the outer world
    // which, in this case, is `MainView`, as `MainView` is what’s
    // connected to your database via the movies endpoint of your API
    const { movie,onClick } = this.props;

    return (
      <div className="col-lg-3 p-2">      
          <Card className="movie-card">
          <Card.Img variant="top" src={movie.ImagePath} />
          <Card.Body>
            <Card.Title>{movie.Title}</Card.Title>
            <Card.Text>{movie.Description}</Card.Text>
            <Button className="btn-primary row" onClick={() => onClick(movie)}>Open</Button>
          </Card.Body>
        </Card>
        </div>
      );

    /*return (
    <div onClick={()=>onClick(movie)} className="movie-card">
        <span>{movie.Title}</span>
        <img className="movie-poster" src={movie.ImagePath} />
    </div>
    );*/
  }

  MovieCard.propTypes={
    movie:PropTypes.shape({
      Title:PropTypes.string,
      description:PropTypes.string
    }).isRequired,
    onClick:PropTypes.func.isRequired
  }
}