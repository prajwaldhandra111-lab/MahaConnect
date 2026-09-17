const API_BASE = "http://127.0.0.1:8000";

let applicationNotifications = true;
let governmentAlerts = true;


async function loadPreferences() {

    try {

        const mobile = localStorage.getItem("userMobile");

        if (!mobile) {
            return;
        }

        const response = await fetch(
            `${API_BASE}/settings/preferences/${mobile}`
        );

        const result = await response.json();

        if (!result.success) {
            console.error("Citizen preferences could not be loaded.");
            return;
        }

        applicationNotifications =
            result.preferences.application_notifications;

        governmentAlerts =
            result.preferences.government_alerts;

        updateButtons();

    } catch (error) {

        console.error("Preferences Load Error:", error);

    }

}


async function savePreferences() {

    try {

        const mobile = localStorage.getItem("userMobile");

        if (!mobile) {
            return;
        }

        const preferences = {

            mobile: mobile,

            application_notifications:
                applicationNotifications,

            government_alerts:
                governmentAlerts

        };

        const response = await fetch(
            `${API_BASE}/settings/preferences`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(preferences)
            }
        );

        const result = await response.json();

        if (!result.success) {

            console.error(
                "Citizen preferences could not be saved."
            );

            return;

        }

        updateButtons();

    } catch (error) {

        console.error("Preferences Save Error:", error);

    }

}


function toggleApplicationNotifications() {

    applicationNotifications =
        !applicationNotifications;

    savePreferences();

}


function toggleGovernmentAlerts() {

    governmentAlerts =
        !governmentAlerts;

    savePreferences();

}


function updateButtons() {

    const applicationButton =
        document.getElementById(
            "applicationNotificationsBtn"
        );

    const governmentButton =
        document.getElementById(
            "governmentAlertsBtn"
        );


    if (applicationButton) {

        applicationButton.textContent =
            applicationNotifications
                ? "Enabled"
                : "Disabled";

    }


    if (governmentButton) {

        governmentButton.textContent =
            governmentAlerts
                ? "Enabled"
                : "Disabled";

    }

}


loadPreferences();