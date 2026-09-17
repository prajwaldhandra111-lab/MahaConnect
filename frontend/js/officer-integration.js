async function loadIntegrationStatus() {
    try {
        const response = await fetch("http://127.0.0.1:8000/integration/status");
        const result = await response.json();

        if (!result.success) {
            console.error("Integration status could not be loaded.");
            return;
        }

        // Update statistics
        document.getElementById("connectedApis").textContent =
            `${result.connected_apis}/${result.total_apis}`;

        document.getElementById("activeServices").textContent =
            result.active_services;

        document.getElementById("availability").textContent =
            `${result.availability}%`;

        // Load real API request count
        const requestResponse = await fetch(
            "http://127.0.0.1:8000/audit/request-count"
        );

        const requestResult = await requestResponse.json();

        if (requestResult.success) {
            document.getElementById("apiRequests").textContent =
            requestResult.api_requests;
        }

        // Update Education Department status
        const education = result.departments.find(
            department => department.name === "Education Department"
        );

        if (education) {
            document.getElementById("educationStatus").textContent =
                education.operational ? "● Connected" : "● Unavailable";
        }

        // Update Employment Department status
        const employment = result.departments.find(
            department => department.name === "Employment Department"
        );

        if (employment) {
            document.getElementById("employmentStatus").textContent =
                employment.operational ? "● Connected" : "● Unavailable";
        }

        // Update Welfare Department status
        const welfare = result.departments.find(
            department => department.name === "Welfare Department"
        );

        if (welfare) {
            document.getElementById("welfareStatus").textContent =
            welfare.operational ? "● Connected" : "● Unavailable";
        }

        console.log("Integration Status:", result);

    } catch (error) {
        console.error("Integration Status Error:", error);
    }
}

loadIntegrationStatus();