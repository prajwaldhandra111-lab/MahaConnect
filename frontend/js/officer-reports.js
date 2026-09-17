async function loadReports() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/officer/reports"
        );

        const result = await response.json();

        if (!result.success) {
            console.error("Reports could not be loaded.");
            return;
        }

        // Overall application statistics
        document.getElementById("totalApplications").textContent =
            result.overall.total ?? 0;

        document.getElementById("approvedApplications").textContent =
            result.overall.approved ?? 0;

        document.getElementById("pendingApplications").textContent =
            result.overall.pending ?? 0;

        document.getElementById("rejectedApplications").textContent =
            result.overall.rejected ?? 0;

        // Department-wise application statistics
        result.departments.forEach(department => {

            const total = Number(department.total) || 0;
            const approved = Number(department.approved) || 0;
            const pending = Number(department.pending) || 0;
            const rejected = Number(department.rejected) || 0;

            const successRate =
                total > 0
                    ? Math.round((approved / total) * 100)
                    : 0;

            if (department.department === "Education Department") {

                document.getElementById("educationTotal").textContent = total;
                document.getElementById("educationApproved").textContent = approved;
                document.getElementById("educationPending").textContent = pending;
                document.getElementById("educationRejected").textContent = rejected;
                document.getElementById("educationSuccessRate").textContent =
                    `${successRate}%`;
            }

            if (department.department === "Employment Department") {

                document.getElementById("employmentTotal").textContent = total;
                document.getElementById("employmentApproved").textContent = approved;
                document.getElementById("employmentPending").textContent = pending;
                document.getElementById("employmentRejected").textContent = rejected;
                document.getElementById("employmentSuccessRate").textContent =
                    `${successRate}%`;
            }

            if (department.department === "Welfare Department") {

                document.getElementById("welfareTotal").textContent = total;
                document.getElementById("welfareApproved").textContent = approved;
                document.getElementById("welfarePending").textContent = pending;
                document.getElementById("welfareRejected").textContent = rejected;
                document.getElementById("welfareSuccessRate").textContent =
                    `${successRate}%`;
            }
        });

        // Service activity
        const educationActivity = result.departments.find(
            department => department.department === "Education Department"
        );

        const employmentActivity = result.departments.find(
            department => department.department === "Employment Department"
        );

        const welfareActivity = result.departments.find(
            department => department.department === "Welfare Department"
        );

        document.getElementById("educationServiceActivity").textContent =
            `${educationActivity ? educationActivity.total : 0} applications`;

        document.getElementById("employmentServiceActivity").textContent =
            `${employmentActivity ? employmentActivity.total : 0} applications`;

        document.getElementById("welfareServiceActivity").textContent =
            `${welfareActivity ? welfareActivity.total : 0} applications`;


        // Integration performance
        const integrationResponse = await fetch(
            "http://127.0.0.1:8000/integration/status"
        );

        const integrationResult = await integrationResponse.json();

        if (integrationResult.success) {

            integrationResult.departments.forEach(department => {

                const status = department.operational
                    ? "Connected"
                    : "Unavailable";

                const availability = department.operational
                    ? "100%"
                    : "0%";

                if (department.name === "Education Department") {
                    document.getElementById("educationApiStatus").textContent =
                        status;

                    document.getElementById("educationApiAvailability").textContent =
                        availability;
                }

                if (department.name === "Employment Department") {
                    document.getElementById("employmentApiStatus").textContent =
                        status;

                    document.getElementById("employmentApiAvailability").textContent =
                        availability;
                }

                if (department.name === "Welfare Department") {
                    document.getElementById("welfareApiStatus").textContent =
                        status;

                    document.getElementById("welfareApiAvailability").textContent =
                        availability;
                }
            });
        }    

        console.log("Reports:", result);

    } catch (error) {
        console.error("Reports Error:", error);
    }
}

loadReports();