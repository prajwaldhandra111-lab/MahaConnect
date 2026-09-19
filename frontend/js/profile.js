const mobileInput = document.getElementById("mobile");
const profileForm = document.getElementById("profileForm");
const completedSection = document.getElementById("profileCompletedSection");

const savedMobile = localStorage.getItem("userMobile");

let currentProfile = null;

/* ================================
   Set Logged-in Mobile Number
================================ */

if (savedMobile) {
    mobileInput.value = savedMobile;
}


/* ================================
   Load Profile From Database
================================ */

async function loadProfile() {

    if (!savedMobile) {
        return;
    }

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/profile/${savedMobile}`
        );

        const result = await response.json();

        if (result.success && result.profile) {

            currentProfile = result.profile;

            fillProfileForm(result.profile);

            const profileComplete =
                isProfileComplete(result.profile);

            if (profileComplete) {

                profileForm.style.display = "none";
                completedSection.style.display = "none";

                updateCompletion(100);

                // Show the new Master Profile view
                if (typeof displayMasterProfile === "function") {
                    displayMasterProfile(result.profile);
                }

            } else {

                profileForm.style.display = "block";
                completedSection.style.display = "none";

                updateCompletion(
                    calculateCompletion(result.profile)
                );
            }

        } else {

            profileForm.style.display = "block";
            completedSection.style.display = "none";

            updateCompletion(0);
        }

    } catch (error) {

        console.error(
            "Profile Load Error:",
            error
        );

        profileForm.style.display = "block";
        completedSection.style.display = "none";
    }
}


/* ================================
   Fill Profile Form
================================ */

function fillProfileForm(profile) {

    document.getElementById("fullName").value =
        profile.full_name || "";

    document.getElementById("dob").value =
        profile.dob || "";

    document.getElementById("gender").value =
        profile.gender || "";

    document.getElementById("email").value =
        profile.email || "";

    document.getElementById("city").value =
        profile.city || "";

    document.getElementById("address").value =
        profile.address || "";

    document.getElementById("institution").value =
        profile.school_college || "";

    document.getElementById("board").value =
        profile.board || "";

    document.getElementById("class").value =
        profile.current_class || "";

    document.getElementById("academicYear").value =
        profile.academic_year || "";

    document.getElementById("skills").value =
        profile.skills || "";

    document.getElementById("interests").value =
        profile.interests || "";

    /* Identity Verification */

    if (profile.identity_verified) {

        const statusElement =
            document.getElementById(
                "verificationStatus"
            );

        statusElement.textContent =
            "✓ Verified";

        statusElement.style.color =
            "#0F766E";

    } else {

        const statusElement =
            document.getElementById(
                "verificationStatus"
            );

        statusElement.textContent =
            "Not Verified";

        statusElement.style.color =
            "";
    }
}


/* ================================
   Check Profile Completion
================================ */

function isProfileComplete(profile) {

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

    const allFieldsFilled =
        requiredFields.every(
            field =>
                field !== null &&
                field !== undefined &&
                String(field).trim() !== ""
        );

    return (
        allFieldsFilled &&
        profile.identity_verified === 1 ||
        allFieldsFilled &&
        profile.identity_verified === true
    );
}


/* ================================
   Calculate Completion
================================ */

function calculateCompletion(profile) {

    const fields = [
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

    let completed = 0;

    fields.forEach(field => {

        if (
            field !== null &&
            field !== undefined &&
            String(field).trim() !== ""
        ) {
            completed++;
        }
    });

    if (
        profile.identity_verified === 1 ||
        profile.identity_verified === true
    ) {
        completed++;
    }

    return Math.round(
        (completed / 11) * 100
    );
}


/* ================================
   Update Completion UI
================================ */

function updateCompletion(percent) {

    const completionText =
        document.querySelector(
            ".completion-text strong"
        );

    const progressBar =
        document.querySelector(
            ".progress-bar"
        );

    if (completionText) {
        completionText.textContent =
            percent + "%";
    }

    if (progressBar) {
        progressBar.style.width =
            percent + "%";
    }
}


/* ================================
   Save Master Profile
================================ */

profileForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const identityVerified =
            localStorage.getItem(
                "identityVerificationStatus"
            ) === "verified";

        const identitySource =
            localStorage.getItem(
                "identitySource"
            ) || null;


        /* Identity verification is compulsory */

        if (!identityVerified) {

            alert(
                "Please verify your identity before saving your Master Profile."
            );

            return;
        }


        const profile = {

            mobile:
                document.getElementById(
                    "mobile"
                ).value,

            full_name:
                document.getElementById(
                    "fullName"
                ).value.trim(),

            dob:
                document.getElementById(
                    "dob"
                ).value,

            gender:
                document.getElementById(
                    "gender"
                ).value,

            email:
                document.getElementById(
                    "email"
                ).value.trim(),

            city:
                document.getElementById(
                    "city"
                ).value.trim(),

            address:
                document.getElementById(
                    "address"
                ).value.trim(),

            school_college:
                document.getElementById(
                    "institution"
                ).value.trim(),

            board:
                document.getElementById(
                    "board"
                ).value,

            current_class:
                document.getElementById(
                    "class"
                ).value.trim(),

            academic_year:
                document.getElementById(
                    "academicYear"
                ).value.trim(),

            skills:
                document.getElementById(
                    "skills"
                ).value.trim(),

            interests:
                document.getElementById(
                    "interests"
                ).value.trim(),

            identity_verified:
                true,

            identity_source:
                identitySource
        };


        try {

            const response = await fetch(
                "http://127.0.0.1:8000/profile/save",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(profile)
                }
            );

            const result =
                await response.json();


            if (result.success) {

                currentProfile =
                    profile;

                /*
                 * DB is now the source of truth.
                 * localStorage is only kept as
                 * a small frontend cache.
                 */

                localStorage.setItem(
                    "mahaConnectProfile",
                    JSON.stringify(profile)
                );

                localStorage.setItem(
                    "profileCompleted",
                    "true"
                );


                profileForm.style.display =
                    "none";

                completedSection.style.display =
                    "block";

                updateCompletion(100);

                completedSection.scrollIntoView({
                    behavior: "smooth"
                });

            } else {

                alert(
                    result.message ||
                    "Failed to save profile."
                );
            }

        } catch (error) {

            console.error(
                "Profile API Error:",
                error
            );

            alert(
                "Unable to connect to server. Please make sure FastAPI is running."
            );
        }
    }
);


/* ================================
   Continue To Dashboard
================================ */

function continueToDashboard() {

    window.location.href =
        "dashboard.html";
}


/* ================================
   Edit Profile
================================ */

function editProfile() {

    completedSection.style.display =
        "none";

    profileForm.style.display =
        "block";

    profileForm.scrollIntoView({
        behavior: "smooth"
    });
}


/* ================================
   Profile Preview
================================ */

async function viewProfilePreview() {

    let profile = currentProfile;

    /*
     * If current profile is unavailable,
     * fetch latest profile from database.
     */

    if (!profile && savedMobile) {

        try {

            const response = await fetch(
                `http://127.0.0.1:8000/profile/${savedMobile}`
            );

            const result =
                await response.json();

            if (
                result.success &&
                result.profile
            ) {
                profile =
                    result.profile;
            }

        } catch (error) {

            console.error(
                "Preview Error:",
                error
            );
        }
    }


    if (!profile) {

        alert(
            "Profile information is not available."
        );

        return;
    }


    alert(
        "Master Profile Preview\n\n" +

        "Name: " +
        (profile.full_name ||
            "Not available") +

        "\nDOB: " +
        (profile.dob ||
            "Not available") +

        "\nGender: " +
        (profile.gender ||
            "Not available") +

        "\nMobile: " +
        (profile.mobile ||
            savedMobile ||
            "Not available") +

        "\nEmail: " +
        (profile.email ||
            "Not available") +

        "\nCity: " +
        (profile.city ||
            "Not available") +

        "\nIdentity: " +
        (
            profile.identity_verified
                ? "Verified"
                : "Not Verified"
        )
    );
}


/* ================================
   Load Profile On Page Open
================================ */

loadProfile();


function backToCompletedProfile() {

    profileForm.style.display = "none";

    completedSection.style.display = "block";

    completedSection.scrollIntoView({
        behavior: "smooth"
    });
}

function showMasterTab(tabName, clickedTab) {

    const tabs = [
        "overview",
        "personal",
        "education",
        "verification",
        "documents",
        "consent"
    ];

    tabs.forEach(function(tab) {

        const section = document.getElementById(
            "masterTab" +
            tab.charAt(0).toUpperCase() +
            tab.slice(1)
        );

        if (section) {
            section.style.display = "none";
        }
    });

    const selectedSection = document.getElementById(
        "masterTab" +
        tabName.charAt(0).toUpperCase() +
        tabName.slice(1)
    );

    if (selectedSection) {
        selectedSection.style.display = "block";
    }

    document
        .querySelectorAll(".master-profile-tab")
        .forEach(function(tab) {
            tab.classList.remove("active");
        });

    if (clickedTab) {
        clickedTab.classList.add("active");
    }
}


function displayMasterProfile(profile) {

    if (!profile) return;

    // Profile header
    const name = profile.full_name || "Citizen";
    const mobile = profile.mobile || savedMobile || "-";
    const city = profile.city || "-";

    const displayName = document.getElementById("profileDisplayName");
    const profileMobile = document.getElementById("profileMobile");
    const profileCity = document.getElementById("profileCity");
    const profileInitial = document.getElementById("profileInitial");

    if (displayName) {
        displayName.textContent = name;
    }

    if (profileMobile) {
        profileMobile.textContent = mobile;
    }

    if (profileCity) {
        profileCity.textContent = city;
    }

    if (profileInitial) {
        profileInitial.textContent = name.charAt(0).toUpperCase();
    }


    // Overview - Personal Information
    setText("overviewFullName", profile.full_name);
    setText("overviewDob", profile.dob);
    setText("overviewGender", profile.gender);
    setText("overviewMobile", mobile);
    setText("overviewEmail", profile.email);
    setText("overviewCity", profile.city);
    setText("overviewAddress", profile.address);


    // Overview - Education
    setText("overviewInstitution", profile.school_college);
    setText("overviewBoard", profile.board);
    setText("overviewClass", profile.current_class);
    setText("overviewAcademicYear", profile.academic_year);


    // Overview - Skills & Interests
    setText("overviewSkills", profile.skills);
    setText("overviewInterests", profile.interests);


    // Personal Tab
    setText("personalFullName", profile.full_name);
    setText("personalDob", profile.dob);
    setText("personalGender", profile.gender);
    setText("personalMobile", mobile);
    setText("personalEmail", profile.email);
    setText("personalCity", profile.city);
    setText("personalAddress", profile.address);


    // Education Tab
    setText("educationInstitution", profile.school_college);
    setText("educationBoard", profile.board);
    setText("educationClass", profile.current_class);
    setText("educationAcademicYear", profile.academic_year);


    // Verification
    const verified =
        profile.identity_verified === 1 ||
        profile.identity_verified === true;

    setText(
        "verificationStatus",
        verified ? "✓ Verified" : "Not Verified"
    );

    setText(
        "identityVerificationText",
        verified ? "Verified" : "Not Verified"
    );

    setText(
        "identitySourceText",
        profile.identity_source || "DigiLocker"
    );

    setText(
        "verifiedDocumentText",
        localStorage.getItem("verifiedDocument") || "Aadhaar"
    );

    setText(
        "verificationSourceDetail",
        profile.identity_source || "DigiLocker"
    );

    setText(
        "verificationDocumentDetail",
        localStorage.getItem("verifiedDocument") || "Aadhaar"
    );


    // Documents

const verifiedDocument =
    localStorage.getItem("verifiedDocument");

const documentName =
    verifiedDocument || "No document";

const documentNameElement =
    document.getElementById("verifiedDocumentName");

const documentDescriptionElement =
    document.getElementById("verifiedDocumentDescription");

const documentStatusElement =
    document.getElementById("verifiedDocumentStatus");

if (documentNameElement) {
    documentNameElement.textContent = documentName;
}

if (documentDescriptionElement) {
    documentDescriptionElement.textContent =
        verified
            ? "Identity verification document"
            : "No verified document";
}

if (documentStatusElement) {
    documentStatusElement.textContent =
        verified
            ? "Verified"
            : "Not Verified";

    documentStatusElement.classList.toggle(
        "optional",
        !verified
    );
}

// Consent & Data Sharing

loadConsentStatus(profile.mobile || savedMobile);

    // Completion
    const completionPercent = calculateCompletion(profile);

    setText(
        "masterProfileCompletion",
     completionPercent + "%"
    );
} 

async function loadConsentStatus(mobile) {
    if (!mobile) return;

    try {
        const response = await fetch(
            `http://127.0.0.1:8000/consent/${mobile}`
        );

        const result = await response.json();

        console.log("CONSENT DATA:", result);

        if (!result.success || !result.consent) return;

        const consent = result.consent;

        updateConsentStatus(
            "educationConsentStatus",
            consent.education
        );

        updateConsentStatus(
            "employmentConsentStatus",
            consent.employment
        );

        updateConsentStatus(
            "welfareConsentStatus",
            consent.welfare
        );

    } catch (error) {
        console.error("Consent Load Error:", error);
    }
}

function updateConsentStatus(elementId, enabled) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    const isEnabled =
        enabled === 1 ||
        enabled === true;

    element.textContent =
        isEnabled
            ? "Enabled"
            : "Disabled";

    element.classList.toggle(
        "consent-enabled",
        isEnabled
    );
}

// Small helper for safely updating text
function setText(elementId, value) {

    const element = document.getElementById(elementId);

    if (element) {
        element.textContent =
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
                ? value
                : "-";
    }
}
