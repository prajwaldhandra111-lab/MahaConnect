async function loadApplications() {

    const mobile = localStorage.getItem("userMobile");

    if (!mobile) {
        window.location.href = "index.html";
        return;
    }

    const container =
        document.getElementById("applicationsContainer");

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/applications/${mobile}`
        );

        const result = await response.json();

        if (!result.success) {
            container.innerHTML = `
                <p>Unable to load applications.</p>
            `;
            return;
        }

        const applications = result.applications;

        if (applications.length === 0) {

            container.innerHTML = `
                <div class="dashboard-box">
                    <h3>No Applications Yet</h3>
                    <p>
                        You have not submitted any government
                        service applications yet.
                    </p>
                </div>
            `;

            return;
        }

        container.innerHTML = "";

        applications.forEach(application => {

            const card = document.createElement("div");

            card.className = "modern-card";

            card.innerHTML = `
                <div class="card-icon">
                    📄
                </div>

                <h3>
                    ${application.service_name}
                </h3>

                <p>
                    Application ID: MC-${application.id}
                </p>

                <p>
                    Department: ${application.department}
                </p>

                <span class="status-pending">
                    ${application.status}
                </span>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Applications API Error:",
            error
        );

        container.innerHTML = `
            <div class="dashboard-box">
                <h3>Connection Error</h3>
                <p>
                    Unable to connect to MahaConnect server.
                </p>
            </div>
        `;
    }
}


loadApplications();