from fastapi import APIRouter
from backend.database import get_db_connection
from backend.eligibility.rules import check_employment_eligibility

router = APIRouter(
    prefix="/eligibility",
    tags=["Eligibility"]
)


@router.get("/employment/{mobile}")
def employment_eligibility(mobile: str):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT p.dob
        FROM profiles p
        JOIN users u ON p.user_id = u.id
        WHERE u.mobile = %s
        """,
        (mobile,)
    )

    result = cursor.fetchone()

    cursor.close()
    connection.close()

    if not result:
        return {
            "success": False,
            "message": "Profile not found"
        }

    dob = result[0]

    eligibility = check_employment_eligibility(
        dob.isoformat()
    )

    return {
        "success": True,
        "employment": eligibility
    }