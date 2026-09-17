/* ================================
   Load Dashboard Profile
================================ */

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


        /* Dashboard Name */

        if (dashboardName) {

            dashboardName.textContent =
                profile.full_name || "User";

        }


        /* Navbar Name */

        if (navbarName) {

            navbarName.textContent =
                profile.full_name || "User";

        }


        /* Dashboard City */

        if (dashboardCity) {

            dashboardCity.textContent =
                profile.city || "City";

        }


        /* Calculate Profile Completion */

        updateProfileCompletion(profile);


        /* Keep frontend cache updated */

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


/* ================================
   Profile Completion
================================ */

function updateProfileCompletion(profile) {

    const requiredFields = [

        profile.full_name,
        profile.dob,
        profile.gender,
        profile.email,
        profile.city,
        profile.address,
        profile.school_college,
        profile.board,
        profile.current_class,
        profile.academic_year

    ];


    let completedFields = 0;


    requiredFields.forEach(field => {

        if (
            field !== null &&
            field !== undefined &&
            String(field).trim() !== ""
        ) {

            completedFields++;

        }

    });


    /* Identity verification */

    if (
        profile.identity_verified === 1 ||
        profile.identity_verified === true
    ) {

        completedFields++;

    }


    const totalFields = 11;

    const percentage = Math.round(
        (completedFields / totalFields) * 100
    );


    /* Update percentage */

    const completionElement =
        document.getElementById(
            "profileCompletion"
        );

    if (completionElement) {

        completionElement.textContent =
            percentage + "%";

    }


    /* Update progress bar */

    const progressBar =
        document.querySelector(
            ".profile-summary .progress-bar"
        );

    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

    }

}


/* ================================
   Education Page
================================ */

function openEducation() {

    window.location.href =
        "education.html";

}


/* ================================
   Employment Page
================================ */

function openEmployment() {

    window.location.href =
        "employment.html";

}


/* ================================
   Welfare Page
================================ */

function openWelfare() {

    window.location.href =
        "welfare.html";

}


/* ================================
   Consent Page
================================ */

function openConsent() {

    window.location.href =
        "consent.html";

}


/* ================================
   Applications Page
================================ */

function openApplications() {

    window.location.href =
        "applications.html";

}


/* ================================
   Load Profile
================================ */

loadProfile();