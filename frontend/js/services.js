if (document.getElementById("educationConsent")) {
    loadConsent();
}

// Scholarship

// Scholarship Services
function applyScholarship() {

    const section = document.getElementById("scholarshipSection");
    const content = document.getElementById("scholarshipContent");

    section.style.display = "block";

    content.innerHTML = `
        <div class="modern-services">

            <div class="modern-card">
                <div class="card-icon">🎓</div>

                <h3>Student Scholarship</h3>

                <p>
                    Financial assistance opportunities
                    for eligible students.
                </p>

                <span class="status-pending">
                    Eligibility Check Required
                </span>
            </div>

            <div class="modern-card">
                <div class="card-icon">📚</div>

                <h3>Merit Scholarship</h3>

                <p>
                    Scholarship opportunity based on
                    academic performance.
                </p>

                <span class="status-pending">
                    Eligibility Check Required
                </span>
            </div>

            <div class="modern-card">
                <div class="card-icon">💰</div>

                <h3>Education Financial Support</h3>

                <p>
                    Explore available education
                    financial support services.
                </p>

                <span class="status-pending">
                    Eligibility Check Required
                </span>
            </div>

        </div>
    `;

    section.scrollIntoView({
        behavior: "smooth"
    });
}


// Education Records

async function viewEducationRecords() {

    const mobile = localStorage.getItem("userMobile");

    if (!mobile) {
        alert("User session not found. Please login again.");
        window.location.href = "index.html";
        return;
    }

    const section = document.getElementById("educationRecordsSection");
    const content = document.getElementById("educationRecordsContent");

    section.style.display = "block";
    content.innerHTML = "<p>Loading your education records...</p>";

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/integration/education?mobile=${mobile}`,
            {
                method: "POST"
            }
        );

        const result = await response.json();

        if (!result.success) {

            content.innerHTML =
                "<p>Unable to retrieve education records.</p>";

            return;
        }

        const student = result.department_response.student;

        content.innerHTML = `
            <div class="modern-card">

                <div class="card-icon">
                    🎓
                </div>

                <h3>Academic Information</h3>

                <p>
                    <strong>Institution:</strong>
                    ${student.institution}
                </p>

                <p>
                    <strong>Program:</strong>
                    ${student.program}
                </p>

                <p>
                    <strong>Year:</strong>
                    ${student.year}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${student.status}
                </p>

                <p>
                    🛡️ Education data retrieved through MahaConnect
                </p>

            </div>
        `;

        section.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        console.error("Education Records Error:", error);

        content.innerHTML =
            "<p>Unable to connect to Education Department.</p>";
    }
}

// Student Services

function viewStudentServices() {

    const section = document.getElementById("studentServicesSection");
    const content = document.getElementById("studentServicesContent");

    section.style.display = "block";

    content.innerHTML = `
        <div class="modern-services">

            <div class="modern-card">
                <div class="card-icon">🪪</div>
                <h3>Student Certificate Services</h3>
                <p>
                    Access student-related certificate
                    and document services.
                </p>
                <span class="status-pending">
                    Service Available
                </span>
            </div>

            <div class="modern-card">
                <div class="card-icon">📖</div>
                <h3>Academic Services</h3>
                <p>
                    Access academic information and
                    student support services.
                </p>
                <span class="status-pending">
                    Service Available
                </span>
            </div>

            <div class="modern-card">
                <div class="card-icon">🎯</div>
                <h3>Student Opportunities</h3>
                <p>
                    Explore available student
                    opportunities and programs.
                </p>
                <span class="status-pending">
                    Service Available
                </span>
            </div>

        </div>
    `;

    section.scrollIntoView({
        behavior: "smooth"
    });
}


// Back to Dashboard

function goBack() {
    window.location.href = "dashboard.html";
}


// Job Search


function searchJobs() {

    const existingSection = document.getElementById("jobSearchSection");

    if (existingSection) {
        existingSection.style.display = "block";
        existingSection.scrollIntoView({ behavior: "smooth" });
        return;
    }

    const section = document.createElement("section");
    section.id = "jobSearchSection";
    section.className = "dashboard-box";

    section.innerHTML = `
        <h3>💼 Job Opportunities</h3>

        <div class="modern-services">

            <div class="modern-card">
                <div class="card-icon">💻</div>
                <h3>Software & IT Jobs</h3>
                <p>
                    Explore software, technology and
                    IT-related employment opportunities.
                </p>
                <span class="status-pending">
                    Eligibility Check Required
                </span>
            </div>

            <div class="modern-card">
                <div class="card-icon">🏢</div>
                <h3>Government Jobs</h3>
                <p>
                    Explore government employment
                    opportunities and recruitment services.
                </p>
                <span class="status-pending">
                    Eligibility Check Required
                </span>
            </div>

            <div class="modern-card">
                <div class="card-icon">🔎</div>
                <h3>Local Job Opportunities</h3>
                <p>
                    Discover employment opportunities
                    based on skills and location.
                </p>
                <span class="status-pending">
                    Eligibility Check Required
                </span>
            </div>

        </div>
    `;

    document
        .querySelector(".dashboard-content")
        .appendChild(section);

    section.scrollIntoView({ behavior: "smooth" });
}


// Skill Programs

function skillPrograms() {

    const existingSection = document.getElementById("skillProgramsSection");

    if (existingSection) {
        existingSection.style.display = "block";
        existingSection.scrollIntoView({ behavior: "smooth" });
        return;
    }

    const section = document.createElement("section");
    section.id = "skillProgramsSection";
    section.className = "dashboard-box";

    section.innerHTML = `
        <h3>🛠️ Skill Development Programs</h3>

        <div class="modern-services">

            <div class="modern-card">
                <div class="card-icon">💻</div>
                <h3>Technology Skills</h3>
                <p>
                    Explore programming, IT and other
                    technology skill development programs.
                </p>
                <span class="status-pending">
                    Service Available
                </span>
            </div>

            <div class="modern-card">
                <div class="card-icon">📜</div>
                <h3>Certification Programs</h3>
                <p>
                    Explore skill-based training and
                    certification opportunities.
                </p>
                <span class="status-pending">
                    Service Available
                </span>
            </div>

            <div class="modern-card">
                <div class="card-icon">🚀</div>
                <h3>Career Skill Training</h3>
                <p>
                    Find training programs designed to
                    improve employment-ready skills.
                </p>
                <span class="status-pending">
                    Service Available
                </span>
            </div>

        </div>
    `;

    document
        .querySelector(".dashboard-content")
        .appendChild(section);

    section.scrollIntoView({ behavior: "smooth" });
}


// Career Services

function careerServices() {

    const existingSection = document.getElementById("careerServicesSection");

    if (existingSection) {
        existingSection.style.display = "block";
        existingSection.scrollIntoView({ behavior: "smooth" });
        return;
    }

    const section = document.createElement("section");
    section.id = "careerServicesSection";
    section.className = "dashboard-box";

    section.innerHTML = `
        <h3>🎯 Career Services</h3>

        <div class="modern-services">

            <div class="modern-card">
                <div class="card-icon">🧭</div>
                <h3>Career Guidance</h3>
                <p>
                    Explore career guidance and employment
                    planning services.
                </p>
                <span class="status-pending">
                    Service Available
                </span>
            </div>

            <div class="modern-card">
                <div class="card-icon">📄</div>
                <h3>Resume & Interview Support</h3>
                <p>
                    Get support for resume preparation and
                    interview readiness.
                </p>
                <span class="status-pending">
                    Service Available
                </span>
            </div>

            <div class="modern-card">
                <div class="card-icon">🎓</div>
                <h3>Career Opportunities</h3>
                <p>
                    Explore career opportunities based on
                    your education and skills.
                </p>
                <span class="status-pending">
                    Service Available
                </span>
            </div>

        </div>
    `;

    document
        .querySelector(".dashboard-content")
        .appendChild(section);

    section.scrollIntoView({ behavior: "smooth" });
}

// Student Welfare Schemes

async function studentSchemes() {

    const mobile = localStorage.getItem("userMobile");

    if (!mobile) {
        alert("User session not found. Please login again.");
        window.location.href = "index.html";
        return;
    }

    const existingSection = document.getElementById("studentSchemesSection");

    if (existingSection) {
        existingSection.style.display = "block";
        existingSection.scrollIntoView({ behavior: "smooth" });
        return;
    }

    const section = document.createElement("section");
    section.id = "studentSchemesSection";
    section.className = "dashboard-box";

    section.innerHTML = `
        <h3>🎓 Student Welfare Schemes</h3>
        <p>Loading available schemes...</p>
    `;

    document
        .querySelector(".dashboard-content")
        .appendChild(section);

    section.scrollIntoView({ behavior: "smooth" });

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/integration/welfare?mobile=${mobile}`,
            {
                method: "POST"
            }
        );

        const result = await response.json();

        if (!result.success) {
            section.innerHTML = `
                <h3>🎓 Student Welfare Schemes</h3>
                <p>Unable to retrieve welfare schemes.</p>
            `;
            return;
        }

        const schemes =
            result.department_response.schemes;

        section.innerHTML = `
            <h3>🎓 Student Welfare Schemes</h3>

            <p>
                Schemes retrieved through
                <strong>MahaConnect Integration Layer</strong>
            </p>

            <div class="modern-services">

                ${schemes.map(scheme => `
                    <div class="modern-card">

                        <div class="card-icon">🎓</div>

                        <h3>${scheme.name}</h3>

                        <p>
                            Category:
                            <strong>${scheme.category}</strong>
                        </p>

                        <span class="status-pending">
                            ${scheme.status}
                        </span>

                    </div>
                `).join("")}

            </div>
        `;

    } catch (error) {

        console.error("Welfare Integration Error:", error);

        section.innerHTML = `
            <h3>🎓 Student Welfare Schemes</h3>

            <p>
                Unable to connect to Welfare Department.
                Please try again later.
            </p>
        `;
    }
}


// Financial Support

async function financialSupport() {

    const mobile = localStorage.getItem("userMobile");

    if (!mobile) {
        alert("User session not found. Please login again.");
        window.location.href = "index.html";
        return;
    }

    const existingSection = document.getElementById("financialSupportSection");

    if (existingSection) {
        existingSection.style.display = "block";
        existingSection.scrollIntoView({ behavior: "smooth" });
        return;
    }

    const section = document.createElement("section");
    section.id = "financialSupportSection";
    section.className = "dashboard-box";

    section.innerHTML = `
        <h3>💰 Financial Assistance</h3>
        <p>Loading financial assistance programs...</p>
    `;

    document
        .querySelector(".dashboard-content")
        .appendChild(section);

    section.scrollIntoView({ behavior: "smooth" });

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/integration/financial-support?mobile=${mobile}`,
            {
                method: "POST"
            }
        );

        const result = await response.json();

        if (!result.success) {
            section.innerHTML = `
                <h3>💰 Financial Assistance</h3>
                <p>Unable to retrieve financial assistance programs.</p>
            `;
            return;
        }

        const programs =
            result.department_response.programs;

        section.innerHTML = `
            <h3>💰 Financial Assistance</h3>

            <p>
                Programs retrieved through
                <strong>MahaConnect Integration Layer</strong>
            </p>

            <div class="modern-services">

                ${programs.map(program => `
                    <div class="modern-card">

                        <div class="card-icon">💰</div>

                        <h3>${program.name}</h3>

                        <p>
                            Category:
                            <strong>${program.category}</strong>
                        </p>

                        <span class="status-pending">
                            ${program.status}
                        </span>

                    </div>
                `).join("")}

            </div>
        `;

    } catch (error) {

        console.error("Financial Support Integration Error:", error);

        section.innerHTML = `
            <h3>💰 Financial Assistance</h3>

            <p>
                Unable to connect to Welfare Department.
                Please try again later.
            </p>
        `;
    }
}

// Welfare Benefits

async function welfareBenefits() {

    const mobile = localStorage.getItem("userMobile");

    if (!mobile) {
        alert("User session not found. Please login again.");
        window.location.href = "index.html";
        return;
    }

    const existingSection = document.getElementById("welfareBenefitsSection");

    if (existingSection) {
        existingSection.style.display = "block";
        existingSection.scrollIntoView({ behavior: "smooth" });
        return;
    }

    const section = document.createElement("section");
    section.id = "welfareBenefitsSection";
    section.className = "dashboard-box";

    section.innerHTML = `
        <h3>🏠 Available Welfare Benefits</h3>
        <p>Loading welfare benefits...</p>
    `;

    document
        .querySelector(".dashboard-content")
        .appendChild(section);

    section.scrollIntoView({ behavior: "smooth" });

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/integration/benefits?mobile=${mobile}`,
            {
                method: "POST"
            }
        );

        const result = await response.json();

        if (!result.success) {
            section.innerHTML = `
                <h3>🏠 Available Welfare Benefits</h3>
                <p>Unable to retrieve welfare benefits.</p>
            `;
            return;
        }

        const benefits =
            result.department_response.benefits;

        section.innerHTML = `
            <h3>🏠 Available Welfare Benefits</h3>

            <p>
                Benefits retrieved through
                <strong>MahaConnect Integration Layer</strong>
            </p>

            <div class="modern-services">

                ${benefits.map(benefit => `
                    <div class="modern-card">

                        <div class="card-icon">🏠</div>

                        <h3>${benefit.name}</h3>

                        <p>
                            Category:
                            <strong>${benefit.category}</strong>
                        </p>

                        <span class="status-pending">
                            ${benefit.status}
                        </span>

                    </div>
                `).join("")}

            </div>
        `;

    } catch (error) {

        console.error("Welfare Benefits Integration Error:", error);

        section.innerHTML = `
            <h3>🏠 Available Welfare Benefits</h3>

            <p>
                Unable to connect to Welfare Department.
                Please try again later.
            </p>
        `;
    }
}


// Load Saved Consent
async function loadConsent() {

    const mobile = localStorage.getItem("userMobile");

    if (!mobile) {
        return;
    }

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/consent/${mobile}`
        );

        const result = await response.json();

        if (result.success) {

            const consent = result.consent;

            document.getElementById("educationConsent").checked =
                consent.education;

            document.getElementById("employmentConsent").checked =
                consent.employment;

            document.getElementById("welfareConsent").checked =
                consent.welfare;
        }

    } catch (error) {

        console.error("Consent Load Error:", error);

    }
}


// Save Consent

async function saveConsent() {

    const mobile = localStorage.getItem("userMobile");

    if (!mobile) {
        alert("User session not found. Please login again.");
        window.location.href = "index.html";
        return;
    }

    const consent = {
        mobile: mobile,
        education: document.getElementById("educationConsent").checked,
        employment: document.getElementById("employmentConsent").checked,
        welfare: document.getElementById("welfareConsent").checked
    };

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/consent/save",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(consent)
            }
        );

        const result = await response.json();

        if (result.success) {

            localStorage.setItem(
                "mahaConnectConsent",
                JSON.stringify(consent)
            );

            alert("Consent saved successfully!");

        } else {

            alert(result.message || "Failed to save consent.");

        }

    } catch (error) {

        console.error("Consent API Error:", error);

        alert(
            "Unable to connect to server. Please make sure FastAPI is running."
        );
    }
}


// Employment Eligibility

async function loadEmploymentEligibility() {

    const mobile = localStorage.getItem("userMobile");

    if (!mobile) {
        window.location.href = "index.html";
        return;
    }

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/eligibility/employment/${mobile}`
        );

        const result = await response.json();

        if (!result.success) {

            document.getElementById("eligibilityMessage").textContent =
                "Unable to check employment eligibility.";

            return;
        }

        const employment = result.employment;

        document.getElementById("userAge").textContent =
            employment.age;

        document.getElementById("eligibilityMessage").textContent =
            employment.message;

        const applyButton =
            document.getElementById("employmentApplyBtn");

        if (employment.can_apply) {

            applyButton.style.display = "inline-block";
            applyButton.textContent =
            "Apply for Employment →";

        } else {

            applyButton.style.display = "none";

            document.getElementById("eligibilityMessage").textContent =
                "You can explore employment services. Application access is available from age 18.";
        }

    } catch (error) {

        console.error(
            "Employment Eligibility Error:",
            error
        );

        document.getElementById("eligibilityMessage").textContent =
            "Unable to connect to eligibility service.";
    }
}


// Employment Application

// Employment Application

async function applyForEmployment() {

    const mobile = localStorage.getItem("userMobile");

    if (!mobile) {
        alert("User session not found. Please login again.");
        window.location.href = "index.html";
        return;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/applications/apply",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mobile: mobile,
                    service_name: "Employment Service",
                    department: "Employment Department"
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            alert(
                "Application submitted successfully! Application ID: MC-" +
                result.application.id
            );

            window.location.href = "applications.html";

        } else {

            alert(
                result.message ||
                "Failed to submit application."
            );
        }

    } catch (error) {

        console.error(
            "Employment Application Error:",
            error
        );

        alert(
            "Unable to connect to MahaConnect server."
        );
    }
}


// Load Eligibility

if (document.getElementById("eligibilityMessage")) {
    loadEmploymentEligibility();
}