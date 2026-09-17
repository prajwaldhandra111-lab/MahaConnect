from fastapi import APIRouter
from backend.database import get_db_connection
from pydantic import BaseModel

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/dashboard")
def admin_dashboard():

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Total users
        cursor.execute("SELECT COUNT(*) FROM users")
        total_users = cursor.fetchone()[0]

        # Total departments
        total_departments = 3

        # Connected APIs
        connected_apis = 3

        return {
            "success": True,
            "total_users": total_users,
            "departments": total_departments,
            "active_apis": connected_apis
        }

    finally:
        cursor.close()
        connection.close()

@router.get("/platform-status")
def platform_status():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        database_status = (
            "Connected"
            if connection.is_connected()
            else "Unavailable"
        )

        services = [
            {
                "name": "API Gateway",
                "status": "Operational"
            },
            {
                "name": "Consent Engine",
                "status": "Operational"
            },
            {
                "name": "Eligibility Engine",
                "status": "Operational"
            },
            {
                "name": "Notification Service",
                "status": "Operational"
            }
        ]

        return {
            "success": True,
            "platform": "MahaConnect",
            "version": "1.0.0",
            "environment": "Prototype",
            "database": database_status,
            "services": services
        }

    except Exception as error:

        print("Platform Status Error:", error)

        return {
            "success": False,
            "platform": "MahaConnect",
            "version": "1.0.0",
            "environment": "Prototype",
            "database": "Unavailable"
        }

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

@router.get("/security-status")
def security_status():

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        # Check audit logging
        cursor.execute(
            "SELECT COUNT(*) FROM audit_logs"
        )
        audit_count = cursor.fetchone()[0]

        audit_status = (
            "Enabled"
            if audit_count >= 0
            else "Unavailable"
        )

        # Check role based access
        cursor.execute(
            """
            SELECT COUNT(*)
            FROM users
            WHERE role IN ('citizen', 'officer', 'admin')
            """
        )
        role_count = cursor.fetchone()[0]

        role_status = (
            "Enabled"
            if role_count > 0
            else "Unavailable"
        )

        # Check consent records
        cursor.execute(
            "SELECT COUNT(*) FROM consents"
        )
        consent_count = cursor.fetchone()[0]

        consent_status = (
            "Enabled"
            if consent_count >= 0
            else "Unavailable"
        )

        return {
            "success": True,
            "security": [
                {
                    "name": "Audit Logging",
                    "status": audit_status
                },
                {
                    "name": "Role Based Access",
                    "status": role_status
                },
                {
                    "name": "Data Consent",
                    "status": consent_status
                }
            ]
        }

    finally:
        cursor.close()
        connection.close()

@router.get("/users")
def get_admin_users():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute("""
            SELECT
                id,
                mobile,
                role
            FROM users
            ORDER BY id ASC
        """)

        users = cursor.fetchall()

        total_users = len(users)
        citizens = sum(
            1 for user in users
            if user["role"] == "citizen"
        )
        officers = sum(
            1 for user in users
            if user["role"] == "officer"
        )
        admins = sum(
            1 for user in users
            if user["role"] == "admin"
        )

        for user in users:
            user["status"] = "Active"

        return {
            "success": True,
            "stats": {
                "total": total_users,
                "citizens": citizens,
                "officers": officers,
                "admins": admins
            },
            "users": users
        }

    finally:
        cursor.close()
        connection.close()

@router.get("/departments")
def get_admin_departments():

    departments = [
        {
            "name": "Education Department",
            "api": "Education",
            "status": "Operational"
        },
        {
            "name": "Employment Department",
            "api": "Employment",
            "status": "Operational"
        },
        {
            "name": "Welfare Department",
            "api": "Welfare",
            "status": "Operational"
        }
    ]

    active_departments = sum(
        1 for department in departments
        if department["status"] == "Operational"
    )

    connected_apis = active_departments

    total_departments = len(departments)

    availability = round(
        (active_departments / total_departments) * 100
    ) if total_departments else 0

    return {
        "success": True,
        "stats": {
            "total_departments": total_departments,
            "active_departments": active_departments,
            "connected_apis": connected_apis,
            "availability": availability
        },
        "departments": departments
    }


class AdminPreferencesRequest(BaseModel):
    mobile: str
    system_updates: bool
    integration_alerts: bool
    security_alerts: bool


@router.get("/preferences/{mobile}")
def get_admin_preferences(mobile: str):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE mobile = %s
              AND role = 'admin'
            """,
            (mobile,)
        )

        user = cursor.fetchone()

        if not user:
            return {
                "success": False,
                "message": "Administrator not found"
            }

        user_id = user["id"]

        cursor.execute(
            """
            SELECT
                system_updates,
                integration_alerts,
                security_alerts
            FROM admin_preferences
            WHERE user_id = %s
            """,
            (user_id,)
        )

        preferences = cursor.fetchone()

        if not preferences:

            cursor.execute(
                """
                INSERT INTO admin_preferences
                (
                    user_id,
                    system_updates,
                    integration_alerts,
                    security_alerts
                )
                VALUES (%s, TRUE, TRUE, TRUE)
                """,
                (user_id,)
            )

            connection.commit()

            preferences = {
                "system_updates": True,
                "integration_alerts": True,
                "security_alerts": True
            }

        return {
            "success": True,
            "preferences": preferences
        }

    finally:

        cursor.close()
        connection.close()


@router.put("/preferences")
def save_admin_preferences(
    data: AdminPreferencesRequest
):

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE mobile = %s
              AND role = 'admin'
            """,
            (data.mobile,)
        )

        user = cursor.fetchone()

        if not user:
            return {
                "success": False,
                "message": "Administrator not found"
            }

        user_id = user[0]

        cursor.execute(
            """
            INSERT INTO admin_preferences
            (
                user_id,
                system_updates,
                integration_alerts,
                security_alerts
            )
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                system_updates = VALUES(system_updates),
                integration_alerts = VALUES(integration_alerts),
                security_alerts = VALUES(security_alerts)
            """,
            (
                user_id,
                data.system_updates,
                data.integration_alerts,
                data.security_alerts
            )
        )

        connection.commit()

        return {
            "success": True,
            "message": "Admin preferences saved successfully"
        }

    finally:

        cursor.close()
        connection.close()

@router.get("/account/{mobile}")
def get_admin_account(mobile: str):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT
                id,
                mobile,
                role
            FROM users
            WHERE mobile = %s
              AND role = 'admin'
            """,
            (mobile,)
        )

        admin = cursor.fetchone()

        if not admin:
            return {
                "success": False,
                "message": "Administrator not found"
            }

        return {
            "success": True,
            "account": {
                "admin_id": f"ADM-{admin['id']:04d}",
                "mobile": admin["mobile"],
                "role": "Platform Administrator",
                "department": "MahaConnect Administration"
            }
        }

    finally:
        cursor.close()
        connection.close()