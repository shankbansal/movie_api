const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

let movies = [
  {
  name:"Pellentesque",
  title:"Pharetra",
  description:"Donec id elit non mi porta gravida at eget metus. Nullam quis risus eget urna mollis ornare vel eu leo.", 
  genre:"Thriller", 
  director:{
    bio:"Cras mattis consectetur purus sit amet fermentum. Donec sed odio dui.",
    birthYear:1960,
    deathYear:2010
    },
  imageUrl:"https://homepages.cae.wisc.edu/~ece533/images/zelda.png",
  isFeatured:true
},{
  name:"Condimentum",
  title:"Justo",
  description:"Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.", 
  genre:"Adipiscing Ridiculus", 
  director:{
    bio:"Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Maecenas sed diam eget risus varius blandit sit amet non magna. Donec sed odio dui.",
    birthYear:1948,
    deathYear:2008
    },
  imageUrl:"https://homepages.cae.wisc.edu/~ece533/images/zelda.png",
  isFeatured:true
},{
name:"Ullamcorper",
title:"Tortor",
description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta sem malesuada magna mollis euismod.", 
  genre:"Commodo Tellus", 
  director:{
    bio:"Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Etiam porta sem malesuada magna mollis euismod.",
    birthYear:1965,
    deathYear:2009
    },imageUrl:"https://homepages.cae.wisc.edu/~ece533/images/zelda.png",
  isFeatured:true
},{
  name:"Ullamcorper",
  title:"Tortor",
  description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta sem malesuada magna mollis euismod.", 
    genre:"Commodo Tellus", 
    director:{
      bio:"Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Etiam porta sem malesuada magna mollis euismod.",
      birthYear:1965,
      deathYear:2009
      },imageUrl:"https://homepages.cae.wisc.edu/~ece533/images/zelda.png",
    isFeatured:true
  },{
name:"Fusce",
title:"Tellus",
description:"Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit.", 
  genre:"Tortor Ligula", 
  director:{
    bio:"Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    birthYear:1940,
    deathYear:2000
    },
  imageUrl:"https://homepages.cae.wisc.edu/~ece533/images/zelda.png",
  isFeatured:true
}]

let users = [];

app.get("/", (req, res) => {
  res.send("Welcome to Movie_API");
});

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/movies/:title",(req,res)=>{
  res.json(
    movies.find( (movie) =>{ 
      return movie.title === req.params.title   
      })
  );
})

app.get("/movies/:name/:title/genre",(req,res)=>{
  let movieObj = movies.find((movie) => { 
    return (movie.name === req.params.name && 
  movie.title === req.params.title)});

  if(movieObj){
    return res.json({description:movieObj.description});
  }else{
    res.status(404).send("Movie with the name " + req.params.name + " and title " + req.params.title+" was not found.");
  }  
})

app.get("/movies/:name/director",(req,res)=>{
  let movieObj = movies.find((movie) => { 
    return (movie.name === req.params.name)
  });

  if(movieObj){
    return res.send(movieObj.director);
  }else{
    res.status(404).send("Movie with the name " + req.params.name + " was not found.");
  }
})

// user registration
app.post("/user", (req, res) => {
  if(!req.body.username) return res.status(400).send('username not found');
  if(!req.body.password) return res.status(400).send('password not found');
  if(!req.body.email) return res.status(400).send('email not found');
  if(!req.body.dob) return res.status(400).send('dob not found')

  let userObj = users.find((user) => { 
    return (user.username === req.body.username ||
    user.email === req.body.email)
  });

  if(userObj) return res.status(400).send('User already registered');

  users.push({
    username:req.body.username,
    password:req.body.password,
    email:req.body.email,
    dob:req.body.dob,
    favMovie:{}
  });
  res.status(200).send('User registered successfully');
});

app.put('/user/:username',(req,res)=>{
  let userIndex = null;

  for(let i=0;i < users.length; i++){
    if(users[i].username == req.params.username){
      userIndex = i;
      break;
    }
  }

  if(userIndex == null) return res.status(404).send('User with username '+req.params.username+" not found")
  if(req.body.hasOwnProperty('username')) users[userIndex].username = req.body.username;
  if(req.body.hasOwnProperty('email')) users[userIndex].email = req.body.email;
  if(req.body.hasOwnProperty('password')) users[userIndex].password = req.body.password;
  if(req.body.hasOwnProperty('dob')) users[userIndex].dob = req.body.dob;

  res.status(200).send('User updated successfully');
});

app.put('/user/:username/:movieName',(req,res)=>{
  let userIndex = null;

  for(let i=0;i<users.length;i++){
    if(users[i].username == req.params.username){
      userIndex = i;
      break;
    }
  }

  if(userIndex == null) return res.status(404).send('User with username '+req.params.username+" is not registered")

  let movieObj = movies.find((movie) => { 
    return (movie.name === req.params.movieName);
  });

  if(!movieObj) return res.status(404).send('Movie with name '+req.params.movieName+" is not found")

  if(users[userIndex].favMovie.hasOwnProperty(movieObj.name))
  return res.status(201).send('Movie with name '+req.params.movieName+" is already in fav list")

  users[userIndex].favMovie[movieObj.name] = movieObj;
  res.status(200).send('Movie added to fav list successfully');
})

app.delete('/user/:username/:movieName',(req,res)=>{
  let userIndex = null;

  for(let i=0;i<users.length;i++){
    if(users[i].username == req.params.username){
      userIndex = i;
      break;
    }
  }

  if(userIndex == null) return res.status(404).send('User with username '+req.params.username+" is not registered")

  let movieObj = movies.find((movie) => { 
    return (movie.name === req.params.movieName);
  });

  if(!users[userIndex].favMovie.hasOwnProperty(movieObj.name))
  return res.status(201).send('Movie with name '+req.params.movieName+" is not in fav list")

  delete users[userIndex].favMovie[movieObj.name];
  res.status(200).send('Movie removed from fav list successfully');
})


app.delete('/user/:username',(req,res)=>{

  let userObj = users.find((user) => { 
    return (user.username === req.params.username);
  });

  if(!userObj) return res.status(404).send('User with username '+req.params.username+" is not registered")

  users = users.filter(function(user) { 
    return user.username !== req.params.username 
  });

  res.status(200).send('User deleted successfully');
});


app.listen(8080, () => {
  console.log(`Your app is listening on port 8080`);
});