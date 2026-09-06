from fastapi import APIRouter

router = APIRouter(
    prefix="/audit",
    tags=["Audit Logs"]
)

from backend.database import get_db_connection


def create_audit_log(user_id, action, department):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO audit_logs
        (user_id, action, department)
        VALUES (%s, %s, %s)
        """,
        (user_id, action, department)
    )

    connection.commit()

    cursor.close()
    connection.close()

    return True

def get_audit_logs():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

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

    cursor.close()
    connection.close()

    return logs

@router.get("/logs")
def audit_logs():

    logs = get_audit_logs()

    return {
        "success": True,
        "logs": logs
    }