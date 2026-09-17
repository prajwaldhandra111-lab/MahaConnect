const API_BASE = "http://127.0.0.1:8000";

async function loadSystemActivity() {
    try {

        // ================= ADMIN DASHBOARD =================

        const dashboardResponse = await fetch(
            `${API_BASE}/admin/dashboard`
        );

        const dashboardResult = await dashboardResponse.json();

        if (!dashboardResult.success) {
            console.error("System dashboard could not be loaded.");
            return;
        }

        // Database is connected if dashboard query succeeds
        document.getElementById("databaseStatus").textContent =
            "Connected";

        document.getElementById("mysqlStatus").textContent =
            "Operational";

        // Citizen platform is operational if this admin page is running
        document.getElementById("citizenPlatformStatus").textContent =
            "Operational";

        // Authentication service is available through the backend
        document.getElementById("authenticationStatus").textContent =
            "Operational";


        // ================= API REQUESTS =================

        const requestResponse = await fetch(
            `${API_BASE}/audit/request-count`
        );

        const requestResult = await requestResponse.json();

        if (requestResult.success) {
            document.getElementById("apiRequests").textContent =
                requestResult.api_requests;
        }


        // ================= INTEGRATION HEALTH =================

        const integrationResponse = await fetch(
            `${API_BASE}/integration/status`
        );

        const integrationResult = await integrationResponse.json();

        if (integrationResult.success) {

            document.getElementById("integrationHealth").textContent =
                `${integrationResult.availability}%`;

            // Integration Layer status
            document.getElementById("integrationLayerStatus").textContent =
                integrationResult.availability === 100
                    ? "Operational"
                    : "Degraded";
        }


        // ================= RECENT API ACTIVITY =================

const activityResponse = await fetch(
    `${API_BASE}/audit/logs`
);

const activityResult = await activityResponse.json();

if (activityResult.success) {

    const tableBody =
        document.getElementById("apiActivityTableBody");

    if (tableBody) {

        tableBody.innerHTML = "";

        const logs = activityResult.logs || [];

        const recentLogs = logs.slice(0, 5);

        if (recentLogs.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">
                        No recent activity available
                    </td>
                </tr>
            `;

        } else {

            recentLogs.forEach(log => {

                const row = document.createElement("tr");

                const time = log.created_at
                    ? new Date(log.created_at).toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )
                    : "-";

                const service =
                    log.department
                    ? log.department.replace(" Department", "")
                    : "Platform";

                row.innerHTML = `
                    <td>${time}</td>

                    <td>
                        ${service}
                    </td>

                    <td>
                        ${log.action || "System Activity"}
                    </td>

                    <td>
                        ${log.department || "MahaConnect Platform"}
                    </td>

                    <td>
                        <span class="status-badge success">
                            Recorded
                        </span>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        }
    }
}

// ================= RECENT SYSTEM EVENTS =================

const eventsResponse = await fetch(
    `${API_BASE}/audit/logs`
);

const eventsResult = await eventsResponse.json();

if (eventsResult.success) {

    const eventsList =
        document.getElementById("systemEventsList");

    if (eventsList) {

        eventsList.innerHTML = "";

        const logs = eventsResult.logs || [];
        const recentEvents = logs.slice(0, 4);

        if (recentEvents.length === 0) {

            eventsList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon system-icon">⚙</div>

                    <div class="activity-content">
                        <h3>No recent system events</h3>
                        <p>
                            No activity has been recorded yet.
                        </p>
                        <span>Waiting for activity</span>
                    </div>
                </div>
            `;

        } else {

            recentEvents.forEach(log => {

                const eventItem =
                    document.createElement("div");

                eventItem.className = "activity-item";

                const time = log.created_at
                    ? new Date(log.created_at).toLocaleString()
                    : "Unknown time";

                const department =
                    log.department || "MahaConnect Platform";

                const action =
                    log.action || "System activity recorded";

                eventItem.innerHTML = `
                    <div class="activity-icon success-icon">
                        ✓
                    </div>

                    <div class="activity-content">
                        <h3>${action}</h3>

                        <p>
                            Activity recorded for ${department}.
                        </p>

                        <span>${time}</span>
                    </div>
                `;

                eventsList.appendChild(eventItem);
            });
        }
    }
}


        // ================= SYSTEM STATUS =================

        if (
            dashboardResult.success &&
            integrationResult.success &&
            integrationResult.availability === 100
        ) {
            document.getElementById("systemStatus").textContent =
                "Operational";
        } else {
            document.getElementById("systemStatus").textContent =
                "Degraded";
        }


        console.log("System Activity:", {
            dashboard: dashboardResult,
            requests: requestResult,
            integration: integrationResult
        });

    } catch (error) {

        console.error(
            "System Activity Error:",
            error
        );

        document.getElementById("systemStatus").textContent =
            "Unavailable";

        document.getElementById("databaseStatus").textContent =
            "Unavailable";

        document.getElementById("citizenPlatformStatus").textContent =
            "Unavailable";

        document.getElementById("authenticationStatus").textContent =
            "Unavailable";

        document.getElementById("integrationLayerStatus").textContent =
            "Unavailable";

        document.getElementById("mysqlStatus").textContent =
            "Unavailable";
    }
}


// Load system activity
loadSystemActivity();