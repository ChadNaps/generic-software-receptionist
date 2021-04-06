/**
 * Appointment Helper.
 * @module appointments
 */

module.exports = {
    /**
     * If user is set to 'admin', will return all appointments in db. Otherwise, user should be
     * set to the username of the currently logged in user. This function will then return
     * all appointments booked for the specified user from the db.
     *
     * @param {object} db       The database to be queried
     * @param {string} user     The user whose schedule is to be found
     * @return {Promise<array>} Array of appointments that were found for the user, empty array if none were found
     */
    load: async function (db, user) {
        const adminQuery = "SELECT * FROM appointments";
        const nonAdminQuery = "SELECT * FROM appointments WHERE u_id = ?";
        const UIDLookupQuery = "SELECT u_id FROM authentication WHERE username = ?";
        let u_id = "";

        return new Promise((resolve, reject) => {
            // Get ID of user if they aren't admin
            if (user !== "admin") {
                db.get(UIDLookupQuery, [user], (err, row) => {
                    if (err) {
                        return reject(err);
                    } else {
                        u_id = row.u_id;
                    }
                });
            }

            // Get appointments based on role or name of logged in user
            db.all(user === "admin" ? adminQuery : nonAdminQuery, user === "admin" ? [] : [u_id], (err, rows) => {
                if (err) {
                    return reject(err);
                } else {
                    // Correctly format stringified JSON entries
                    for (const row of rows) {
                        if (row.geo) {
                            row.geo = JSON.parse(row.geo);
                        }
                        if (row.organizer) {
                            row.organizer = JSON.parse(row.organizer);
                        }
                    }
                    return resolve(rows);
                }
            });
        });
    }
};