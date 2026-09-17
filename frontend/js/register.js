document
    .getElementById("registerForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const mobile =
            document.getElementById("mobile").value;

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const terms =
            document.getElementById("terms");

        const message =
            document.getElementById("message");


        if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {

            message.textContent =
                "Enter a valid 10-digit mobile number.";

            return;
        }


        if (password.length < 8) {

            message.textContent =
                "Password must be at least 8 characters.";

            return;
        }


        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        if (!terms.checked) {

            message.textContent =
                "Please agree to the Terms & Privacy Policy.";

            return;
        }


        try {

            const response = await fetch(
                "http://127.0.0.1:8000/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        mobile: mobile,
                        password: password
                    })
                }
            );


            const result =
                await response.json();


            if (result.success) {

                alert(
                    "Citizen account created successfully!"
                );

                window.location.href =
                    "index.html?role=citizen";

            } else {

                message.textContent =
                    result.message ||
                    "Registration failed.";

            }


        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );

            message.textContent =
                "Unable to connect to server.";

        }

    });