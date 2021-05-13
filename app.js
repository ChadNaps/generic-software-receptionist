// Requires
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
const iCal = require("ical-generator");

// Database Setup
const sqlite3 = require('sqlite3').verbose();
/* Query Setup */
const adminQuery = "SELECT role FROM authentication WHERE role = ?";
const buildAuthTableQuery = "CREATE TABLE authentication (" +
    "u_id TEXT PRIMARY KEY NOT NULL," +
    "username TEXT NOT NULL UNIQUE," +
    "password_hash TEXT NOT NULL," +
    "role TEXT NOT NULL DEFAULT 'client');";
const apptTableExistsQuery = "SELECT COUNT(name) FROM sqlite_master WHERE type='table' AND name='appointments'"
const buildApptsTableQuery = "CREATE TABLE appointments (" +
    "u_id TEXT NOT NULL," +
    "appt_id TEXT PRIMARY KEY NOT NULL," +
    "start TEXT NOT NULL," +
    "end TEXT," +
    "timezone TEXT," +
    "summary TEXT," +
    "location TEXT," +
    "geo TEXT," +
    "organizer TEXT," +
    "FOREIGN KEY (u_id)" +
    "REFERENCES authentication (u_id) " +
    "ON UPDATE CASCADE " +
    "ON DELETE CASCADE" +
    ");"
/* Parameters to check initialization status */
let adminExists = false;
let tableExists = false;
/* Load DB and check if it needs to be initialized or not */
const db = new sqlite3.Database(path.join(__dirname, 'models/users.db'), (err) => {
    if (err) {
        return console.error(err.message);
    } else {
        console.log("Connected to users database");
    }
/* Check if admin account exists */
}).get(adminQuery, ["admin"], (err, row) => {
    if (err) {
        /* If there is no table */
        if (err.message === "SQLITE_ERROR: no such table: authentication") {
            console.warn(err.message);
            console.log("Building authentication table now...");

            db.run(buildAuthTableQuery, [], (err) => {
                if (err) {
                    return console.error(err.message);
                } else {
                    console.log("Authentication table built!");
                }
            });
        } else {
            return console.error(err.message);
        }
    }

    if (row) {
        adminExists = true;
    }

    const initializationQuery = "INSERT INTO authentication VALUES (?, ?, ?, ?)";
    /* If there is no admin account, create default */
    if (!adminExists) {
        console.log("No admin account detected! Initializing admin account...");
        bcrypt.hash("admin", saltRounds, (err, hash) => {
            if (err) {
                return console.error(err.message);
            } else {
                db.run(initializationQuery, [uniqID(), "admin", hash, "admin"], (err) => {
                    if (err) {
                        return console.error(err.message);
                    } else {
                        console.log("Admin account initialized!");
                        console.log("----Login Credentials----\n" +
                            "Username: admin\n" +
                            "Password: admin");
                    }
                });
            }
        });
    }
/* Check if appointments table exists */
}).get(apptTableExistsQuery, [], (err, row) => {
    if (err) {
        console.error(err);
    } else {
        tableExists = row['COUNT(name)'];

        if (!tableExists) {
            console.warn("SQLITE_ERROR: no such table: appointments");
            console.log("Building appointments table now...")
            db.run(buildApptsTableQuery, [], (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log("Appointments table built!");
                }
            });
        }
    }
});

// Route Definitions
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const appointmentsRouter = require('./routes/appointments');

// Start Express
const app = express();

// Give app wide access to certain packages
app.locals.createError = createError; // Error handling
app.locals.db = db; // Database access
app.locals.bcrypt = bcrypt; // Password encryption
app.locals.saltRounds = saltRounds; // Password salt
app.locals.uniqID = uniqID; // Unique User IDs
app.locals.authHelper = ""; // Initialize for auth routing
app.locals.iCal = iCal; // iCalendar handling

// TODO - Set to production before launch
// Set Environment Variable
app.set("env", "development"); // development || testing || production

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
app.use(express.static(path.join(__dirname, 'in_development')));
// FIXME - Make better secret
app.use(session({resave: false, saveUninitialized: true, secret: "badSecret"}));
app.use((req, res, next) => {
    // Authentication helper
    const routeIgnore = ['/login', '/favicon.ico']
    if (!routeIgnore.includes(req.originalUrl)) {
        req.app.locals.authHelper = req.originalUrl;
    }

    // Give all views access to role of logged in user
    if (!app.locals.role || app.locals.role !== req.session.role) {
        app.locals.role = req.session.role;
    }

    return next();
});
app.use(flash());

// Routes
app.use('/', loginRouter, indexRouter);
app.use('/users', loginRouter, usersRouter);
app.use('/appointments', loginRouter, appointmentsRouter);

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
    res.status(err.status || 500);
    res.render('pages/error');
});

module.exports = app;
