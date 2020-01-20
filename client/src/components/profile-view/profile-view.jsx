import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import "./profile-view.scss";

export function ProfileView(props) {
  const history = useHistory();
  const [movies, setMovies] = useState(props.movies);
  const [username, setUsername] = useState(props.user.Username);
  const [email, setEmail] = useState(props.user.Email);
  const [birthday, setBirthday] = useState(props.user.Birthday);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(props.user);

  function removeUser() {
    axios
      .delete("https://shashank-my-flix.herokuapp.com/users/" + username, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      })
      .then(response => {
        alert("Account Removed");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload('/')
      })
      .catch(e => {
        console.log(e);
        alert("Error occurred");
      });
  }

  function removeFavMovie(movieId) {
    //Movie remove code
    axios
      .delete(
        "https://shashank-my-flix.herokuapp.com/users/" +
          username +
          "/Movies/" +
          movieId,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        }
      )
      .then(response => {
        alert("Movie removed from favourite list");
        let storedUser = localStorage.getItem("user");
        storedUser = JSON.parse(storedUser);
        let favMovies = [];
        storedUser.FavoriteMovies.map(mId => {
          if (mId !== movieId) {
            favMovies.push(mId);
          }
        });
        storedUser.FavoriteMovies = favMovies;
        localStorage.setItem("user", JSON.stringify(storedUser));
        setUser(storedUser);
      })
      .catch(e => {
        alert("Movie not in favourite list");
      });
  }

  function update() {
    let userObj = {
      Username: username,
      Birthday: birthday,
      Email: email
    };
    if (password) userObj["Password"] = password;
    axios
      .put(
        "https://shashank-my-flix.herokuapp.com/users/" + props.username,
        userObj,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        }
      )
      .then(response => {
        let storedUser = localStorage.getItem("user");
        storedUser = JSON.parse(storedUser);
        storedUser.Username = username;
        storedUser.Email = email;
        storedUser.Birthday = birthday;
        localStorage.setItem("user", JSON.stringify(storedUser));
        // Assign the result to the state
        alert("User details updated!");
      })
      .catch(function(error) {
        alert("User already exists or invalid data");
      });
  }

  return (
    <div className="col">
      <Form className="col-lg-6 offset-lg-3 p-3">
        <h1>User Details</h1>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Birthday</Form.Label>
          <Form.Control
            type="text"
            placeholder="Birthday"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="d-flex justify-content-around">
          <Button variant="primary" type="button" onClick={update}>
            Update
          </Button>
          <Link to="/">
            <Button variant="dark" type="button">
              Back
            </Button>
          </Link>
        </div>
        <div className="col-12 d-flex justify-content-between mt-4">
          {user.FavoriteMovies.map(id => (
            <Button
              variant="outline-danger"
              className="col-3"
              key={id}
              onClick={() => removeFavMovie(id)}
            >
              {movies.find(m => m._id == id).Title}
            </Button>
          ))}
        </div>
        <div className="col-12 d-flex mt-4">
          <Button
            variant="danger"
            className="col-3"
            onClick={() => removeUser()}
          >
            Remove Account
          </Button>
        </div>
      </Form>
    </div>
  );
}
