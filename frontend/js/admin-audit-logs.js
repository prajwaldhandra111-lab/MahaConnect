let allAuditLogs = [];

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

        allAuditLogs = logs;


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

        displayAuditLogs(logs);

        console.log("Admin Audit Logs:", result);

    } catch (error) {

        console.error(
            "Admin Audit Logs Error:",
            error
        );

    }
}

function displayAuditLogs(logs) {

    const tableBody =
        document.getElementById("auditLogsTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    if (logs.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No matching audit activity found
                </td>
            </tr>
        `;

        return;
    }

    logs.forEach(log => {

        const row =
            document.createElement("tr");

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
}

const auditSearch =
    document.getElementById("auditSearch");

const auditSearchResults =
    document.getElementById("auditSearchResults");

if (auditSearch && auditSearchResults) {

    auditSearch.addEventListener("input", function () {

        const searchText =
            this.value.toLowerCase().trim();

        auditSearchResults.innerHTML = "";

        if (!searchText) {

            auditSearchResults.style.display =
                "none";

            displayAuditLogs(allAuditLogs);

            return;
        }

        const filteredLogs =
            allAuditLogs.filter(log => {

                const id =
                    String(log.id || "").toLowerCase();

                const user =
                    String(log.user_id || "").toLowerCase();

                const action =
                    String(log.action || "").toLowerCase();

                const department =
                    String(log.department || "").toLowerCase();

                const time =
                    String(log.created_at || "").toLowerCase();

                return (
                    id.includes(searchText) ||
                    user.includes(searchText) ||
                    action.includes(searchText) ||
                    department.includes(searchText) ||
                    time.includes(searchText)
                );
            });


        if (filteredLogs.length === 0) {

            auditSearchResults.innerHTML =
                `<div class="audit-search-no-result">
                    No matching audit activity found.
                </div>`;

        } else {

            filteredLogs.forEach(log => {

                const result =
                    document.createElement("div");

                result.className =
                    "audit-search-result";

                result.innerHTML = `
                    <strong>
                        ${log.action || "System Activity"}
                    </strong>
                    <br>
                    <small>
                        User ${log.user_id || "-"}
                        •
                        ${log.department || "MahaConnect Platform"}
                    </small>
                `;

                result.addEventListener(
                    "click",
                    function () {

                        auditSearch.value =
                            log.action || "";

                        auditSearchResults.style.display =
                            "none";

                        displayAuditLogs([log]);
                    }
                );

                auditSearchResults.appendChild(result);

            });

        }

        auditSearchResults.style.display =
            "block";

        displayAuditLogs(filteredLogs);

    });


    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.closest(
                    ".audit-search-box"
                )
            ) {

                auditSearchResults.style.display =
                    "none";

            }

        }
    );
}

// Load Audit Logs
loadAdminAuditLogs();