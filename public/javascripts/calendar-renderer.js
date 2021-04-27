// Multiple Element Selectors
const apptsWeek = document.querySelectorAll("li[id^='week-dates-body-appointments-appt']");

// Single Element Selectors
const weekViewBtn = document.getElementById("button-view-week");
const monthViewBtn = document.getElementById("button-view-month");
const prevMonthBtn = document.getElementById("month-dates-nav-prev");
const nextMonthBtn = document.getElementById("month-dates-nav-next");
const currentMonthText = document.getElementById("month-dates-nav-current");
const prevWeekBtn = document.getElementById("week-dates-nav-prev");
const nextWeekBtn = document.getElementById("week-dates-nav-next");
const currentWeekText = document.getElementById("week-dates-nav-current");
const monthContainer = document.getElementsByClassName("month-dates-container")[0];
const weekContainer = document.getElementsByClassName("week-dates-container")[0];

// Other Variables
const apptsWeekOriginalHeights = []

// Change size of appointment <li>s in week view
for (let x = 0; x < apptsWeek.length; x++) {
    apptsWeekOriginalHeights[x] = apptsWeek[x].offsetHeight;
    apptsWeek[x].addEventListener("mouseenter", () => {
        if (apptsWeekOriginalHeights[x] < apptsWeek[x].scrollHeight) {
            apptsWeek[x].style.height = (apptsWeek[x].scrollHeight).toString() + "px";
            apptsWeek[x].style.zIndex = "1";
        }
    });

    apptsWeek[x].addEventListener("mouseout", () => {
        if (apptsWeekOriginalHeights[x] < apptsWeek[x].scrollHeight) {
            apptsWeek[x].style.height = "initial";
            apptsWeek[x].style.zIndex = "0";
        }
    });
}

// Change Views
weekViewBtn.addEventListener("click", () => {
    if (weekContainer.classList.contains("is-hidden")) {
        weekContainer.classList.remove("is-hidden");
    }

    if (!monthContainer.classList.contains("is-hidden")) {
        monthContainer.classList.add("is-hidden");
    }
});

monthViewBtn.addEventListener("click", () => {
    if (monthContainer.classList.contains("is-hidden")) {
        monthContainer.classList.remove("is-hidden");
    }

    if (!weekContainer.classList.contains("is-hidden")) {
        weekContainer.classList.add("is-hidden");
    }
});
