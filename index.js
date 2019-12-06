const express = require('express');
const morgan = require('morgan');

const app = express();

let favMovies = [ {
    title : 'Harry Potter and the Sorcerer\'s Stone',
    author : 'ABC'
},
{
    title : 'Lord of the Rings',
    author : 'XYZ'
},
{
    title : 'Twilight',
    author : 'KLM'
}
]

app.use(morgan('common'))

app.get('/', function(req, res) {
  res.send('Welcome to my favourite movie list!');
});

app.use('/', express.static(__dirname+'/public')); //serving the directory containing documentation.html

// GET requests
app.get('/movies', function(req, res) {
  res.json(favMovies)
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () =>
  console.log('Your app is listening on port 8080.')
);