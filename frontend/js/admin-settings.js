const API_BASE = "http://127.0.0.1:8000";


// ================= LOAD ADMIN SETTINGS =================

async function loadAdminSettings() {

    try {

        // ================= ACCOUNT =================

const adminMobile =
    localStorage.getItem("userMobile");

if (!adminMobile) {
    console.error("Administrator mobile not found.");
    return;
}

const accountResponse = await fetch(
    `${API_BASE}/admin/account/${adminMobile}`
);

const accountResult =
    await accountResponse.json();

if (accountResult.success) {

    document.getElementById("adminId").value =
        accountResult.account.admin_id;

    document.getElementById("adminDepartment").value =
        accountResult.account.department;

    document.getElementById("adminMobile").value =
        accountResult.account.mobile;

    document.getElementById("adminRole").value =
        accountResult.account.role;

} else {

    console.error(
        "Admin account could not be loaded."
    );
}


        // ================= PLATFORM STATUS =================

const platformResponse = await fetch(
    `${API_BASE}/admin/platform-status`
);

const platformResult =
    await platformResponse.json();


if (platformResult.success) {

    document.getElementById(
        "platformName"
    ).textContent =
        platformResult.platform;

    document.getElementById(
        "platformVersion"
    ).textContent =
        platformResult.version;

    document.getElementById(
        "environmentStatus"
    ).textContent =
        platformResult.environment;

}


// ================= SECURITY STATUS =================

const securityResponse = await fetch(
    `${API_BASE}/admin/security-status`
);

const securityResult =
    await securityResponse.json();

if (securityResult.success) {

    const passwordStatus =
        document.getElementById("passwordProtectionStatus");

    const roleStatus =
        document.getElementById("roleAccessStatus");

    const auditStatus =
        document.getElementById("auditLoggingStatus");


    if (passwordStatus) {
        passwordStatus.textContent = "Active";
    }

    if (roleStatus) {
        roleStatus.textContent = "Enabled";
    }

    if (auditStatus) {
        auditStatus.textContent = "Enabled";
    }

}


        // ================= INTEGRATION STATUS =================

        const integrationResponse = await fetch(
            `${API_BASE}/integration/status`
        );

        const integrationResult =
            await integrationResponse.json();


        if (
            integrationResult.success &&
            integrationResult.availability === 100
        ) {

            document.getElementById(
                "systemStatus"
            ).textContent = "● Operational";

        } else {

            document.getElementById(
                "systemStatus"
            ).textContent = "● Degraded";

        }


        // ================= LOAD DATABASE PREFERENCES =================

        await loadPreferences();


        console.log("Admin Settings loaded successfully.");

    } catch (error) {

        console.error(
            "Admin Settings Error:",
            error
        );

        const systemStatus =
            document.getElementById("systemStatus");

        if (systemStatus) {
            systemStatus.textContent =
                "● Unavailable";
        }

    }

}


// ================= LOAD PREFERENCES =================

async function loadPreferences() {

    try {

        const adminMobile =
            localStorage.getItem("userMobile");


        if (!adminMobile) {
            return;
        }


        const response = await fetch(
            `${API_BASE}/admin/preferences/${adminMobile}`
        );


        const result =
            await response.json();


        if (!result.success) {

            console.error(
                "Admin preferences could not be loaded."
            );

            return;

        }


        const preferences =
            result.preferences;


        document.getElementById(
            "systemUpdates"
        ).checked =
            Boolean(preferences.system_updates);


        document.getElementById(
            "integrationAlerts"
        ).checked =
            Boolean(preferences.integration_alerts);


        document.getElementById(
            "securityAlerts"
        ).checked =
            Boolean(preferences.security_alerts);


    } catch (error) {

        console.error(
            "Preferences Load Error:",
            error
        );

    }

}


// ================= SAVE PREFERENCES =================

async function savePreferences() {

    try {

        const adminMobile =
            localStorage.getItem("userMobile");


        if (!adminMobile) {

            console.error(
                "Administrator mobile not found."
            );

            return;

        }


        const preferences = {

            mobile: adminMobile,

            system_updates:
                document.getElementById(
                    "systemUpdates"
                ).checked,

            integration_alerts:
                document.getElementById(
                    "integrationAlerts"
                ).checked,

            security_alerts:
                document.getElementById(
                    "securityAlerts"
                ).checked

        };


        const response = await fetch(
            `${API_BASE}/admin/preferences`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(
                    preferences
                )
            }
        );


        const result =
            await response.json();


        if (!result.success) {

            console.error(
                "Preferences could not be saved."
            );

            return;

        }


        console.log(
            "Admin preferences saved:",
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

loadAdminSettings();