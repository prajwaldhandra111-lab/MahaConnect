from fastapi import APIRouter
from backend.database import get_db_connection

router = APIRouter(
    prefix="/audit",
    tags=["Audit Logs"]
)


def create_audit_log(user_id, action, department):

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO audit_logs
            (user_id, action, department)
            VALUES (%s, %s, %s)
            """,
            (
                user_id,
                action,
                department
            )
        )

        connection.commit()

        return True

    finally:
        cursor.close()
        connection.close()


def get_audit_logs():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT
                id,
                user_id,
                action,
                department,
                created_at
            FROM audit_logs
            ORDER BY created_at DESC
            """
        )

        logs = cursor.fetchall()

        return logs

    finally:
        cursor.close()
        connection.close()


@router.get("/logs")
def audit_logs():

    logs = get_audit_logs()

    return {
        "success": True,
        "logs": logs
    }

@router.get("/request-count")
def api_request_count():

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            SELECT COUNT(*)
            FROM audit_logs
            """
        )

        count = cursor.fetchone()[0]

        return {
            "success": True,
            "api_requests": count
        }

    finally:
        cursor.close()
        connection.close()