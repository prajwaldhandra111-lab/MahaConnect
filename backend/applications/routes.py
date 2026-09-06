from fastapi import APIRouter
from pydantic import BaseModel
from backend.database import get_db_connection
import urllib.request
import json
from backend.audit.logger import create_audit_log

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


class ApplicationRequest(BaseModel):
    mobile: str
    service_name: str
    department: str


@router.post("/apply")
def create_application(data: ApplicationRequest):

    connection = get_db_connection()
    cursor = connection.cursor()

    # Find user
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

    # Check consent
    cursor.execute(
        """
        SELECT education, employment, welfare
        FROM consents
        WHERE user_id = %s
        """,
        (user_id,)
    )

    consent = cursor.fetchone()

    # Employment application requires employment consent
    if data.service_name == "Employment Service":

        if not consent or not consent[1]:

            cursor.close()
            connection.close()

            return {
                "success": False,
                "message": "Employment data consent is required before applying."
            }

    # Create application
    cursor.execute(
        """
        INSERT INTO applications
        (
            user_id,
            service_name,
            department,
            status
        )
        VALUES (%s, %s, %s, %s)
        """,
        (
            user_id,
            data.service_name,
            data.department,
            "Pending"
        )
    )

    connection.commit()

    application_id = cursor.lastrowid

    cursor.close()
    connection.close()

    # Send application to Employment Department
    department_response = None

    if data.service_name == "Employment Service":

        department_data = {
            "application_id": application_id,
            "mobile": data.mobile,
            "service_name": data.service_name
        }

        try:

            request = urllib.request.Request(
                "http://127.0.0.1:8001/applications",
                data=json.dumps(department_data).encode("utf-8"),
                headers={
                    "Content-Type": "application/json"
                },
                method="POST"
            )

            with urllib.request.urlopen(request) as response:

                department_response = json.loads(
                    response.read().decode("utf-8")
                )

        except Exception as error:

            department_response = {
                "success": False,
                "message": "Employment Department unavailable",
                "error": str(error)
            }

    return {
        "success": True,
        "message": "Application submitted successfully",
        "application": {
            "id": application_id,
            "service_name": data.service_name,
            "department": data.department,
            "status": "Pending"
        },
        "department_response": department_response
    }


@router.get("/{mobile}")
def get_applications(mobile: str):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            a.id,
            a.service_name,
            a.department,
            a.status,
            a.application_date
        FROM applications a
        JOIN users u
            ON a.user_id = u.id
        WHERE u.mobile = %s
        ORDER BY a.application_date DESC
        """,
        (mobile,)
    )

    applications = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "success": True,
        "applications": applications
    }


class StatusUpdateRequest(BaseModel):
    status: str


@router.put("/update-status/{application_id}")
def update_application_status(
    application_id: int,
    data: StatusUpdateRequest
):
    allowed_statuses = ["Pending", "Approved", "Rejected"]

    if data.status not in allowed_statuses:
        return {
            "success": False,
            "message": "Invalid status"
        }

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Get application + citizen mobile
    cursor.execute(
        """
        SELECT
            a.id,
            a.user_id,
            a.service_name,
            u.mobile
        FROM applications a
        JOIN users u
            ON a.user_id = u.id
        WHERE a.id = %s
        """,
        (application_id,)
    )

    application = cursor.fetchone()

    if not application:
        cursor.close()
        connection.close()

        return {
            "success": False,
            "message": "Application not found"
        }

    # Update application status
    cursor.execute(
        """
        UPDATE applications
        SET status = %s
        WHERE id = %s
        """,
        (data.status, application_id)
    )

    # Create notification automatically
    title = f"Application {data.status}"

    message = (
        f"Your {application['service_name']} "
        f"status has been updated to {data.status}."
    )

    cursor.execute(
        """
        INSERT INTO notifications
        (user_id, title, message)
        SELECT user_id, %s, %s
        FROM applications
        WHERE id = %s
        """,
        (title, message, application_id)
    )

    connection.commit()

    create_audit_log(
    application["user_id"],
    f"Application {data.status}",
    application["service_name"]
    )

    cursor.close()
    connection.close()

    return {
        "success": True,
        "message": "Application status updated and notification created",
        "application": {
            "id": application_id,
            "status": data.status
        },
        "notification": {
            "title": title,
            "message": message
        }
    }