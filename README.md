# Generic Software Receptionist

**There is currently no stable release of this project**

## QuickStart:
1. Download and install [node.js](https://nodejs.org/en/download/).
2. Navigate to downloaded generic-software-receptionist folder.
3. Install dependancies with `npm install`.
5. Compile all sass files in `public/stylesheets` and `public/stylesheets/calendar-renderer` with your favorite sass compiler.
6. Start web server by typing `npm start`.
7. Default port is 3000.

---

## Purpose:
This is the codebase for a web application created for anyone's general use in order to facilitate the automation of scheduling, news, and potentially billing or other features as time permits for a sole proprietor.

## Mandatory Features:
* Scheduling Integration
    * [iCalendar](https://tools.ietf.org/html/rfc5545)
    * Build interface
* Intuitive Simple UX & UI
    * Build UI last, get functioning ugly app first
* Client Database - Store:
    * Client ID
    * First name
    * Last name
    * Client chart
    * Email
    * Password
* Login Security
  * Unique User IDs
  * Hashed Passwords

## Desirable Features:
* Google Calendar Integration
* OAuth 2
  * Facebook Authentication
  * Google Authentication
  * Apple Authentication
* Appointment Confirmation Notifications
* Notification System - to inform user of changes instantly
* Payment through app

## Technologies to Use:
* SQLite
* Express.js
* Node.js
* JavaScript
* EJS
* SASS
