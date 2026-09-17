async function loadAdminAuditLogs() {
    try {

        // ================= AUDIT LOGS =================

        const response = await fetch(
            "http://127.0.0.1:8000/audit/logs"
        );

        const result = await response.json();

        if (!result.success) {
            console.error("Audit logs could not be loaded.");
            return;
        }

        const logs = result.logs || [];


        // ================= STATISTICS =================

        const totalActivities = logs.length;

        const citizenActions = logs.filter(
            log => log.user_id === 1
        ).length;

        const officerActions = logs.filter(
            log => log.department &&
                log.department !== "Administration" &&
                log.user_id !== 1 &&
                log.user_id !== 3
        ).length;

        const dataAccessEvents = logs.filter(
            log =>
                (log.action || "").toLowerCase().includes("access") ||
                (log.action || "").toLowerCase().includes("view") ||
                (log.action || "").toLowerCase().includes("record")
        ).length;


        document.getElementById("totalActivities").textContent =
            totalActivities;

        document.getElementById("citizenActions").textContent =
            citizenActions;

        document.getElementById("officerActions").textContent =
            officerActions;

        document.getElementById("dataAccessEvents").textContent =
            dataAccessEvents;


        // ================= AUDIT TABLE =================

        const tableBody =
            document.getElementById("auditLogsTableBody");

        if (!tableBody) {
            console.error("Audit logs table body not found.");
            return;
        }

        tableBody.innerHTML = "";


        if (logs.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        No audit activity available
                    </td>
                </tr>
            `;

            return;
        }


        logs.forEach(log => {

            const row = document.createElement("tr");

            const date = log.created_at
                ? new Date(log.created_at).toLocaleString()
                : "-";

            row.innerHTML = `
                <td>#${String(log.id).padStart(3, "0")}</td>

                <td>
                    ${log.user_id || "-"}
                </td>

                <td>
                    ${log.action || "System Activity"}
                </td>

                <td>
                    ${log.department || "MahaConnect Platform"}
                </td>

                <td>
                    ${date}
                </td>

                <td>
                    <span class="audit-success">
                        Success
                    </span>
                </td>
            `;

            tableBody.appendChild(row);

        });


        console.log("Admin Audit Logs:", result);

    } catch (error) {

        console.error(
            "Admin Audit Logs Error:",
            error
        );

    }
}


// Load Audit Logs
loadAdminAuditLogs();