/**
 * Appointment Helper.
 * @module appointments
 */

module.exports = {
    /**
     * If user is set to 'admin', will return all appointments in db. Otherwise, user should be
     * set to the username of the currently logged in user. This function will then return
     * all appointments booked for the specified user from the provided db.
     *
     * @param {object} db   The database to be queried
     * @param {string} user The user whose schedule is to be found
     * @return {array}     Array of appointments that were found for the user
     */
    load: function (db, user) {

        if (user === "admin") {
            const query = "SELECT * FROM appointments";
            db.all(query, [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                } else {
                    return rows;
                }
            });
        } else {
            const query = "SELECT * FROM appointments WHERE u_id = (SELECT u_id FROM authentication WHERE username = ?)";
            db.all(query, [user], (err, rows) => {
                if (err) {
                    console.error(err.message);
                } else {
                    return rows;
                }
            });
        }
    }
};