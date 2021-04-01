const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // https://www.npmjs.com/package/ical-generator

    // Create calendar
    let cal = req.app.locals.iCal({
        domain: req.hostname,
        name: "Appointments",
        prodId: {
            company: "Chad Napper",
            product: "generic-software-receptionist",
            language: "EN"
        }
    });

    if (req.app.locals.role === "admin") {
        res.render('pages/appointments/view-all-admin', { title: "View All Appointments - Admin", cal: cal });
    } else {
        res.render('pages/appointments/view-all-client', { title: "View All Appointments", cal: cal });
    }
});

module.exports = router;