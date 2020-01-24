import { Button, Form } from "react-bootstrap";
import { connect } from "react-redux";

import React, { useState } from "react";
import { setUser, setRegistration } from "../../actions/actions";
import axios from "axios";
import "./login-view.scss";

function LoginView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post("https://shashank-my-flix.herokuapp.com/login", {
        Username: username,
        Password: password
      })
      .then(response => {
        // Assign the result to the state
        props.setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        props.onLogin(response.data.token)
      })
      .catch(function(error) {
        alert("Invalid username or password");
      });

    /* Send a request to the server for authentication */
    /* then call props.onLoggedIn(username) */
  };

  return (
    <div className="login-wrapper">
      <Form className="col-lg-6 offset-lg-3">
        <h1>Login</h1>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Username </Form.Label>
          <Form.Control
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
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
          <Button variant="primary" type="button" onClick={handleSubmit}>
            Submit
          </Button>
          <Button
            variant="outline-dark"
            type="button"
            onClick={() => {
              props.setRegistration(true);
            }}
          >
            Register New User
          </Button>
        </div>
      </Form>
    </div>
  );
}

let mapStateToProps = state => {
  return {
    user: state.user,
    isRegistration: state.isRegistration
  };
};

export default connect(mapStateToProps, { setUser, setRegistration })(
  LoginView
);
