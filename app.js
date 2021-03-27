// noinspection JSCheckFunctionSignatures,JSUnresolvedVariable

const createError = require('http-errors');
const express = require('express');
const path = require('path');
// TODO - Change default session store before launch.
const session = require('express-session');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const uniqID = require('uniqid');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const flash = require("express-flash");

// Database Setup
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.join(__dirname, 'models/users.db'), (err) => {
    if (err) {
        return console.error(err.message);
    } else {
        console.log("Connected to users database.");
    }
});

// Route Definitions
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');

// Start Express
const app = express();

// Give app wide access to certain packages
app.locals.createError = createError; // Error handling
app.locals.db = db; // Database access
app.locals.bcrypt = bcrypt; // Password encryption
app.locals.saltRounds = saltRounds; // Password salt
app.locals.uniqID = uniqID; // Unique User IDs

// TODO - Set to production before launch
// Set Environment Variable
app.set("env", "testing"); // development || testing || production

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// TODO - Look into etags
// Disable etags
//app.disable("etag");

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(sassMiddleware({
    src: path.join(__dirname, 'public/stylesheets'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
// FIXME - Make better secret
app.use(session({resave: false, saveUninitialized: true, secret: "badSecret"}));
app.use((req, res, next) => {
    // Used to route properly in the loginRouter
    app.locals.path = req.path;
    return next();
});
app.use(flash());

// Routes
app.use('/', loginRouter, indexRouter);
app.use('/users', loginRouter, usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};


    // Render the error page
    // noinspection JSUnresolvedFunction
    res.status(err.status || 500);
    // noinspection JSUnresolvedFunction
    res.render('pages/error');
});

module.exports = app;
