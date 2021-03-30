// Global scripts
const navbar = document.getElementById("navbar");

// NavBar Handler
if (navbar) {
    // Logic for active link in navbar
    for (const child of navbar.children) {
        if (child.id === document.title) {
            if (!child.classList.contains("active")) {
                child.classList.add("active");
            }

            if (child.getAttribute("href") !== "") {
                child.setAttribute("href", "");
            }
        } else {
            if (child.classList.contains("active")) {
                child.classList.remove("active");
            }

            if (child.getAttribute("href") === "") {
                switch (child.id) {
                    case "Homepage":
                        child.setAttribute("href", "/");
                        break;

                    case "View All Appointments":
                        child.setAttribute("href", "/appointments");

                    case "View All Accounts":
                        child.setAttribute("href", "/users");
                        break;

                    default:
                        Error("No href available for link.");
                }
            }
        }
    }

    // Logout Button
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            axios.post('/login').then(response => {
                location.href = response.data.responseURL;
            }).catch(error => {
                console.error(error);
            });
        });
    }

    // Login Button
    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            location.href = '/login';
        });
    }
}

// Page specific scripts
if (document.title === "Login") {
    const newAccountBtn = document.getElementById("newAccountButton");
    const cancelBtn = document.getElementById("cancelButton");

    newAccountBtn.addEventListener("click", () => {
        location.href = 'users/new';
    });

    cancelBtn.addEventListener("click", () => {
        location.href = '/';
    });
}

if (document.title === "Create New Account") {
    const pw1 = document.getElementById("password1");
    const pw2 = document.getElementById("password2");
    const submitBtn = document.getElementById("submitButton");
    const cancelBtn = document.getElementById("cancelButton");
    const form = document.getElementsByTagName("form")[0];
    const invalidRadioDiv = document.getElementById("invalidRadioDiv");

    // Submit Button
    submitBtn.addEventListener("click", (event) => {
        event.preventDefault();

        // Enable form validation
        if (!form.classList.contains("was-validated")) {
            form.classList.add("was-validated");
        }

        // New validation code goes here...

        // Check if passwords match
        if (pw1.value !== pw2.value) {
            pw1.setCustomValidity("Passwords don't match!");
            pw2.setCustomValidity("Passwords don't match!");
        }

        // Check validity of form elements
        for (element of form) {
            if (!element.checkValidity()) {
                if (element.type !== "radio") {
                    element.nextElementSibling.innerText = element.validationMessage;
                } else {
                    invalidRadioDiv.innerText = element.validationMessage;
                }
            }
        }

        // If all's clear, submit!
        if (pw1.validity.valid && pw2.validity.valid && pw1.innerText === pw2.innerText && form.checkValidity()) {
            form.submit();
        }
    });

    // Cancel Button
    cancelBtn.addEventListener("click", () => {
        window.history.back();
    });
}

if (document.title === "Edit Account") {
    const cancelBtn = document.getElementById("cancelButton");
    const form = document.getElementById("formElem");
    const u_id = document.getElementById("u_id");

    // Submit Button
    form.onsubmit = async (event) => {
        event.preventDefault();

        // Capture Form
        const formData = new FormData(event.target);

        // Turn captured form into JSON
        const value = Object.fromEntries(formData.entries());

        // PUT request to update user info
        axios.put(`/users/${u_id.value}`, {
            data: value
        })
            .then((response) => {
                // handle success
                window.location.href = response.data.responseURL;
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    };

    // Cancel Button
    cancelBtn.addEventListener("click", () => {
        window.history.back();
    });
}

if (document.title === "Delete Account") {
    const cancelBtn = document.getElementById("cancelButton");

    // Confirm Button
    document.getElementById("confirmButton").addEventListener("click", async () => {
        // DELETE request to destroy user info
        axios.delete(`/users/${user.u_id}`, {
            data: user
        })
            .then((response) => {
                // handle success
                window.location.href = response.data.responseURL;
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    });

    // Cancel button
    cancelBtn.addEventListener("click", async () => {
        window.history.back();
    });
}

if (document.title === "View Account") {
    const cancelBtn = document.getElementById("cancelButton");

    // Cancel button
    cancelBtn.addEventListener("click", async () => {
        window.history.back();
    });
}

/*if (document.title === "View All Accounts") {
    document.getElementById("formElem").onsubmit = (event) => {
        event.preventDefault();

        // Capture Form
        const formData = new FormData(event.target);

        // Turn captured form into JSON
        const value = Object.fromEntries(formData.entries());

        // POST request to server, routed by button used
        if (event.)
        axios.delete(`/users/${document.getElementById("u_id").value}`, {
            data: value
        })
            .then((response) => {
                // handle success
                window.location.href = response.request.responseURL;
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    };
}*/

/*
// TODO - Finish this once we have MVP
function validateForm(form) {
    // Verify argument is an object
    if (!isHTMLForm(form)) {
        return Error("Argument must be an HTML Form.")
    }

    // Gather any username and password fields

    let usernames = [];
    while (form.elements.findIndex("username") != -1) {
        usernames.push
    }
    //console.log(form.elements);

    console.log("End of function.");
}

function isHTMLForm(form) {
    // Verify argument is an object
    if (typeof form !== "object") {
        return false;
    }

    // Set up verification that object provided is HTML form
    const formProperties = ["acceptCharset", "action", "autocomplete", "encoding", "enctype",
        "length", "method", "name", "noValidate", "target", "reset", "submit"];

    let argProperties = [];

    // Verify object is HTML form
    for (item in form) {
        argProperties.push(item);
    }

    for (item of formProperties) {
        if (!argProperties.includes(item)) {
            return false;
        }
    }

    return true;
}*/
