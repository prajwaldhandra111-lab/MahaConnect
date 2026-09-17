async function loadAdminDepartments() {
    try {

        const response = await fetch(
            "http://127.0.0.1:8000/admin/departments"
        );

        const result = await response.json();

        if (!result.success) {
            console.error("Departments could not be loaded.");
            return;
        }


        // ================= STATISTICS =================

        document.getElementById("totalDepartments").textContent =
            result.stats.total_departments;

        document.getElementById("activeDepartments").textContent =
            result.stats.active_departments;

        document.getElementById("connectedApis").textContent =
            result.stats.connected_apis;

        document.getElementById("systemAvailability").textContent =
            `${result.stats.availability}%`;


        // ================= DEPARTMENT STATUS =================

        result.departments.forEach(department => {

            const status = department.status === "Operational"
                ? "● Operational"
                : "● Unavailable";


            if (department.name === "Education Department") {

                document.getElementById(
                    "educationDepartmentStatus"
                ).textContent = status;

            }


            if (department.name === "Employment Department") {

                document.getElementById(
                    "employmentDepartmentStatus"
                ).textContent = status;

            }


            if (department.name === "Welfare Department") {

                document.getElementById(
                    "welfareDepartmentStatus"
                ).textContent = status;

            }

        });


        console.log("Admin Departments:", result);

    } catch (error) {

        console.error("Admin Departments Error:", error);

    }
}


loadAdminDepartments();