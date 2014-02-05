'use strict';

var passport = require('passport');
var _ = require('underscore')._;
var config = require('../core').config('default');

passport.serializeUser(function(user, done) {
  done(null, user.username);
});
passport.deserializeUser(function(username, done) {
  done(null, { username: username });
});

if (config.auth && config.auth.strategies) {
  _.each(config.auth.strategies, function(auth) {
    try {
      passport.use(auth, require('./auth/' + auth).strategy);
    } catch (err) {
      console.log('Can not load the ' + auth + ' strategy:', err);
    }
  });
}
