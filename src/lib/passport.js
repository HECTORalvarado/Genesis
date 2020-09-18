const passport = require('passport');
const pool = require('../database');
const LocalStartegy = require('passport-local').Strategy;

require('../database')

passport.use('local.signup', new LocalStartegy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async ( req, username, password, done)=> {
    const {} = req.body;
    const newUser = {
        username,
        password,

    }
    await pool.query('INSERT INTO usuario SET ?', [newUser])
}));

/* passport.serializeUser((usr, done)=> {

}); */