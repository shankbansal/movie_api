import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

export function ProfileView({user}) {
  const [username, setUsername] = useState(user.Username);
  const [email, setEmail] = useState(user.Email);
  const [birthday, setBirthday] = useState(user.Birthday);
  const [password, setPassword] = useState("");

  function removeFavMovie(movie){
    //Movie remove code
    axios.delete("https://shashank-my-flix.herokuapp.com/user/" + username+"")
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
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        user.Username = username;
        user.Email = email;
        user.Birthday = birthday;
        localStorage.setItem("user", JSON.stringify(user));
        // Assign the result to the state
        alert("User details updated!");
      })
      .catch(function(error) {
        alert("User already exists or invalid data");
      });
  }

  return (
    <div className="User-wrapper">
      <Form className="col-lg-6 offset-lg-3">
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

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Birthday</Form.Label>
          <Form.Control
            type="text"
            placeholder="Birthday"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
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
      </Form>
    </div>
  );
}
