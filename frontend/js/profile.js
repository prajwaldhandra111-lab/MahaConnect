const mobileInput = document.getElementById("mobile");

const savedMobile = localStorage.getItem("userMobile");

if (savedMobile) {
    mobileInput.value = savedMobile;
}

document
    .getElementById("profileForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const profile = {

            mobile:
                document.getElementById("mobile").value,

            full_name:
                document.getElementById("fullName").value,

            dob:
                document.getElementById("dob").value,

            gender:
                document.getElementById("gender").value,

            email:
                document.getElementById("email").value,

            city:
                document.getElementById("city").value,

            address:
                document.getElementById("address").value,

            school_college:
                document.getElementById("institution").value,

            board:
                document.getElementById("board").value,

            current_class:
                document.getElementById("class").value,

            academic_year:
                document.getElementById("academicYear").value,

            skills:
                document.getElementById("skills").value,

            interests:
                document.getElementById("interests").value
        };

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/profile/save",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(profile)
                }
            );

            const result = await response.json();

            if (result.success) {

                localStorage.setItem(
                    "mahaConnectProfile",
                    JSON.stringify(profile)
                );

                alert("Profile saved successfully!");

                window.location.href = "dashboard.html";

            } else {

                alert(result.message || "Failed to save profile.");

            }

        } catch (error) {

            console.error("Profile API Error:", error);

            alert(
                "Unable to connect to server. Please make sure FastAPI is running."
            );
        }

    });