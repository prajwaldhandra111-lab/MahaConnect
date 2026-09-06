async function loadNotifications() {

    const mobile = localStorage.getItem("userMobile");

    if (!mobile) {
        window.location.href = "index.html";
        return;
    }

    const content = document.getElementById("notificationsContent");

    if (!content) {
        return;
    }

    content.innerHTML = `
        <p>Loading notifications...</p>
    `;

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/notifications/${mobile}`
        );

        const result = await response.json();

        if (!result.success) {

            content.innerHTML = `
                <p>Unable to load notifications.</p>
            `;

            return;
        }

        const notifications = result.notifications;

        if (notifications.length === 0) {

            content.innerHTML = `
                <div class="modern-card">
                    <div class="card-icon">🔔</div>
                    <h3>No Notifications</h3>
                    <p>You don't have any notifications yet.</p>
                </div>
            `;

            return;
        }

        content.innerHTML = notifications.map(notification => `

            <div class="modern-card">

                <div class="card-icon">
                    🔔
                </div>

                <h3>
                    ${notification.title}
                </h3>

                <p>
                    ${notification.message}
                </p>

                <small>
                    ${new Date(
                        notification.created_at
                    ).toLocaleString()}
                </small>

                ${
                    notification.is_read
                    ? `<span class="status-pending">Read</span>`
                    : `<span class="status-pending">New</span>`
                }

            </div>

        `).join("");

    } catch (error) {

        console.error(
            "Notifications Error:",
            error
        );

        content.innerHTML = `
            <div class="modern-card">
                <h3>⚠️ Unable to Load Notifications</h3>
                <p>
                    Please make sure MahaConnect backend is running.
                </p>
            </div>
        `;
    }
}


loadNotifications();