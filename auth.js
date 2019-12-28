var jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy
var jwt = require('jsonwebtoken');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
require('./passport'); // Your local passport file


function generateJWTToken(user) {
 return jwt.sign(user, jwtSecret, {
   subject: user.Username, // This is the username you’re encoding in the JWT
   expiresIn: '7d', // This specifies that the token will expire in 7 days
   algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
 });
}


/* POST login. */
module.exports = (router) => {
 router.post('/login', [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty()
  ], (req, res) => {

    // check the validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

   passport.authenticate('local', { session : false}, (error, user, info) => {
     if (error || !user) {
       return res.status(400).json({
         message: 'Something is not right',
         user: user
       });
     }
     req.login(user, { session: false }, (error) => {
       if (error) {
         res.send(error);
       }
       var token = generateJWTToken(user.toJSON());
       return res.json({ user, token });
     });
   })(req, res);
 });
}