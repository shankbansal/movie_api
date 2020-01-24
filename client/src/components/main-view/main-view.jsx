import React from "react";
import axios from "axios";

import { connect } from "react-redux";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { setMovies, setUser, setRegistraion, setFilter } from "../../actions/actions";

import { MovieView } from "../movie-view/movie-view";
import LoginView from "../login-view/login-view";
import RegisterView from "../registration-view/registration-view";
import VisibilityFilter from "../visibility-filter-input/visibility-filter-input";

import { MovieCard } from "../movie-card/movie-card";
import { GenreView } from "../genre-view/genre-view";
import { DirectorView } from "../director-view/director-view";
import ProfileView from "../profile-view/profile-view";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import "./main-view.scss";

class MainView extends React.Component {
  constructor() {
    super();
  }

  getMovies(token) {
    axios
      .get("https://shashank-my-flix.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.props.setMovies(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  // One of the "hooks" available in a React Component
  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.props.setUser(JSON.parse(localStorage.getItem("user")));
      this.getMovies(accessToken);
    }
  }

  onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.props.setUser(null);
  };

  render() {
    // If the state isn't initialized, this will throw on runtime
    // before the data is initially loaded

    if (this.props.isRegistration) return <RegisterView />;

    if (!this.props.user)
      return <LoginView onLogin={token => this.getMovies(token)} />;

    // Before the movies have been loaded
    if (!this.props.movies) return <div className="main-view" />;

    let filteredMovies=[];
    if (this.props.visibilityFilter !== "") {
      filteredMovies = this.props.movies.filter(m => m.Title.includes(this.props.visibilityFilter));
    }else{
      filteredMovies= this.props.movies;
    }

    return (
      <Router>
        <div className="row p-3">
          <VisibilityFilter />
          <Button
            variant="outline-dark"
            className="col-12 row-1"
            onClick={this.onLogout}
          >
            Log Out
          </Button>

          <Route
            exact
            path="/"
            render={() =>
              filteredMovies.map(m => <MovieCard key={m._id} movie={m} />)
            }
          />
          <Route
            path="/movies/:movieId"
            render={({ match }) => (
              <MovieView
                movie={this.props.movies.find(
                  m => m._id === match.params.movieId
                )}
              />
            )}
          />
          <Route
            path="/genres/:name"
            render={({ match }) => (
              <GenreView
                genre={
                  this.props.movies.find(
                    m => m.Genre.Name === match.params.name
                  ).Genre
                }
              />
            )}
          />

          <Route
            path="/directors/:name"
            render={({ match }) => {
              return (
                <DirectorView
                  director={
                    this.props.movies.find(
                      m => m.Director.Name === match.params.name
                    ).Director
                  }
                />
              );
            }}
          />
          <Route path="/profile" render={() => <ProfileView />} />

          <Button
            href="/profile"
            type="button"
            variant="outline-warning"
            className="col-12 row-1"
          >
            User
          </Button>
        </div>
      </Router>
    );
  }
}

let mapStateToProps = state => {
  return {
    movies: state.movies,
    user: state.user,
    isRegistration: state.isRegistration,
    visibilityFilter: state.visibilityFilter
  };
};

export default connect(mapStateToProps, {
  setMovies,
  setUser,
  setRegistraion,
  setFilter
})(MainView);
