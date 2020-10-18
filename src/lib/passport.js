const passport = require('passport');
const pool = require('../database');
const LocalStrategy = require('passport-local').Strategy;
const helpers = require('./helpers');

passport.use(
	'local.signup',
	new LocalStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true
		},
		async (req, username, password, done) => {
			const { email, f_name, l_name, edad } = req.body;
			let newUser = {
				username,
				password,
				email,
				f_name,
				l_name,
				edad
			};
			newUser.password = await helpers.encryptPass(password);
			/* Guarda en la DB */
			const result = await pool.query('INSERT INTO usuario SET ?', newUser);
			newUser.id = result.insertId;
			//req.flash('success', 'Usuario Agregado');
			return done(null, newUser);
		}
	)
);

passport.serializeUser((user, done)=> {
	done(null, user.id);
});

passport.deserializeUser(async (id, done)=>{
	const rows = await pool.query('SELECT * FROM usuario WHERE id = ?', [id]);
	done(null, rows[0]);
});