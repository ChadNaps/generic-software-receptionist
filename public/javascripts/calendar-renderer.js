const apptsWeek = document.querySelectorAll("li[id^='week-dates-body-appointments-appt']");

const apptsWeekOriginalHeights = []

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
            apptsWeek[x].style.height = (apptsWeekOriginalHeights[x]).toString() + "px";
            apptsWeek[x].style.zIndex = "0";
        }
    });
}