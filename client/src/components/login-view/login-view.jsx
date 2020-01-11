import PropTypes from 'prop-types';
import {Button,Form} from 'react-bootstrap';

import React, { useState } from 'react';
import axios from 'axios';
import { RegisterView } from '../registration-view/registration-view';
import './login-view.scss';


export function LoginView(props) {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const openRegistration=()=>{
    props.openRegistration();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://shashank-my-flix.herokuapp.com/login',{Username:username,Password:password})
    .then(response => {
      // Assign the result to the state
     props.onLoggedIn(response.data);
    })
    .catch(function (error) {
        alert('Invalid username or password');
    });

    
    /* Send a request to the server for authentication */
    /* then call props.onLoggedIn(username) */
  };


  return( 
    <div className="login-wrapper">
      <Form className="col-lg-6 offset-lg-3">
        <h1>Login</h1>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address </Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={username} onChange={e => setUsername(e.target.value)} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
    
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <div className="d-flex justify-content-around">
          <Button variant="primary" type="button" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outline-dark" type="button" onClick={openRegistration}>
            Register New User
          </Button>
        </div>
      </Form>
    </div>
  )

  /*return (
    <form>
      <label>
        Username:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="button" onClick={handleSubmit}>Submit</button>
    </form>
  );*/
}