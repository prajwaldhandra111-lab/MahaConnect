let allAdminUsers = [];

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

        displayAdminUsers(result.users);


        console.log("Admin Users:", result);

        allAdminUsers = result.users;

        setupUserSearch();

    } catch (error) {

        console.error("Admin Users Error:", error);

    }
}

function displayAdminUsers(users) {

    const tableBody =
        document.getElementById("usersTableBody");

    tableBody.innerHTML = "";

    users.forEach(user => {

        const row =
            document.createElement("tr");

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
}


loadAdminUsers();

function setupUserSearch() {

    const userSearch =
        document.getElementById("userSearch");

    const userSearchResults =
        document.getElementById("userSearchResults");

    if (!userSearch || !userSearchResults) {
        return;
    }

    userSearch.addEventListener("input", function () {

        const searchText =
            this.value.toLowerCase().trim();

        userSearchResults.innerHTML = "";

        if (!searchText) {
            userSearchResults.style.display = "none";
            displayAdminUsers(allAdminUsers);
            return;
        }

        const filteredUsers =
            allAdminUsers.filter(user => {

                const id =
                    String(user.id || "").toLowerCase();

                const mobile =
                    String(user.mobile || "").toLowerCase();

                const role =
                    String(user.role || "").toLowerCase();

                const status =
                    String(user.status || "").toLowerCase();

                return (
                    id.includes(searchText) ||
                    mobile.includes(searchText) ||
                    role.includes(searchText) ||
                    status.includes(searchText)
                );
            });

        if (filteredUsers.length === 0) {

            userSearchResults.innerHTML =
                `<div class="user-search-no-result">
                    No matching user found.
                </div>`;

        } else {

            filteredUsers.forEach(user => {

                const result =
                    document.createElement("div");

                result.className =
                    "user-search-result";

                result.innerHTML = `
                    <strong>
                        ${user.mobile}
                    </strong>
                    <br>
                    <small>
                        ${user.role} • ${user.status}
                    </small>
                `;

                result.addEventListener(
                    "click",
                    function () {

                        userSearch.value =
                            user.mobile;

                        userSearchResults.style.display =
                            "none";

                        displayAdminUsers([user]);
                    }
                );

                userSearchResults.appendChild(result);

            });
        }

        userSearchResults.style.display = "block";

        displayAdminUsers(filteredUsers);

    });


    document.addEventListener("click", function (event) {

        if (!event.target.closest(".user-search-box")) {

            userSearchResults.style.display =
                "none";

        }

    });
}