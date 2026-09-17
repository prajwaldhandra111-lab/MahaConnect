async function loadCitizens() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/officer/citizens"
        );

        const result = await response.json();

        if (!result.success) {
            console.error("Citizens could not be loaded.");
            return;
        }

        // Update statistics
        document.getElementById("totalCitizens").textContent =
            result.stats.total;

        document.getElementById("educationCitizens").textContent =
            result.stats.education;

        document.getElementById("employmentCitizens").textContent =
            result.stats.employment;

        document.getElementById("welfareCitizens").textContent =
            result.stats.welfare;

        // Load citizen table
        const tableBody = document.getElementById("citizensTableBody");

        if (!tableBody) {
            console.error("Citizens table body not found.");
            return;
        }

        tableBody.innerHTML = "";

        result.citizens.forEach((citizen, index) => {

            const row = document.createElement("tr");

            const services =
                citizen.services && citizen.services.length > 0
                    ? citizen.services.join(", ")
                    : "No services";

            row.innerHTML = `
                <td>${index + 1}</td>

                <td>
                    <strong>${citizen.full_name || "Not Available"}</strong>
                </td>

                <td>${citizen.mobile || "-"}</td>

                <td>${citizen.city || "-"}</td>

                <td>${services}</td>

                <td>
                    <span class="status-badge">
                        ${citizen.consent || "Limited"}
                    </span>
                </td>

                <td>
                    <span class="status-badge">
                        ${citizen.status || "Active"}
                    </span>
                </td>
            `;

            tableBody.appendChild(row);
        });

        console.log("Citizens loaded:", result);

    } catch (error) {
        console.error("Citizens API Error:", error);
    }
}

loadCitizens();