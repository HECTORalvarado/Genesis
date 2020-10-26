const express = require("express");
const morgan = require("morgan");
const exhdbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const mysqlStore = require("express-mysql-session");
const { urlencoded } = require("express");
const passport = require("passport");
const { use } = require("passport");
const MySQLStore = require("express-mysql-session");
const { database } = require("./keys");

/* Inicializaciones */

const app = express();
require("./lib/passport");

/* Configuraciones */

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
	".hbs",
	exhdbs({
		defaultLayout: "main",
		layoutsDir: path.join(app.get("views"), "layouts"),
		partialsDir: path.join(app.get("views"), "partials"),
		extname: ".hbs",
		helpers: require("./lib/handelbars"),
	})
);
app.set("view engine", ".hbs");

/* Midllewares */

app.use(
	session({
		secret: "admin",
		resave: false,
		saveUninitialized: false,
		store: new MySQLStore(database),
	})
);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());

// passport //
app.use(passport.initialize());
app.use(passport.session());

/* Variables globales */

app.use((req, res, next) => {
	next();
	app.locals.success = req.flash("success");
	app.locals.message = req.flash("message");
	app.locals.user = req.user;
});

/* Rutas */

app.use(require("./routes"));
app.use(require("./routes/authentication"));
app.use(require("./routes/checkout"));
app.use("/products", require("./routes/products"));

/* publico */

app.use(express.static(path.join(__dirname, "public")));

/* iniciar servidor */

app.listen(app.get("port"), () => {
	console.log("servidor en el puerto: ", app.get("port"));
});
