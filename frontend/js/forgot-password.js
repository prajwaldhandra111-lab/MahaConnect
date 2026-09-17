const API_BASE = "http://127.0.0.1:8000";

const form = document.getElementById("forgotPasswordForm");
const mobileInput = document.getElementById("mobile");
const otpInput = document.getElementById("otp");

const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");

const otpSection = document.getElementById("otpSection");
const passwordSection = document.getElementById("passwordSection");

const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

const message = document.getElementById("message");

let otpVerified = false;


// Send OTP
sendOtpBtn.addEventListener("click", async function () {

    const mobile = mobileInput.value.trim();

    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
        message.textContent =
            "Enter a valid 10-digit mobile number.";
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE}/auth/send-otp`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mobile: mobile
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            message.textContent =
                "OTP sent successfully.";

            otpSection.style.display = "block";

            // Prototype: show OTP for testing
            if (result.otp) {
                console.log("Test OTP:", result.otp);
            }

        } else {

            message.textContent =
                result.message || "Failed to send OTP.";
        }

    } catch (error) {

        console.error("Send OTP Error:", error);

        message.textContent =
            "Unable to connect to server.";
    }
});


// Verify OTP
verifyOtpBtn.addEventListener("click", async function () {

    const mobile = mobileInput.value.trim();
    const otp = otpInput.value.trim();

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        message.textContent =
            "Enter a valid 6-digit OTP.";
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE}/auth/verify-otp`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mobile: mobile,
                    otp: otp
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            otpVerified = true;

            message.textContent =
                "OTP verified successfully.";

            passwordSection.style.display = "block";

            verifyOtpBtn.disabled = true;
            otpInput.disabled = true;

        } else {

            message.textContent =
                result.message || "Invalid OTP.";
        }

    } catch (error) {

        console.error("Verify OTP Error:", error);

        message.textContent =
            "Unable to connect to server.";
    }
});


// Reset Password
form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const mobile = mobileInput.value.trim();
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!otpVerified) {
        message.textContent =
            "Please verify OTP first.";
        return;
    }

    if (newPassword.length < 8) {
        message.textContent =
            "Password must be at least 8 characters.";
        return;
    }

    if (newPassword !== confirmPassword) {
        message.textContent =
            "Passwords do not match.";
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE}/auth/forgot-password`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mobile: mobile,
                    new_password: newPassword
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            alert("Password reset successfully!");

            window.location.href =
                "index.html?role=citizen";

        } else {

            message.textContent =
                result.message ||
                "Password reset failed.";
        }

    } catch (error) {

        console.error(
            "Forgot Password Error:",
            error
        );

        message.textContent =
            "Unable to connect to server.";
    }
});