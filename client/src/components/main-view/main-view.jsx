import React from 'react';
import axios from 'axios';
import {MovieCard} from '../movie-card/movie-card';
import {MovieView} from '../movie-view/movie-view';
import {LoginView} from '../login-view/login-view';
import {RegisterView} from '../registration-view/registration-view'
export class MainView extends React.Component {

    constructor(){
        super();
        this.state={
            movies:null,
            selectedMovie:null,
            user:null,
            isRegistration:null
        };
    }

    onMovieClick(movie){
        this.setState({
            selectedMovie:movie
        })
    }

    onLoggedIn(user){
        this.setState({
            user
        })
    }

    // One of the "hooks" available in a React Component
    componentDidMount() {
      axios.get('https://shashank-my-flix.herokuapp.com/movies')
        .then(response => {
          // Assign the result to the state
          this.setState({
            movies: response.data
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  
    goBack(){
        this.setState({selectedMovie:null});
    }

    openRegistration(){
        this.setState({isRegistration:true});
    }

    openLogin(){
        this.setState({isRegistration:null});
    }


    onRegistered(user){
      this.setState({
        user:user,
        isRegistration:false
      })
    }
    render() {
      // If the state isn't initialized, this will throw on runtime
      // before the data is initially loaded
      const { movies,selectedMovie,user,isRegistration } = this.state;
  
      if(isRegistration) return <RegisterView onRegistered={user=>this.onRegistered(user)} openLogin={()=>this.openLogin()}/>
     if(!user) return <LoginView onLoggedIn={user=>this.onLoggedIn(user)} openRegistration={()=>this.openRegistration()}/>

      // Before the movies have been loaded
      if (!movies) return <div className="main-view"/>;
  
      return (
       <div className="row p-3">
       {selectedMovie
         ?
         <MovieView movie={selectedMovie}  onClick={()=>this.goBack()}/>
                  : movies.map(movie => (
           <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)}/>
         ))
      }
       </div>
      );
    }
  }

