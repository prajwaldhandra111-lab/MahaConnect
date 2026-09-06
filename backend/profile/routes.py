from fastapi import APIRouter
from pydantic import BaseModel
from backend.database import get_db_connection

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


class ProfileRequest(BaseModel):
    mobile: str
    full_name: str
    dob: str
    gender: str
    email: str
    city: str
    address: str
    school_college: str
    board: str
    current_class: str
    academic_year: str
    skills: str
    interests: str


@router.post("/save")
def save_profile(data: ProfileRequest):

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
        INSERT INTO profiles
        (
            user_id,
            full_name,
            dob,
            gender,
            email,
            city,
            address,
            school_college,
            board,
            current_class,
            academic_year,
            skills,
            interests
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            user_id,
            data.full_name,
            data.dob,
            data.gender,
            data.email,
            data.city,
            data.address,
            data.school_college,
            data.board,
            data.current_class,
            data.academic_year,
            data.skills,
            data.interests
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "success": True,
        "message": "Profile saved successfully"
    }


@router.get("/{mobile}")
def get_profile(mobile: str):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            p.id,
            p.user_id,
            p.full_name,
            p.dob,
            p.gender,
            p.email,
            p.city,
            p.address,
            p.school_college,
            p.board,
            p.current_class,
            p.academic_year,
            p.skills,
            p.interests
        FROM profiles p
        JOIN users u ON p.user_id = u.id
        WHERE u.mobile = %s
        """,
        (mobile,)
    )

    profile = cursor.fetchone()

    cursor.close()
    connection.close()

    if not profile:
        return {
            "success": False,
            "message": "Profile not found"
        }

    return {
        "success": True,
        "profile": profile
    }