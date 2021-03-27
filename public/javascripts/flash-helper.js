/* If the page is navigated to with back or forward, the old flashed message from the initial visit still
   displays, this forces the page to refresh before the user can see the old flashed message, clearing it. */
const perNavTiming = performance.getEntriesByType("navigation")[0];
if (perNavTiming.type === "back_forward") {
    location.reload();
}