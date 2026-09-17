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

    # Identity Verification
    identity_verified: bool = False
    identity_source: str | None = None


@router.post("/save")
def save_profile(data: ProfileRequest):

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Find user
        cursor.execute(
            "SELECT id FROM users WHERE mobile = %s",
            (data.mobile,)
        )

        user = cursor.fetchone()

        if not user:
            return {
                "success": False,
                "message": "User not found"
            }

        user_id = user[0]

        # Check existing profile
        cursor.execute(
            "SELECT id FROM profiles WHERE user_id = %s",
            (user_id,)
        )

        existing_profile = cursor.fetchone()

        if existing_profile:

            cursor.execute(
                """
                UPDATE profiles
                SET
                    full_name = %s,
                    dob = %s,
                    gender = %s,
                    email = %s,
                    city = %s,
                    address = %s,
                    school_college = %s,
                    board = %s,
                    current_class = %s,
                    academic_year = %s,
                    skills = %s,
                    interests = %s,
                    identity_verified = %s,
                    identity_source = %s
                WHERE user_id = %s
                """,
                (
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
                    data.interests,
                    data.identity_verified,
                    data.identity_source,
                    user_id
                )
            )

            message = "Profile updated successfully"

        else:

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
                    interests,
                    identity_verified,
                    identity_source
                )
                VALUES
                (
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s
                )
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
                    data.interests,
                    data.identity_verified,
                    data.identity_source
                )
            )

            message = "Profile saved successfully"

        connection.commit()

        return {
            "success": True,
            "message": message
        }

    finally:
        cursor.close()
        connection.close()


@router.get("/{mobile}")
def get_profile(mobile: str):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

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
                p.interests,
                p.identity_verified,
                p.identity_source
            FROM profiles p
            JOIN users u
                ON p.user_id = u.id
            WHERE u.mobile = %s
            """,
            (mobile,)
        )

        profile = cursor.fetchone()

        if not profile:
            return {
                "success": False,
                "message": "Profile not found"
            }

        return {
            "success": True,
            "profile": profile
        }

    finally:
        cursor.close()
        connection.close()