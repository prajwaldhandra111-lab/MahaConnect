from fastapi import APIRouter
from pydantic import BaseModel
from backend.database import get_db_connection
from backend.audit.logger import create_audit_log

router = APIRouter(
    prefix="/consent",
    tags=["Consent"]
)


class ConsentRequest(BaseModel):
    mobile: str
    education: bool
    employment: bool
    welfare: bool


@router.post("/save")
def save_consent(data: ConsentRequest):

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

    # Check existing consent
    cursor.execute(
        "SELECT id FROM consents WHERE user_id = %s",
        (user_id,)
    )

    existing = cursor.fetchone()

    if existing:

        cursor.execute(
            """
            UPDATE consents
            SET education = %s,
                employment = %s,
                welfare = %s
            WHERE user_id = %s
            """,
            (
                data.education,
                data.employment,
                data.welfare,
                user_id
            )
        )

    else:

        cursor.execute(
            """
            INSERT INTO consents
            (
                user_id,
                education,
                employment,
                welfare
            )
            VALUES (%s, %s, %s, %s)
            """,
            (
                user_id,
                data.education,
                data.employment,
                data.welfare
            )
        )

    connection.commit()

        # Record consent update in audit logs
    create_audit_log(
        user_id,
        "Updated data sharing consent",
        "MahaConnect"
    )

    cursor.close()
    connection.close()

    return {
        "success": True,
        "message": "Consent saved successfully",
        "consent": {
            "mobile": data.mobile,
            "education": data.education,
            "employment": data.employment,
            "welfare": data.welfare
        }
    }


@router.get("/{mobile}")
def get_consent(mobile: str):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            c.education,
            c.employment,
            c.welfare
        FROM consents c
        JOIN users u ON c.user_id = u.id
        WHERE u.mobile = %s
        """,
        (mobile,)
    )

    consent = cursor.fetchone()

    cursor.close()
    connection.close()

    if not consent:

        return {
            "success": True,
            "mobile": mobile,
            "consent": {
                "education": False,
                "employment": False,
                "welfare": False
            }
        }

    return {
        "success": True,
        "mobile": mobile,
        "consent": consent
    }