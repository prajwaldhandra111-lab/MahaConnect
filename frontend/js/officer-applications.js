const API_BASE = "http://127.0.0.1:8000";

let allApplications = [];


// Load applications
async function loadApplications() {

    try {

        const response = await fetch(
            `${API_BASE}/applications/7977115747`
        );

        if (!response.ok) {
            throw new Error("Failed to load applications");
        }

        const data = await response.json();

        allApplications = Array.isArray(data) ? data : data.applications || [];

        console.log("APPLICATION DATA:", allApplications);

        updateStatistics();
        displayApplications(allApplications);

    } catch (error) {

        console.error(error);

        document.getElementById("applicationsContent").innerHTML =
            `<p>Unable to load applications.</p>`;
    }
}


// Update statistics
function updateStatistics() {

    const total = allApplications.length;

    const pending = allApplications.filter(
        app => app.status?.toLowerCase() === "pending"
    ).length;

    const approved = allApplications.filter(
        app => app.status?.toLowerCase() === "approved"
    ).length;

    document.getElementById("totalApplications").textContent = total;
    document.getElementById("pendingApplications").textContent = pending;
    document.getElementById("approvedApplications").textContent = approved;
}


// Display applications
function displayApplications(applications) {

    const container = document.getElementById("applicationsContent");

    if (!applications.length) {

        container.innerHTML =
            `<p>No applications found.</p>`;

        return;
    }


    container.innerHTML = applications.map(app => {

        const status = app.status || "Pending";

        return `
            <div class="modern-card" style="margin-bottom: 15px;">

                <h3>
                    📄 Application #${app.id}
                </h3>

                <p>
                    <strong>Service:</strong>
                    ${app.service || app.department || "Government Service"}
                </p>

                <p>
                    <strong>Citizen:</strong>
                    ${app.mobile || app.user_mobile || "Citizen"}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${status}
                </p>

                ${
                    status.toLowerCase() === "pending"
                    ? `
                        <div style="margin-top: 15px;">

                            <button
                                class="home-primary-btn"
                                onclick="updateApplicationStatus(${app.id}, 'Approved')"
                            >
                                ✅ Approve
                            </button>

                            <button
                                class="home-secondary-btn"
                                onclick="updateApplicationStatus(${app.id}, 'Rejected')"
                            >
                                ❌ Reject
                            </button>

                        </div>
                    `
                    : ""
                }

            </div>
        `;

    }).join("");
}


// Update application status
async function updateApplicationStatus(applicationId, status) {
    const officerMobile = localStorage.getItem("userMobile");

    console.log("=== STATUS UPDATE ===");
    console.log("Application ID:", applicationId);
    console.log("Status:", status);
    console.log("Officer Mobile:", officerMobile);

    try {
        const response = await fetch(
            `${API_BASE}/applications/update-status/${applicationId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: String(status),
                    officer_mobile: String(officerMobile)
                })
            }
        );

        console.log("HTTP Status:", response.status);

        const text = await response.text();

        console.log("Server Response:", text);

        if (!response.ok) {
            throw new Error(text);
        }

        const data = JSON.parse(text);

        alert(`Application ${status.toLowerCase()} successfully.`);

        loadApplications();

    } catch (error) {
        console.error("STATUS UPDATE ERROR:", error);
        alert("Unable to update status.");
    }
}


// Search applications
const applicationSearch = document.getElementById("applicationSearch");

if (applicationSearch) {

    applicationSearch.addEventListener("input", function () {

        const searchText = this.value.toLowerCase();

        const filtered = allApplications.filter(app => {

            return JSON.stringify(app)
                .toLowerCase()
                .includes(searchText);

        });

        displayApplications(filtered);

    });

}


// Start
loadApplications();