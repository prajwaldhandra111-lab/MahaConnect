const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const mobile = document.getElementById("mobile").value;
    const password = document.getElementById("password").value;

    message.textContent = "Logging in...";

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/auth/login",
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

        const data = await response.json();

        if (data.success) {

            message.textContent = "Login successful!";

            localStorage.setItem(
                "userMobile",
                data.user.mobile
            );

            localStorage.setItem(
                "userRole",
                data.user.role
            );

            setTimeout(() => {

    if (data.user.role === "admin") {

        window.location.href = "admin.html";

    } else if (data.user.role === "officer") {

        window.location.href = "officer.html";

    } else {

        window.location.href = "profile.html";

    }

}, 500);

        } else {

            message.textContent = data.message;

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to server.";

    }

});