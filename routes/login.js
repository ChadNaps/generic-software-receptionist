const express = require('express');
const router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
    if (req.session.password && req.session.username) {
        return next();
    } else {
        res.render('pages/login', { title: 'Login' });
    }
});

/* POST login page. */
router.post('/', (req, res, next) => {

    let username = req.body.username;
    let password = req.body.password;
    let query = `SELECT username, password_hash FROM authentication WHERE username = ?`;
    const db = req.app.locals.db;
    const createError = req.app.locals.createError;

    db.get(query, [username], (err, row) => {
        if (err) {
            next(err);
        }

        req.app.locals.bcrypt.compare(password, row.password_hash, (err, result) => {
            if (err) {
                next(err);
            } else if (!result) {
                next(createError(401, "Wrong username or password"))
            } else {
                req.session.username = username;
                req.session.password = row.password_hash;
                console.log(`User ${username} has just logged in!`);
                req.flash("success", `You are now logged in as: ${username}!`);
                res.redirect(req.app.locals.path);
            }
        });
    });
});

module.exports = router;