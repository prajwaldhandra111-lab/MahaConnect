async function loadOfficerApplications() {

    const content = document.getElementById("applicationsContent");

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/applications/7977115747"
        );

        const result = await response.json();

        if (!result.success) {
            content.innerHTML = "<p>Unable to load applications.</p>";
            return;
        }

        const applications = result.applications;

        // Statistics
        const total = applications.length;

        const pending = applications.filter(
            app => app.status === "Pending"
        ).length;

        const approved = applications.filter(
            app => app.status === "Approved"
        ).length;

        document.getElementById("totalApplications").textContent = total;
        document.getElementById("pendingApplications").textContent = pending;
        document.getElementById("approvedApplications").textContent = approved;


        // No applications
        if (applications.length === 0) {

            content.innerHTML = `
                <p>No applications received yet.</p>
            `;

            return;
        }


        // Application cards
        content.innerHTML = applications.map(app => `

            <div class="modern-card">

                <div class="card-icon">
                    📄
                </div>

                <h3>
                    ${app.service_name}
                </h3>

                <p>
                    <strong>Application ID:</strong>
                    MC-${app.id}
                </p>

                <p>
                    <strong>Department:</strong>
                    ${app.department}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${app.status}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${new Date(app.application_date).toLocaleString()}
                </p>

                <button
                    onclick="updateApplicationStatus(${app.id})"
                >
                    Update Status →
                </button>

            </div>

        `).join("");

    }

    catch (error) {

        console.error(
            "Officer Applications Error:",
            error
        );

        content.innerHTML = `
            <p>
                Unable to connect to MahaConnect backend.
            </p>
        `;
    }
}


// Temporary status update function
async function updateApplicationStatus(applicationId) {

    const newStatus = prompt(
        "Enter new status: Pending / Approved / Rejected"
    );

    if (!newStatus) {
        return;
    }

    const status = newStatus.trim();

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
        alert("Invalid status. Please enter Pending, Approved or Rejected.");
        return;
    }

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/applications/update-status/${applicationId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: status
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            alert("Application status updated successfully!");

            // Reload applications
            loadOfficerApplications();

        } else {

            alert(result.message || "Unable to update status.");

        }

    } catch (error) {

        console.error("Status Update Error:", error);

        alert(
            "Unable to connect to MahaConnect backend."
        );
    }
}

async function loadAuditLogs() {

    const content = document.getElementById("auditLogsContent");

    if (!content) {
        return;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/audit/logs"
        );

        const result = await response.json();

        if (!result.success) {
            content.innerHTML = "<p>Unable to load audit logs.</p>";
            return;
        }

        const logs = result.logs;

        if (logs.length === 0) {
            content.innerHTML = "<p>No audit logs available.</p>";
            return;
        }

        content.innerHTML = logs.map(log => `
            <div class="modern-card">
                <div class="card-icon">🔐</div>
                <h3>${log.action}</h3>
                <p><strong>User ID:</strong> ${log.user_id}</p>
                <p><strong>Department:</strong> ${log.department}</p>
                <p><strong>Date:</strong> ${new Date(log.created_at).toLocaleString()}</p>
            </div>
        `).join("");

    } catch (error) {

        console.error("Audit Logs Error:", error);

        content.innerHTML = `
            <div class="modern-card">
                <h3>⚠️ Unable to Load Audit Logs</h3>
                <p>Please make sure MahaConnect backend is running.</p>
            </div>
        `;
    }
}

// Load applications
loadOfficerApplications();
loadAuditLogs();