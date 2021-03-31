const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.app.locals.role === "admin") {
        res.render('pages/appointments/view-all-admin', { title: "View All Appointments - Admin" });
    } else {
        res.render('pages/appointments/view-all-client', { title: "View All Appointments" });
    }
});

module.exports = router;