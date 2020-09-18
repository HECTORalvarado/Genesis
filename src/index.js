const express = require('express');
const morgan = require('morgan');
const exhdbs = require('express-handlebars');
const path = require('path');
const { urlencoded } = require('express');
const passport = require('passport');
const { use } = require('passport');

/* Inicializaciones */

const app = express();
require('./lib/passport');

/* Configuraciones */

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exhdbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handelbars')
}));
app.set('view engine','.hbs');

/* Midllewares */

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

    // passport //
app.use(passport.initialize());
app.use(passport.session());

/* Variables globales */

app.use((req, res, next) => {
    next();
});

/* Rutas */

app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/products' ,require('./routes/products'));

/* publico */

app.use(express.static(path.join(__dirname, 'public')));

/* iniciar servidor */

app.listen(app.get('port'), ()=>{
    console.log('servidor en el puerto: ', app.get('port'));
});