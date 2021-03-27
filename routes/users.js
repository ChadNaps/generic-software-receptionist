const express = require('express');
const router = express.Router();

/* Get All Users */
router.get('/', function(req, res, next) {
    const db = req.app.locals.db;
    let query = "SELECT * FROM authentication";

    db.all(query, (err, data) => {
        if (err) {
            req.flash("error", err.message);
            next(err);
        }

        // Sort data objects array by username
        data.sort((a, b) => {
            let x = a.username.toLowerCase();
            let y = b.username.toLowerCase();
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });

        res.render('pages/users-view-all', { title: 'View All Accounts', data: data });
    });
});

/* Create New User Page */
router.get('/new', (req, res) => {
    res.render('pages/users-new', { title: 'Create New Account', u_id: req.app.locals.uniqID() });
});

/* Create New User */
router.post('/new', (req, res, next) => {
    // TODO - Add server-side data validation
    const db = req.app.locals.db;
    const createError = req.app.locals.createError;
    let query = "INSERT INTO authentication VALUES (?, ?, ?)";

    // Check if user already exists
    db.get("SELECT username FROM authentication WHERE username = ?", req.body.username, (err, row) => {
        if (err) {
            req.flash("error", err.message);
            next(err);
        }

        if (row) {
            next(createError(409, "That username already exists"));
        }
    });

    // Create new user
    req.app.locals.bcrypt.hash(req.body.password1, req.app.locals.saltRounds, (err, hash) => {
        if (err) {
            req.flash("error", err.message);
            next(err);
        } else {
            db.run(query, [req.body.u_id, req.body.username, hash], (err) => {
                if (err) {
                    req.flash("error", err.message);
                    next(err);
                } else {
                    req.flash("success", `Successfully created user: ${req.body.username}`);
                    res.redirect('/');
                }
            });
        }
    });
});

/* GET One User */
router.get('/:id', (req, res, next) => {
    const db = req.app.locals.db;
    const createError = req.app.locals.createError;
    let query = "SELECT * FROM authentication WHERE u_id = ?";

    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            req.flash("error", err.message);
            next(err);
        }

        if (!row) {
            next(createError("User ID Not Found"));
        } else {
            res.render('pages/users-view-one', { title: 'View Account', user: row });
        }
    });
});

/* Edit User Page */
router.post('/:id/edit', (req, res) => {
    res.render('pages/users-edit', { title: 'Edit Account', user: JSON.parse(req.body.user) });
});

/* Edit User */
router.put('/:id', (req, res, next) => {
    const db = req.app.locals.db;
    let query = "UPDATE authentication " +
        "SET username = ?, password_hash = ? " +
        "WHERE u_id = ?";

    req.app.locals.bcrypt.hash(req.body.data.password, req.app.locals.saltRounds, (err, hash) => {
        if (err) {
            next(err);
        } else {
            db.run(query,[req.body.data.username, hash, req.body.data.u_id], (err) => {
                if (err) {
                    req.flash("error", err.message);
                    next(err);
                } else {
                    req.flash("success", "User Successfully Edited");

                    // scripts.js uses this responseURL to redirect with a get request to the base route
                    res.send({responseURL: `${req.protocol}://${req.get('host')}${req.baseUrl}`});
                }
            });
        }
    });
});

/* Delete User Page */
router.post('/delete', (req, res) => {
    res.render('pages/users-delete', { title: 'Delete Account', user: JSON.parse(req.body.user) })
});

/* Delete User */
router.delete("/:id", (req, res, next) => {
const db = req.app.locals.db;
    const query = "DELETE FROM authentication WHERE u_id = ?";

    db.run(query, [req.body.u_id], (err) => {
        if (err) {
            req.flash("error", err.message);
            next(err);
        } else {
            req.flash("success", "Account Successfully Deleted");
            // scripts.js uses this responseURL to redirect with a get request to the base route
            res.send({responseURL: `${req.protocol}://${req.get('host')}${req.baseUrl}`});
        }
    });
});

module.exports = router;
