const express = require('express');
const apptHelper = require('../models/appointments');
const router = express.Router();

router.get('/test', (req, res) => {
    res.sendFile('C:/Users/nappe/WebstormProjects/generic-software-receptionist/in_development/calendar-prototype.html');
});

router.get('/', (req, res, next) => {
    // https://www.npmjs.com/package/ical-generator

    // Create calendar
    let cal = req.app.locals.iCal({
        domain: req.hostname,
        name: "Appointments",
        prodId: {
            company: "Chad Napper",
            product: "generic-software-receptionist",
            language: "EN"
        },
        timezone: "Etc/UTC"
    });

    if (req.app.locals.role === "admin") {
        // Load all events from DB
        apptHelper.load(req.app.locals.db, "admin")
            .then(events => {
                cal.events(events);
                res.render('pages/appointments/view-all-admin', { title: "View All Appointments - Admin", cal: cal.events() });
            })
            .catch(err => {
                console.error(err);
                next(err);
            });
    } else {
        // Load specific user events from DB
        apptHelper.load(req.app.locals.db, req.session.username)
            .then(events => {
                cal.events(events);
                res.render('pages/appointments/view-all-client', { title: "View All Appointments", cal: cal.events() });
            })
            .catch(err => {
                console.error(err);
                next(err);
            });
    }
});

module.exports = router;