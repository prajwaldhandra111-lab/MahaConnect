async function loadAdminUsers() {
    try {

        const response = await fetch(
            "http://127.0.0.1:8000/admin/users"
        );

        const result = await response.json();

        if (!result.success) {
            console.error("Users could not be loaded.");
            return;
        }


        // ================= STATISTICS =================

        document.getElementById("totalUsers").textContent =
            result.stats.total;

        document.getElementById("totalCitizens").textContent =
            result.stats.citizens;

        document.getElementById("totalOfficers").textContent =
            result.stats.officers;

        document.getElementById("totalAdmins").textContent =
            result.stats.admins;


        // ================= USERS TABLE =================

        const tableBody =
            document.getElementById("usersTableBody");

        tableBody.innerHTML = "";


        result.users.forEach(user => {

            const row = document.createElement("tr");

            let roleName = "Citizen";
            let roleClass = "citizen";

            if (user.role === "officer") {
                roleName = "Officer";
                roleClass = "officer";
            }

            if (user.role === "admin") {
                roleName = "Administrator";
                roleClass = "admin";
            }


            row.innerHTML = `
                <td>${user.id}</td>

                <td>
                    ${user.mobile}
                </td>

                <td>
                    <span class="role-badge ${roleClass}">
                        ${roleName}
                    </span>
                </td>

                <td>
                    <span class="status-badge">
                        ${user.status}
                    </span>
                </td>
            `;

            tableBody.appendChild(row);

        });


        console.log("Admin Users:", result);

    } catch (error) {

        console.error("Admin Users Error:", error);

    }
}


loadAdminUsers();