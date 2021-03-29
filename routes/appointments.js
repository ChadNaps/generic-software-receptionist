const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/appointments/view-all', { title: "View All Appointments" });
});

module.exports = router;