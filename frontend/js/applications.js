let allApplications = [];


// Display applications
function displayApplications(applications) {

    const container =
        document.getElementById("applicationsContainer");

    if (applications.length === 0) {

        container.innerHTML = `
            <div class="dashboard-box">
                <h3>No Matching Applications</h3>
                <p>
                    No applications match your search.
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
}


// Load applications
async function loadApplications() {

    const mobile =
        localStorage.getItem("userMobile");

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
                <p>
                    Unable to load applications.
                </p>
            `;

            return;
        }

        allApplications =
            result.applications || [];

        if (allApplications.length === 0) {

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

        displayApplications(allApplications);

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


// Application search
const applicationSearch =
    document.getElementById("applicationSearch");

const applicationSearchResults =
    document.getElementById("applicationSearchResults");


if (applicationSearch && applicationSearchResults) {

    applicationSearch.addEventListener(
        "input",
        function () {

            const searchText =
                this.value.toLowerCase().trim();

            applicationSearchResults.innerHTML = "";

            if (!searchText) {

                applicationSearchResults.style.display = "none";

                displayApplications(allApplications);

                return;
            }


            const filteredApplications =
                allApplications.filter(application => {

                    const service =
                        (
                            application.service_name || ""
                        ).toLowerCase();

                    const department =
                        (
                            application.department || ""
                        ).toLowerCase();

                    const status =
                        (
                            application.status || ""
                        ).toLowerCase();

                    const id =
                        String(
                            application.id || ""
                        ).toLowerCase();

                    return (
                        service.includes(searchText) ||
                        department.includes(searchText) ||
                        status.includes(searchText) ||
                        id.includes(searchText)
                    );

                });


            // Show search results
            if (filteredApplications.length === 0) {

                applicationSearchResults.innerHTML =
                    `<div class="search-no-result">
                        No matching application found.
                    </div>`;

            } else {

                filteredApplications.forEach(
                    application => {

                        const result =
                            document.createElement("div");

                        result.className =
                            "search-result-item";

                        result.innerHTML = `
                            <strong>
                                ${application.service_name}
                            </strong>
                            <br>
                            <small>
                                MC-${application.id}
                                •
                                ${application.status}
                            </small>
                        `;

                        result.addEventListener(
                            "click",
                            function () {

                                applicationSearch.value =
                                    application.service_name;

                                applicationSearchResults.style.display =
                                    "none";

                                displayApplications(
                                    [application]
                                );

                            }
                        );

                        applicationSearchResults.appendChild(
                            result
                        );

                    }
                );

            }


            applicationSearchResults.style.display =
                "block";


            // Filter application cards
            displayApplications(
                filteredApplications
            );

        }
    );


    // Hide results when clicking outside
    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.closest(
                    ".application-search-box"
                )
            ) {
                applicationSearchResults.style.display =
                    "none";
            }

        }
    );

}


// Start
loadApplications();