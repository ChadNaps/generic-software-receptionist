const express = require('express');
const router = express.Router();

// Auth functions
const authAdmin = function (req, res, next) {
    // If not logged in, log in
    if (!req.session.password || !req.session.username || !req.session.role) {
        res.render('pages/login', { title: 'Login' });
    // If logged in as admin, next
    } else if (req.session.password && req.session.username && req.session.role === "admin") {
        return next();
    // If logged in as anything but admin, throw error
    } else {
        return next(req.app.locals.createError(401, "You are not authorized to view this content."));
    }
};
const authClient = function (req, res, next) {
    // If not logged in, log in
    if (!req.session.password || !req.session.username || !req.session.role) {
        res.render('pages/login', { title: 'Login' });
    // If logged in as any role, next
    } else {
        return next();
    }
};

/* GET users route - Check user is admin on all /users routes except /users/new */
router.get(/^\/users(?!\/new).*$/gm, authAdmin);

/* GET appointments route */
router.get('/appointments', authClient);

/* GET login page */
router.get('/login', (req, res) => {
    res.render('pages/login', { title: 'Login' });
});

/* POST login page */
router.post('/login', (req, res, next) => {
    const redirect = function () {
        if (req.originalUrl === "/login") {
            res.redirect('/');
        } else {
            res.redirect(req.originalUrl);
        }
    }

    // If no session exists, create one
    if (!req.session.username || !req.session.password || !req.session.role) {
        let username = req.body.username;
        let password = req.body.password;
        let query = `SELECT username, password_hash, role FROM authentication WHERE username = ?`;
        const db = req.app.locals.db;

        db.get(query, [username], (err, row) => {
            if (err) {
                return next(err);
            }

            if (!row) {
                req.flash("error", "Incorrect username or password.");
                redirect();
            } else {
                req.app.locals.bcrypt.compare(password, row.password_hash, (err, result) => {
                    if (err) {
                        next(err);
                    } else if (!result) {
                        req.flash("error", "Incorrect username or password.");
                        redirect();
                    } else {
                        req.session.username = username;
                        req.session.password = row.password_hash;
                        req.session.role = row.role;
                        console.log(`User ${username} has just logged in!`);
                        req.flash("success", `You are now logged in as: ${username}!`);
                        redirect();
                    }
                });
            }
        });
    // If session exists, destroy it to log user out
    } else {
        req.session.regenerate(err => {
            if (err) {
                next(err);
            } else {
                req.flash("success", "User successfully logged out.");
                // scripts.js uses this responseURL to redirect with a get request to the base route
                res.send({responseURL: `${req.protocol}://${req.get('host')}`});
            }
        })
    }
});

module.exports = router;