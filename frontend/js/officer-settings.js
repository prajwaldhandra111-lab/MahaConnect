const API_BASE = "http://127.0.0.1:8000";


// ================= LOAD OFFICER ACCOUNT =================

async function loadOfficerAccount() {

    try {

        const officerMobile =
            localStorage.getItem("userMobile");

        if (!officerMobile) {
            console.error("Officer mobile not found.");
            return;
        }

        const response = await fetch(
            `${API_BASE}/officer/account/${officerMobile}`
        );

        const result = await response.json();

        if (!result.success) {
            console.error(
                "Officer account could not be loaded."
            );
            return;
        }

        const account = result.account;

        // Account fields

        document.getElementById("officerId").value =
            account.officer_id;

        document.getElementById("officerDepartment").value =
            account.department;

        document.getElementById("officerMobile").value =
            account.mobile;

        document.getElementById("officerRole").value =
            account.role;

        // Profile information

        document.getElementById("officerName").textContent =
            account.name;

        document.getElementById("officerProfileId").textContent =
            `Officer ID: ${account.officer_id}`;

        document.getElementById("officerProfileRole").textContent =
            account.role;

        // Avatar first letter

        document.getElementById("officerAvatar").textContent =
            account.name.charAt(0).toUpperCase();

    } catch (error) {

        console.error(
            "Officer Account Error:",
            error
        );

    }

}

// ================= LOAD PREFERENCES =================

async function loadPreferences() {

    try {

        const officerMobile =
            localStorage.getItem("userMobile");

        if (!officerMobile) {
            return;
        }

        const response = await fetch(
            `${API_BASE}/officer/preferences/${officerMobile}`
        );

        const result = await response.json();

        if (!result.success) {
            console.error(
                "Officer preferences could not be loaded."
            );
            return;
        }

        const preferences = result.preferences;

        document.getElementById(
            "applicationNotifications"
        ).checked =
            Boolean(preferences.application_notifications);

        document.getElementById(
            "integrationAlerts"
        ).checked =
            Boolean(preferences.integration_alerts);

        document.getElementById(
            "systemUpdates"
        ).checked =
            Boolean(preferences.system_updates);

    } catch (error) {

        console.error(
            "Preferences Load Error:",
            error
        );

    }

}

// ================= LOAD SECURITY STATUS =================

async function loadSecurityStatus() {

    try {

        const response = await fetch(
            `${API_BASE}/officer/security-status`
        );

        const result = await response.json();

        if (!result.success) {
            console.error(
                "Officer security status could not be loaded."
            );
            return;
        }

        document.getElementById(
            "passwordProtectionStatus"
        ).textContent =
            result.password_protection;

        document.getElementById(
            "roleAccessStatus"
        ).textContent =
            result.role_based_access;

        document.getElementById(
            "auditLoggingStatus"
        ).textContent =
            result.audit_logging;

    } catch (error) {

        console.error(
            "Security Status Error:",
            error
        );

    }

}

// ================= LOAD SYSTEM INFORMATION =================

async function loadSystemInformation() {

    try {

        const response = await fetch(
            `${API_BASE}/officer/system-status`
        );

        const result = await response.json();

        if (!result.success) {
            console.error(
                "System information could not be loaded."
            );
            return;
        }

        const platformElement =
            document.getElementById("platformName");

        const versionElement =
            document.getElementById("platformVersion");

        const environmentElement =
            document.getElementById("environmentStatus");

        const systemStatusElement =
            document.getElementById("systemStatus");


        if (platformElement) {
            platformElement.textContent =
                result.platform;
        }

        if (versionElement) {
            versionElement.textContent =
                result.version;
        }

        if (environmentElement) {
            environmentElement.textContent =
                result.environment;
        }

        if (systemStatusElement) {
            systemStatusElement.textContent =
                result.database === "Connected"
                    ? "● Operational"
                    : "● Degraded";
        }

    } catch (error) {

        console.error(
            "System Information Error:",
            error
        );

    }

}


// ================= SAVE PREFERENCES =================

async function savePreferences() {

    try {

        const officerMobile =
            localStorage.getItem("userMobile");

        if (!officerMobile) {
            return;
        }

        const preferences = {

            mobile: officerMobile,

            application_notifications:
                document.getElementById(
                    "applicationNotifications"
                ).checked,

            integration_alerts:
                document.getElementById(
                    "integrationAlerts"
                ).checked,

            system_updates:
                document.getElementById(
                    "systemUpdates"
                ).checked

        };

        const response = await fetch(
            `${API_BASE}/officer/preferences`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(preferences)
            }
        );

        const result = await response.json();

        if (!result.success) {
            console.error(
                "Officer preferences could not be saved."
            );
            return;
        }

        console.log(
            "Officer preferences saved:",
            preferences
        );

    } catch (error) {

        console.error(
            "Preferences Save Error:",
            error
        );

    }

}


// ================= START =================

loadOfficerAccount();
loadPreferences();
loadSecurityStatus();
loadSystemInformation();
