async function loadAdminDashboard() {
    try {

        // ================= ADMIN DASHBOARD =================

        const response = await fetch(
            "http://127.0.0.1:8000/admin/dashboard"
        );

        const result = await response.json();

        if (!result.success) {
            console.error("Admin dashboard data could not be loaded.");
            return;
        }

        document.getElementById("totalUsers").textContent =
            result.total_users;

        document.getElementById("totalDepartments").textContent =
            result.departments;

        document.getElementById("activeApis").textContent =
            result.active_apis;


        // ================= INTEGRATION MONITORING =================

        const integrationResponse = await fetch(
            "http://127.0.0.1:8000/integration/status"
        );

        const integrationResult = await integrationResponse.json();

        if (integrationResult.success) {

            integrationResult.departments.forEach(department => {

                const status = department.operational
                    ? "● Operational"
                    : "● Unavailable";

                if (department.name === "Education Department") {
                    document.getElementById("educationApiStatus").textContent =
                        status;
                }

                if (department.name === "Employment Department") {
                    document.getElementById("employmentApiStatus").textContent =
                        status;
                }

                if (department.name === "Welfare Department") {
                    document.getElementById("welfareApiStatus").textContent =
                        status;
                }

            });
        }


        // ================= RECENT SYSTEM ACTIVITY =================

        const auditResponse = await fetch(
            "http://127.0.0.1:8000/audit/logs"
        );

        const auditResult = await auditResponse.json();

        if (auditResult.success) {

            const activityContainer =
                document.getElementById("recentSystemActivity");

            activityContainer.innerHTML = "";

            const logs = auditResult.logs.slice(0, 4);

            if (logs.length === 0) {

                activityContainer.innerHTML = `
                    <div class="application-row">
                        <div class="application-info">
                            <strong>No recent activity</strong>
                            <span>No audit records available</span>
                        </div>
                    </div>
                `;

            } else {

                logs.forEach(log => {

                    const row = document.createElement("div");

                    row.className = "application-row";

                    row.innerHTML = `
                        <div class="application-info">
                            <strong>${log.action || "System Activity"}</strong>
                            <span>${log.department || "MahaConnect Platform"}</span>
                        </div>

                        <span class="status-approved">
                            Recorded
                        </span>
                    `;

                    activityContainer.appendChild(row);

                });
            }
        }


        // ================= PLATFORM OVERVIEW =================

        const platformResponse = await fetch(
            "http://127.0.0.1:8000/admin/platform-status"
        );

        const platformResult = await platformResponse.json();

        if (platformResult.success) {

            platformResult.services.forEach(service => {

                const statusElement = {
                    "API Gateway": "apiGatewayStatus",
                    "Consent Engine": "consentEngineStatus",
                    "Eligibility Engine": "eligibilityEngineStatus",
                    "Notification Service": "notificationServiceStatus"
                };

                const elementId = statusElement[service.name];

                if (elementId) {

                    document.getElementById(elementId).textContent =
                        service.status;

                }

            });
        }

        // ================= AUDIT & SECURITY =================

const securityResponse = await fetch(
    "http://127.0.0.1:8000/admin/security-status"
);

const securityResult = await securityResponse.json();

if (securityResult.success) {

    securityResult.security.forEach(item => {

        if (item.name === "Audit Logging") {
            document.getElementById("auditLoggingStatus").textContent =
                item.status;
        }

        if (item.name === "Role Based Access") {
            document.getElementById("roleAccessStatus").textContent =
                item.status;
        }

        if (item.name === "Data Consent") {
            document.getElementById("dataConsentStatus").textContent =
                item.status;
        }

    });
}


        console.log("Admin Dashboard:", result);

    } catch (error) {

        console.error("Admin Dashboard Error:", error);

    }
}


// Load Admin Dashboard
loadAdminDashboard();