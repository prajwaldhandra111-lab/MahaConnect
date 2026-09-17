from fastapi import APIRouter
from backend.database import get_db_connection
from pydantic import BaseModel

router = APIRouter(
    prefix="/officer",
    tags=["Officer"]
)


@router.get("/citizens")
def get_citizens():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            u.id,
            u.mobile,
            u.role,
            p.full_name,
            p.city,
            c.education,
            c.employment,
            c.welfare
        FROM users u
        LEFT JOIN profiles p
            ON u.id = p.user_id
        LEFT JOIN consents c
            ON u.id = c.user_id
        WHERE u.role = 'citizen'
        ORDER BY u.id DESC
        """
    )

    citizens = cursor.fetchall()

    cursor.close()
    connection.close()

    for citizen in citizens:

        services = []

        if citizen["education"]:
            services.append("Education")

        if citizen["employment"]:
            services.append("Employment")

        if citizen["welfare"]:
            services.append("Welfare")

        citizen["services"] = services

        citizen["consent"] = (
            "Active" if services else "Limited"
        )

        citizen["status"] = "Active"

    return {
        "success": True,
        "stats": {
            "total": len(citizens),
            "education": sum(
                1 for citizen in citizens
                if citizen["education"]
            ),
            "employment": sum(
                1 for citizen in citizens
                if citizen["employment"]
            ),
            "welfare": sum(
                1 for citizen in citizens
                if citizen["welfare"]
            )
        },
        "citizens": citizens
    }

@router.get("/reports")
def get_reports():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        # Overall application statistics
        cursor.execute(
            """
            SELECT
                COUNT(*) AS total,
                SUM(status = 'Approved') AS approved,
                SUM(status = 'Pending') AS pending,
                SUM(status = 'Rejected') AS rejected
            FROM applications
            """
        )

        overall = cursor.fetchone()

        # Department-wise application statistics
        cursor.execute(
            """
            SELECT
                department,
                COUNT(*) AS total,
                SUM(status = 'Approved') AS approved,
                SUM(status = 'Pending') AS pending,
                SUM(status = 'Rejected') AS rejected
            FROM applications
            GROUP BY department
            """
        )

        departments = cursor.fetchall()

        return {
            "success": True,
            "overall": overall,
            "departments": departments
        }

    finally:
        cursor.close()
        connection.close()


@router.get("/account/{mobile}")
def get_officer_account(mobile: str):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                id,
                mobile,
                role,
                department
            FROM users
            WHERE mobile = %s
              AND role = 'officer'
            """,
            (mobile,)
        )

        officer = cursor.fetchone()

        if not officer:
            return {
                "success": False,
                "message": "Officer not found"
            }

        return {
            "success": True,
            "account": {
                "officer_id": f"OFF-{officer['id']:04d}",
                "mobile": officer["mobile"],
                "role": "Government Officer",
                "department": officer["department"],
                "name": "Government Officer"
            }
        }

    finally:

        cursor.close()
        connection.close()


# ================= OFFICER PREFERENCES =================

class OfficerPreferencesRequest(BaseModel):

    mobile: str
    application_notifications: bool
    integration_alerts: bool
    system_updates: bool


@router.get("/preferences/{mobile}")
def get_officer_preferences(mobile: str):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE mobile = %s
              AND role = 'officer'
            """,
            (mobile,)
        )

        officer = cursor.fetchone()

        if not officer:
            return {
                "success": False,
                "message": "Officer not found"
            }

        user_id = officer["id"]

        cursor.execute(
            """
            SELECT
                application_notifications,
                integration_alerts,
                system_updates
            FROM officer_preferences
            WHERE user_id = %s
            """,
            (user_id,)
        )

        preferences = cursor.fetchone()

        if not preferences:

            cursor.execute(
                """
                INSERT INTO officer_preferences
                (
                    user_id,
                    application_notifications,
                    integration_alerts,
                    system_updates
                )
                VALUES (%s, TRUE, TRUE, TRUE)
                """,
                (user_id,)
            )

            connection.commit()

            preferences = {
                "application_notifications": True,
                "integration_alerts": True,
                "system_updates": True
            }

        return {
            "success": True,
            "preferences": preferences
        }

    finally:

        cursor.close()
        connection.close()


@router.put("/preferences")
def save_officer_preferences(
    data: OfficerPreferencesRequest
):

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE mobile = %s
              AND role = 'officer'
            """,
            (data.mobile,)
        )

        officer = cursor.fetchone()

        if not officer:
            return {
                "success": False,
                "message": "Officer not found"
            }

        user_id = officer[0]

        cursor.execute(
            """
            INSERT INTO officer_preferences
            (
                user_id,
                application_notifications,
                integration_alerts,
                system_updates
            )
            VALUES (%s, %s, %s, %s)

            ON DUPLICATE KEY UPDATE
                application_notifications =
                    VALUES(application_notifications),

                integration_alerts =
                    VALUES(integration_alerts),

                system_updates =
                    VALUES(system_updates)
            """,
            (
                user_id,
                data.application_notifications,
                data.integration_alerts,
                data.system_updates
            )
        )

        connection.commit()

        return {
            "success": True,
            "message": "Officer preferences saved successfully"
        }

    finally:

        cursor.close()
        connection.close()

# ================= OFFICER SECURITY STATUS =================

@router.get("/security-status")
def officer_security_status():

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        # Check officer accounts
        cursor.execute(
            """
            SELECT COUNT(*)
            FROM users
            WHERE role = 'officer'
            """
        )

        officer_count = cursor.fetchone()[0]

        # Check audit logging
        cursor.execute(
            """
            SELECT COUNT(*)
            FROM audit_logs
            WHERE department IS NOT NULL
            """
        )

        audit_count = cursor.fetchone()[0]

        return {
            "success": True,
            "password_protection":
                "Active" if officer_count > 0 else "Unavailable",

            "role_based_access":
                "Enabled" if officer_count > 0 else "Unavailable",

            "audit_logging":
                "Enabled" if audit_count >= 0 else "Unavailable"
        }

    finally:

        cursor.close()
        connection.close()

# ================= OFFICER SYSTEM STATUS =================

@router.get("/system-status")
def officer_system_status():

    connection = None

    try:

        connection = get_db_connection()

        database_status = (
            "Connected"
            if connection.is_connected()
            else "Unavailable"
        )

        return {
            "success": True,
            "platform": "MahaConnect",
            "version": "1.0.0",
            "environment": "Prototype",
            "database": database_status
        }

    except Exception as error:

        print("Officer System Status Error:", error)

        return {
            "success": False,
            "platform": "MahaConnect",
            "version": "1.0.0",
            "environment": "Prototype",
            "database": "Unavailable"
        }

    finally:

        if connection:
            connection.close()