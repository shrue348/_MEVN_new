const passport = require('koa-passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtsecret = "mysecretkey";

passport.use(new LocalStrategy({
  usernameField: 'displayName',
  passwordField: 'password',
  session: false
},
  function (displayName, password, done) {
    User.findOne({ displayName }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        return done(null, false, { message: 'User does not exist or wrong password.' });
      }
      return done(null, user);
    });
  })
);

//----------Passport JWT Strategy--------//

// Expect JWT in the http header

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: jwtsecret
};

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
  User.findById(payload.id, (err, user) => {
    if (err) {
      return done(err)
    }
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})
);