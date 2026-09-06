// Load Dashboard Profile

async function loadProfile() {

    const mobile = localStorage.getItem("userMobile");

    if (!mobile) {
        window.location.href = "index.html";
        return;
    }

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/profile/${mobile}`
        );

        const result = await response.json();

        if (!result.success) {

            console.error(result.message);
            return;

        }

        const profile = result.profile;

        const dashboardName =
            document.getElementById("dashboardName");

        const navbarName =
            document.getElementById("navbarName");

        const dashboardCity =
            document.getElementById("dashboardCity");


        if (dashboardName) {
            dashboardName.textContent =
                profile.full_name;
        }


        if (navbarName) {
            navbarName.textContent =
                profile.full_name;
        }


        if (dashboardCity) {
            dashboardCity.textContent =
                profile.city;
        }


        localStorage.setItem(
            "mahaConnectProfile",
            JSON.stringify(profile)
        );

    } catch (error) {

        console.error(
            "Profile API Error:",
            error
        );

    }
}


// Education Page

function openEducation() {

    window.location.href =
        "education.html";

}


// Employment Page

function openEmployment() {

    window.location.href =
        "employment.html";

}


// Welfare Page

function openWelfare() {

    window.location.href =
        "welfare.html";

}


// Consent Page

function openConsent() {

    window.location.href =
        "consent.html";

}


// Applications Page

function openApplications() {

    window.location.href =
        "applications.html";

}


// Load Profile

loadProfile();