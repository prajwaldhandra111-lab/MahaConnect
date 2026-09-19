const adminSearch =
    document.getElementById("adminSearch");

const adminSearchResults =
    document.getElementById("adminSearchResults");


if (adminSearch && adminSearchResults) {

    const adminSearchItems = [

        {
            name: "Dashboard",
            keywords: "dashboard home overview",
            page: "admin.html"
        },

        {
            name: "Users",
            keywords: "users citizens accounts user management",
            page: "admin-users.html"
        },

        {
            name: "Departments",
            keywords: "departments government department",
            page: "admin-departments.html"
        },

        {
            name: "Integrations",
            keywords: "integrations api services connected",
            page: "admin-integrations.html"
        },

        {
            name: "Audit Logs",
            keywords: "audit logs security records actions",
            page: "admin-audit-logs.html"
        },

        {
            name: "System Activity",
            keywords: "system activity monitoring activity",
            page: "admin-system-activity.html"
        },

        {
            name: "Settings",
            keywords: "settings preferences configuration",
            page: "admin-settings.html"
        }

    ];


    adminSearch.addEventListener(
        "input",
        function () {

            const query =
                this.value.toLowerCase().trim();

            adminSearchResults.innerHTML = "";


            if (!query) {

                adminSearchResults.style.display =
                    "none";

                return;
            }


            const matches =
                adminSearchItems.filter(item => {

                    return (
                        item.name
                            .toLowerCase()
                            .includes(query) ||

                        item.keywords
                            .includes(query)
                    );

                });


            if (matches.length === 0) {

                adminSearchResults.innerHTML =
                    `<div class="search-no-result">
                        No matching result found.
                    </div>`;

                adminSearchResults.style.display =
                    "block";

                return;
            }


            matches.forEach(item => {

                const result =
                    document.createElement("div");

                result.className =
                    "search-result-item";

                result.textContent =
                    item.name;


                result.addEventListener(
                    "click",
                    function () {

                        window.location.href =
                            item.page;

                    }
                );


                adminSearchResults.appendChild(result);

            });


            adminSearchResults.style.display =
                "block";

        }
    );


    adminSearch.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Enter") {
                return;
            }

            const query =
                this.value.toLowerCase().trim();

            if (!query) {
                return;
            }


            const result =
                adminSearchItems.find(item => {

                    return (
                        item.name
                            .toLowerCase()
                            .includes(query) ||

                        item.keywords
                            .includes(query)
                    );

                });


            if (result) {

                window.location.href =
                    result.page;

            } else {

                alert("No matching result found.");

            }

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.closest(".search-box")
            ) {

                adminSearchResults.style.display =
                    "none";

            }

        }
    );

}