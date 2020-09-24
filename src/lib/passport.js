const passport = require('passport');
const pool = require('../database');
const LocalStartegy = require('passport-local').Strategy;
const helpers = require('../lib/helpers');

require('../database')

passport.use('local.signup', new LocalStartegy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async ( req, username, password, done)=> {
    const {email, f_name, l_name, edad} = req.body;
    const newUser = {
        username,
        password,
        email,
        f_name,
        l_name,
        edad
    }
    newUser.password = await helpers.encryptPass(password);

    await pool.query('INSERT INTO usuario SET ?', [newUser]);
    req.flash('success', 'Usuario Agregado');
    
}));

/* passport.serializeUser((usr, done)=> {

}); */