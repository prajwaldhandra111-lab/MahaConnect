from fastapi import APIRouter
from pydantic import BaseModel
from backend.database import get_db_connection

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class LoginRequest(BaseModel):
    mobile: str
    password: str


@router.post("/login")
def login(data: LoginRequest):

    if len(data.mobile) != 10 or not data.mobile.isdigit():
        return {
            "success": False,
            "message": "Invalid mobile number"
        }

    if not data.password:
        return {
            "success": False,
            "message": "Password is required"
        }

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
    "SELECT id, role FROM users WHERE mobile = %s",
    (data.mobile,)
    )

    user = cursor.fetchone()

    if not user:

        cursor.execute(
            """
            INSERT INTO users (mobile, password)
            VALUES (%s, %s)
            """,
            (data.mobile, data.password)
        )

        connection.commit()

        user_id = cursor.lastrowid

    else:
        user_id = user[0]
        role = user[1]

    cursor.close()
    connection.close()

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user_id,
            "mobile": data.mobile,
            "role": role
        }
    }