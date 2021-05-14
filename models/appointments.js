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
     * @param {object} db       The database to be queried.
     * @param {string} user     The user whose schedule is to be found.
     * @return {Promise<array>} Array of appointments that were found for the user, empty array if none were found.
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
    },

    /**
     * Create a new event and save it to `db` for the `user`.
     *
     * @param  {object} db    The database the event is to be saved in
     * @param  {string} user  The user whose schedule is to be changed
     * @param  {object} event An iCalendar event object
     * @param  {object} req   A request object
     * @return {boolean}      True if successful, false otherwise
     */
    create: function (db, user, event, req) {
        // TODO - Work in progress...
        // Query strings
        const insertQuery = "INSERT INTO appointments VALUES ($u_id, $appt_id, $start, $end, $timezone, $summary, $location, $geo, $organizer)";
        const u_idQuery = "SELECT u_id FROM authentication WHERE username = ?";

        // Variables
        let u_id = ""
        const currentDate = new Date();
        const iCal = {
            $u_id: "",
            $appt_id: "",
            $start: "",
            $end: "",
            $timezone: "",
            $summary: "",
            $location: "",
            $geo: "",
            $organizer: ""
        };
        let succeeded = false;

        // Functions
        const addHours = function (dateObj, hours) {
            const newObj = new Date(dateObj.getTime());
            newObj.setTime(newObj.getTime() + (hours*60*60*1000));
            return newObj;
        }

        const endDate = addHours(currentDate, 1);

        // Get u_id based on username
        db.get(u_idQuery, [user], (err, row) => {
            if (err) {
                console.error(err.message);
            } else {
                u_id = row.u_id;

                // Set event values
                event.uid(req.app.locals.uniqID());
                event.start(currentDate);
                event.end(endDate);
                event.location("Yo mamma's house");
                event.geo = { lat: 10, lon: 10 };
                event.organizer = { name: "Chad Napper", email: "myEmail@address.com" };

                // Build iCal object
                iCal.$u_id = u_id;
                iCal.$appt_id = event.uid();
                iCal.$start = event.start().toISOString();
                iCal.$end = event.end().toISOString();
                iCal.$timezone = event.timezone();
                iCal.$summary = event.summary();
                iCal.$location = event.location();
                iCal.$geo = JSON.stringify(event.geo);
                iCal.$organizer = JSON.stringify(event.organizer);

                // Insert event into database - Uncomment to add events to the db during development
                db.run(insertQuery, iCal, (err) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        succeeded = true;
                    }
                });
            }
        });
        return succeeded;
    }
};