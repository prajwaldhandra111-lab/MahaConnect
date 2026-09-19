const globalSearch = document.getElementById("globalSearch");
const searchResults = document.getElementById("searchResults");

if (globalSearch && searchResults) {

    const searchItems = [
        {
            name: "Dashboard",
            keywords: "dashboard home",
            page: "dashboard.html"
        },
        {
            name: "Master Profile",
            keywords: "profile personal information",
            page: "profile.html"
        },
        {
            name: "Education",
            keywords: "education study college school scholarship",
            page: "education.html"
        },
        {
            name: "Employment",
            keywords: "employment job jobs career work",
            page: "employment.html"
        },
        {
            name: "Welfare",
            keywords: "welfare schemes benefits financial support",
            page: "welfare.html"
        },
        {
            name: "My Applications",
            keywords: "applications application status",
            page: "applications.html"
        },
        {
            name: "Consent & Data Sharing",
            keywords: "consent data sharing permission",
            page: "consent.html"
        },
        {
            name: "Notifications",
            keywords: "notifications alerts updates",
            page: "notifications.html"
        },
        {
            name: "Settings",
            keywords: "settings preferences account",
            page: "settings.html"
        }
    ];

    globalSearch.addEventListener("input", function () {

        const query = globalSearch.value
            .trim()
            .toLowerCase();

        searchResults.innerHTML = "";

        if (!query) {
            searchResults.style.display = "none";
            return;
        }

        const matches = searchItems.filter(function (item) {

            return (
                item.name.toLowerCase().includes(query) ||
                item.keywords.includes(query)
            );

        });

        if (matches.length === 0) {

            searchResults.innerHTML =
                '<div class="search-no-result">No matching service found.</div>';

            searchResults.style.display = "block";
            return;
        }

        matches.forEach(function (item) {

            const result = document.createElement("div");

            result.className = "search-result-item";
            result.textContent = item.name;

            result.addEventListener("click", function () {
                window.location.href = item.page;
            });

            searchResults.appendChild(result);

        });

        searchResults.style.display = "block";
    });


    globalSearch.addEventListener("keydown", function (event) {

        if (event.key !== "Enter") {
            return;
        }

        const query = globalSearch.value
            .trim()
            .toLowerCase();

        if (!query) {
            return;
        }

        const result = searchItems.find(function (item) {

            return (
                item.name.toLowerCase().includes(query) ||
                item.keywords.includes(query)
            );

        });

        if (result) {
            window.location.href = result.page;
        } else {
            alert("No matching service found.");
        }

    });


    document.addEventListener("click", function (event) {

        if (!event.target.closest(".search-box")) {
            searchResults.style.display = "none";
        }

    });

}