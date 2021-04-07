/**
 * Class Rendering a Calendar.
 */
module.exports = class CalRenderer {
    /**
     * Create a calendar representing a specific month.
     *
     * @param {number} [year]  The year of the calendar.
     * @param {number} [month] The month of the calendar from 0 to 11.
     */
    constructor(year, month) {
        this.firstDateOfMonth = this.firstDate(year, month);
        this.firstDayOfMonth = this.firstDateOfMonth.getDay();
        this.lastDateOfMonth = this.lastDate(year, month);
        this.daysInMonth = this.daysThisMonth(year, month);
    }
    // Functions intended to be public
    renderCalendar() {
        // TODO
    }

    // Functions intended to be private
    /**
     * Finds the Date object representing the first day of the month. If no arguments are provided,
     * the current month and year are checked.
     *
     * @param {number} [year]  The year to find the right calendar.
     * @param {number} [month] The month to find the right calendar from 0 to 11.
     * @return {Date}          The Date object representing the first day of the month.
     */
    firstDate(year, month) {
        let dateToCheck;

        if (year && month) {
            dateToCheck = new Date(year, month);
        } else {
            dateToCheck = new Date();
            dateToCheck.setDate(1);
        }

        return dateToCheck;
    }

    /**
     * Finds the Date object representing the last day of the month. If no arguments are provided,
     * the current month and year are checked.
     *
     * @param {number} [year]  The year to find the right calendar.
     * @param {number} [month] The month to find the right calendar from 0 to 11.
     * @return {Date}          The Date object representing the last day of the month.
     */
    lastDate(year, month) {
        let dateToCheck;

        if (year && month) {
            dateToCheck = new Date(year, month + 1, 0);
        } else {
            dateToCheck = new Date();
            dateToCheck.setMonth(dateToCheck.getMonth() + 1);
            dateToCheck.setDate(0);
        }

        return dateToCheck;
    }

    /**
     * Finds how many days there are in the month provided. If no arguments are provided,
     * returns the number of days in the current month.
     *
     * @param {number} [year]  The year to find the right calendar.
     * @param {number} [month] The month to find the right calendar from 0 to 11.
     * @return {number}        The number of days in the selected month.
     */
    daysThisMonth(year, month) {
        let numOfDays;

        if (year && month) {
            numOfDays = new Date(this.lastDate(year, month).getDate());
        } else {
            numOfDays = new Date(this.lastDate().getDate());
        }

        return numOfDays.valueOf();
    }

    // Getters
    /**
     * Get the first date of the month.
     *
     * @return {Date} The first day of the month.
     */
    getFirstDate() {
        return this.firstDateOfMonth;
    }

    /**
     * Get name of the first day of the month.
     *
     * @return {string} The name of the first day of the month.
     */
    getDay() {
        const weekday = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        return weekday[this.firstDayOfMonth];
    }

    /**
     * Get the last date of the month.
     *
     * @return {Date} The last day of the month.
     */
    getLastDate() {
        return this.lastDateOfMonth;
    }

    /**
     * Get the number of days in the month.
     *
     * @return {number} Number of days in the month.
     */
    getDaysThisMonth() {
        return this.daysInMonth;
    }

    // Setters
    /**
     * Set the calendar to a new month.
     *
     * @param {number} [year]  The year to set the calendar to.
     * @param {number} [month] The month to set the calendar to from 0 to 11.
     */
    setMonth(year, month) {
        this.firstDateOfMonth = this.firstDate(year, month);
        this.lastDateOfMonth = this.lastDate(year, month);
        this.daysInMonth = this.daysThisMonth(year, month);
    }
}