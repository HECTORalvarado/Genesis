const passport = require('passport');
const pool = require('../database');
const LocalStrategy = require('passport-local').Strategy;
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, username, password, done)=>{
	const rows = await pool.query('SELECT * FROM usuario where username = ?', [username]);
	if(rows.length > 0){
		const user = rows[0];
		const validPass = await helpers.matchPass(password, user.password);
		if (validPass) {
			done(null, user, req.flash('success', 'Bienvenido '+ user.username));
		} else {
			console.log('pass incorecta')
			done(null, false, req.flash('message', 'Contraseña incorecta'));
		}
	} else {
		console.log('usuario no existe');
		return done(null, false, req.flash('message', 'El usuario no existe'));
	}
}));

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
			
			const userName = await pool.query('SELECT * FROM usuario');
				// Comprueba si hay usuarios con el mismo username
				if (userName === newUser.username) {
					console.log('El usuario ya existe');
					return done(null, false,
						req.flash('message', 'El usuario ya existe'));
				} else {		
					newUser.password = await helpers.encryptPass(password);
					/* Guarda en la DB */
					const result = await pool.query('INSERT INTO usuario SET ?', newUser);
					newUser.id = result.insertId;
					req.flash('success', 'Usuario Agregado');
					return done(null, newUser);
				}
			
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const rows = await pool.query('SELECT * FROM usuario WHERE id = ?', [id]);
	done(null, rows[0]);
});