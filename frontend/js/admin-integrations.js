async function loadAdminIntegrations() {
    try {

        // ================= INTEGRATION STATUS =================

        const response = await fetch(
            "http://127.0.0.1:8000/integration/status"
        );

        const result = await response.json();

        if (!result.success) {
            console.error("Integration status could not be loaded.");
            return;
        }


        // ================= INTEGRATION STATISTICS =================

        document.getElementById("totalIntegrations").textContent =
            result.total_apis;

        document.getElementById("activeApis").textContent =
            result.connected_apis;

        document.getElementById("integrationAvailability").textContent =
            `${result.availability}%`;


        // ================= GOVERNMENT API STATUS =================

        result.departments.forEach(department => {

            const status = department.operational
                ? "● Operational"
                : "● Unavailable";


            if (department.name === "Education Department") {

                document.getElementById(
                    "educationApiStatus"
                ).textContent = status;

            }


            if (department.name === "Employment Department") {

                document.getElementById(
                    "employmentApiStatus"
                ).textContent = status;

            }


            if (department.name === "Welfare Department") {

                document.getElementById(
                    "welfareApiStatus"
                ).textContent = status;

            }

        });


        console.log("Admin Integrations:", result);

    } catch (error) {

        console.error(
            "Admin Integrations Error:",
            error
        );

    }
}


// Load Admin Integrations
loadAdminIntegrations();