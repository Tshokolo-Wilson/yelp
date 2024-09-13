
const passport = require('passport');
const User = require('./models/user');
const LocalStrategy = require ('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isvalidPassword =await bcrypt.compare(password,user.password);
      if (!isvalidPassword) { 
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
  
 