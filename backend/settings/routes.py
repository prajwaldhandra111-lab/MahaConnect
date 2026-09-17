from fastapi import APIRouter
from pydantic import BaseModel
from backend.database import get_db_connection

router = APIRouter(prefix="/settings", tags=["Citizen Settings"])


class CitizenPreferencesRequest(BaseModel):
    mobile: str
    application_notifications: bool
    government_alerts: bool


@router.get("/preferences/{mobile}")
def get_preferences(mobile: str):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT u.id, cp.application_notifications, cp.government_alerts
            FROM users u
            LEFT JOIN citizen_preferences cp
                ON u.id = cp.user_id
            WHERE u.mobile = %s AND u.role = 'citizen'
        """, (mobile,))

        preferences = cursor.fetchone()

        if not preferences:
            return {
                "success": False,
                "message": "Citizen not found"
            }

        return {
            "success": True,
            "preferences": {
                "application_notifications":
                    bool(preferences["application_notifications"])
                    if preferences["application_notifications"] is not None
                    else True,

                "government_alerts":
                    bool(preferences["government_alerts"])
                    if preferences["government_alerts"] is not None
                    else True
            }
        }

    finally:
        cursor.close()
        connection.close()


@router.put("/preferences")
def update_preferences(data: CitizenPreferencesRequest):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id FROM users WHERE mobile = %s AND role = 'citizen'",
            (data.mobile,)
        )

        user = cursor.fetchone()

        if not user:
            return {
                "success": False,
                "message": "Citizen not found"
            }

        cursor.execute("""
            INSERT INTO citizen_preferences
                (user_id, application_notifications, government_alerts)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE
                application_notifications = VALUES(application_notifications),
                government_alerts = VALUES(government_alerts)
        """, (
            user["id"],
            data.application_notifications,
            data.government_alerts
        ))

        connection.commit()

        return {
            "success": True,
            "message": "Citizen preferences updated successfully"
        }

    finally:
        cursor.close()
        connection.close()