from fastapi import APIRouter
from pydantic import BaseModel
from backend.database import get_db_connection

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


class NotificationRequest(BaseModel):
    mobile: str
    title: str
    message: str


@router.post("/create")
def create_notification(data: NotificationRequest):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE mobile = %s",
        (data.mobile,)
    )

    user = cursor.fetchone()

    if not user:
        cursor.close()
        connection.close()

        return {
            "success": False,
            "message": "User not found"
        }

    user_id = user[0]

    cursor.execute(
        """
        INSERT INTO notifications
        (user_id, title, message)
        VALUES (%s, %s, %s)
        """,
        (user_id, data.title, data.message)
    )

    connection.commit()

    notification_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return {
        "success": True,
        "message": "Notification created successfully",
        "notification": {
            "id": notification_id,
            "title": data.title,
            "message": data.message
        }
    }


@router.get("/{mobile}")
def get_notifications(mobile: str):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            n.id,
            n.title,
            n.message,
            n.is_read,
            n.created_at
        FROM notifications n
        JOIN users u
            ON n.user_id = u.id
        WHERE u.mobile = %s
        ORDER BY n.created_at DESC
        """,
        (mobile,)
    )

    notifications = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "success": True,
        "notifications": notifications
    }