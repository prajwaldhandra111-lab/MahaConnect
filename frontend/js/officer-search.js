const officerSearch = document.getElementById("officerSearch");
const officerSearchResults =
    document.getElementById("officerSearchResults");

if (officerSearch && officerSearchResults) {

    const officerSearchItems = [
        {
            name: "Applications",
            keywords: "application applications pending status",
            page: "officer-applications.html"
        },
        {
            name: "Citizens",
            keywords: "citizen citizens users",
            page: "officer-citizens.html"
        },
        {
            name: "Department Integration",
            keywords: "integration api services connected",
            page: "officer-integration.html"
        },
        {
            name: "Reports",
            keywords: "reports analytics statistics",
            page: "officer-reports.html"
        },
        {
            name: "Settings",
            keywords: "settings preferences account",
            page: "officer-settings.html"
        }
    ];

    officerSearch.addEventListener("input", function () {

        const query = officerSearch.value
            .trim()
            .toLowerCase();

        officerSearchResults.innerHTML = "";

        if (!query) {
            officerSearchResults.style.display = "none";
            return;
        }

        const matches = officerSearchItems.filter(function (item) {
            return (
                item.name.toLowerCase().includes(query) ||
                item.keywords.includes(query)
            );
        });

        if (matches.length === 0) {
            officerSearchResults.innerHTML =
                '<div class="search-no-result">No matching result found.</div>';

            officerSearchResults.style.display = "block";
            return;
        }

        matches.forEach(function (item) {

            const result = document.createElement("div");

            result.className = "search-result-item";
            result.textContent = item.name;

            result.addEventListener("click", function () {
                window.location.href = item.page;
            });

            officerSearchResults.appendChild(result);
        });

        officerSearchResults.style.display = "block";
    });

}
