/* =========================================
   MahaConnect Role-Based Theme
   ========================================= */

function getThemeKey() {

    const userRole =
        localStorage.getItem("userRole");

    if (userRole === "citizen") {
        return "citizenDarkMode";
    }

    if (userRole === "officer") {
        return "officerDarkMode";
    }

    if (userRole === "admin") {
        return "adminDarkMode";
    }

    return null;
}


function applyDarkMode() {

    const themeKey = getThemeKey();

    if (!themeKey) {
        document.body.classList.remove("dark-mode");
        return;
    }

    const darkMode =
        localStorage.getItem(themeKey) === "true";

    if (darkMode) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    const darkModeBtn =
        document.getElementById("darkModeBtn");

    if (darkModeBtn) {

        darkModeBtn.textContent =
            darkMode ? "Disable" : "Enable";

    }
}


function toggleDarkMode() {

    const themeKey = getThemeKey();

    if (!themeKey) {
        return;
    }

    const darkMode =
        localStorage.getItem(themeKey) === "true";

    localStorage.setItem(
        themeKey,
        (!darkMode).toString()
    );

    applyDarkMode();
}


applyDarkMode();