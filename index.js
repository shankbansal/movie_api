const express = require('express');
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Models = require('./models.js');
const passport = require('passport');
require('./passport');
const cors = require('cors');


const Movies = Models.Movie;
const Users = Models.User;

const app = express();
app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
  "Access-Control-Allow-Origin": "*"
}));

require('./auth')(app);

mongoose.connect('mongodb+srv://myFlixDBadmin:test123@cluster0-olxep.mongodb.net/myFlix', { useNewUrlParser: true, useUnifiedTopology: true });

//Get "/"
app.get('/', function(req, res) {
  res.send('Welcome to my Movie API')
});

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), function(req, res) {

  Users.find().populate({ path: 'FavoriteMovies', model: 'Movie' })
    .then(function(users) {
      res.status(201).json(users)
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get all movies
app.get('/movies',passport.authenticate('jwt', { session: false }), function(req, res) {

  Movies.find()
    .then(function(movies) {
      res.status(201).json(movies)
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get movie details by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), function(req, res) {

  Movies.find({ Title: req.params.title })
    .then(function(movies) {
      res.status(201).json(movies);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get genre description by title
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), function(req, res) {

  Movies.findOne({ "Genre.Name": req.params.genreName })
    .then(function(movies) {
      res.status(201).json({ description: movies.Genre.Description })
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get Director details by directorName 
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), function(req, res) {

  Movies.findOne({ "Director.Name": req.params.directorName })
    .then(function(movies) {
      res.status(201).json(movies.Director)
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOne({ Username: req.params.Username })
    .then(function(user) {
      res.json(user)
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Email', 'Email does not appear to be valid').isEmail()
],
  function(req, res) {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:      {
        Username: req.body.Username,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
      { new: true }, // This line makes sure that the updated document is returned
      function(err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser)
        }
      })
  });

//Add a user
/* We’ll expect JSON in this format
{
 ID : Integer,
 Username : String,
 Password : String,
 Email : String,
 Birthday : Date
}*/!

  app.post('/users', [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
    function(req, res) {
      var hashedPassword = Users.hashPassword(req.body.Password)
      Users.findOne({ Username: req.body.Username }) //search if the user already exists
        .then(function(user) {

          // check the validation object for errors
          var errors = validationResult(req);

          if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
          }

          if (user) {
            return res.status(400).send(req.body.Username + "already exists");
          } else {
            Users
              .create({
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
              })
              .then(function(user) { res.status(201).json(user) })
              .catch(function(error) {
                console.error(error);
                res.status(500).send("Error: " + error);
              })
          }
        }).catch(function(error) {
          console.error(error);
          res.status(500).send("Error: " + error);
        });
    });

// Add a movie to a user's list of favorites
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), async function(req, res) {

  const userObj = await Users.findOne({ Username: req.params.Username })
  const index = userObj.FavoriteMovies.indexOf(req.params.MovieID)

  if (index !== -1) return res.status(403).send("Movie already added to favourite list");

  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }, // This line makes sure that the updated document is returned
    function(err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then(function(user) {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});


// listen for requests
var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
console.log("Listening on Port 3000");
});