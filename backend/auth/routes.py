from fastapi import APIRouter
from pydantic import BaseModel
from backend.database import get_db_connection
from fastapi import APIRouter
import bcrypt
import secrets
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class LoginRequest(BaseModel):
    mobile: str
    password: str

class RegisterRequest(BaseModel):
    mobile: str
    password: str

class ForgotPasswordRequest(BaseModel):
    mobile: str
    new_password: str

class SendOTPRequest(BaseModel):
    mobile: str

@router.post("/register")
def register(data: RegisterRequest):

    # Validate mobile
    if len(data.mobile) != 10 or not data.mobile.isdigit():
        return {
            "success": False,
            "message": "Invalid mobile number"
        }

    # Validate password
    if len(data.password) < 8:
        return {
            "success": False,
            "message": "Password must be at least 8 characters"
        }

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        # Check if mobile already exists
        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE mobile = %s
            """,
            (data.mobile,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return {
                "success": False,
                "message": "Mobile number already registered"
            }

        # Hash password
        hashed_password = bcrypt.hashpw(
            data.password.encode(),
            bcrypt.gensalt()
        ).decode()

        # Create citizen account
        cursor.execute(
            """
            INSERT INTO users (mobile, password, role)
            VALUES (%s, %s, 'citizen')
            """,
            (data.mobile, hashed_password)
        )

        connection.commit()

        return {
            "success": True,
            "message": "Citizen account created successfully"
        }

    finally:
        cursor.close()
        connection.close()

@router.post("/send-otp")
def send_otp(data: SendOTPRequest):

    # Validate mobile
    if len(data.mobile) != 10 or not data.mobile.isdigit():
        return {
            "success": False,
            "message": "Invalid mobile number"
        }

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        # Find citizen account
        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE mobile = %s AND role = 'citizen'
            """,
            (data.mobile,)
        )

        user = cursor.fetchone()

        if not user:
            return {
                "success": False,
                "message": "Citizen account not found"
            }

        # Generate 6-digit OTP
        otp = f"{secrets.randbelow(1000000):06d}"

        # Hash OTP
        otp_hash = bcrypt.hashpw(
            otp.encode(),
            bcrypt.gensalt()
        ).decode()

        # OTP expires in 5 minutes
        expires_at = datetime.now() + timedelta(minutes=5)

        # Remove old OTP records
        cursor.execute(
            """
            DELETE FROM password_reset_otps
            WHERE user_id = %s
            """,
            (user["id"],)
        )

        # Store hashed OTP
        cursor.execute(
            """
            INSERT INTO password_reset_otps
                (user_id, otp_hash, expires_at)
            VALUES (%s, %s, %s)
            """,
            (
                user["id"],
                otp_hash,
                expires_at
            )
        )

        connection.commit()

        # Prototype: return OTP for testing
        return {
            "success": True,
            "message": "OTP sent successfully",
            "otp": otp
        }

    finally:
        cursor.close()
        connection.close()

class VerifyOTPRequest(BaseModel):
    mobile: str
    otp: str


@router.post("/verify-otp")
def verify_otp(data: VerifyOTPRequest):
    # Validate mobile
    if len(data.mobile) != 10 or not data.mobile.isdigit():
        return {"success": False, "message": "Invalid mobile number"}

    # Validate OTP
    if len(data.otp) != 6 or not data.otp.isdigit():
        return {"success": False, "message": "Invalid OTP"}

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Find citizen account
        cursor.execute("""
            SELECT id
            FROM users
            WHERE mobile = %s AND role = 'citizen'
        """, (data.mobile,))

        user = cursor.fetchone()

        if not user:
            return {
                "success": False,
                "message": "Citizen account not found"
            }

        # Get latest OTP
        cursor.execute("""
            SELECT id, otp_hash, expires_at, attempts, verified
            FROM password_reset_otps
            WHERE user_id = %s
            ORDER BY id DESC
            LIMIT 1
        """, (user["id"],))

        otp_record = cursor.fetchone()

        if not otp_record:
            return {
                "success": False,
                "message": "OTP not found"
            }

        # Check if already verified
        if otp_record["verified"]:
            return {
                "success": True,
                "message": "OTP already verified"
            }

        # Check expiry
        if datetime.now() > otp_record["expires_at"]:
            return {
                "success": False,
                "message": "OTP has expired"
            }

        # Check maximum attempts
        if otp_record["attempts"] >= 5:
            return {
                "success": False,
                "message": "Too many incorrect attempts"
            }

        # Verify OTP
        if not bcrypt.checkpw(
            data.otp.encode(),
            otp_record["otp_hash"].encode()
        ):
            cursor.execute("""
                UPDATE password_reset_otps
                SET attempts = attempts + 1
                WHERE id = %s
            """, (otp_record["id"],))

            connection.commit()

            return {
                "success": False,
                "message": "Invalid OTP"
            }

        # Mark OTP as verified
        cursor.execute("""
            UPDATE password_reset_otps
            SET verified = TRUE
            WHERE id = %s
        """, (otp_record["id"],))

        connection.commit()

        return {
            "success": True,
            "message": "OTP verified successfully"
        }

    finally:
        cursor.close()
        connection.close()

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest):
    # Validate mobile
    if len(data.mobile) != 10 or not data.mobile.isdigit():
        return {
            "success": False,
            "message": "Invalid mobile number"
        }

    # Validate password
    if len(data.new_password) < 8:
        return {
            "success": False,
            "message": "Password must be at least 8 characters"
        }

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Find citizen account
        cursor.execute("""
            SELECT id
            FROM users
            WHERE mobile = %s AND role = 'citizen'
        """, (data.mobile,))

        user = cursor.fetchone()

        if not user:
            return {
                "success": False,
                "message": "Citizen account not found"
            }

        # Get latest verified OTP
        cursor.execute("""
            SELECT id, verified, expires_at
            FROM password_reset_otps
            WHERE user_id = %s
            ORDER BY id DESC
            LIMIT 1
        """, (user["id"],))

        otp_record = cursor.fetchone()

        if not otp_record:
            return {
                "success": False,
                "message": "Please verify OTP first"
            }

        # Check OTP verification
        if not otp_record["verified"]:
            return {
                "success": False,
                "message": "Please verify OTP first"
            }

        # Check OTP expiry
        if datetime.now() > otp_record["expires_at"]:
            return {
                "success": False,
                "message": "OTP has expired. Please request a new OTP"
            }

        # Hash new password
        hashed_password = bcrypt.hashpw(
            data.new_password.encode(),
            bcrypt.gensalt()
        ).decode()

        # Update password
        cursor.execute("""
            UPDATE users
            SET password = %s
            WHERE id = %s
        """, (hashed_password, user["id"]))

        # Consume OTP after successful password reset
        cursor.execute("""
            DELETE FROM password_reset_otps
            WHERE id = %s
        """, (otp_record["id"],))

        connection.commit()

        return {
            "success": True,
            "message": "Password reset successfully"
        }

    finally:
        cursor.close()
        connection.close()

@router.post("/login")
def login(data: LoginRequest):

    # Validate mobile
    if len(data.mobile) != 10 or not data.mobile.isdigit():
        return {
            "success": False,
            "message": "Invalid mobile number"
        }

    # Validate password
    if not data.password:
        return {
            "success": False,
            "message": "Password is required"
        }

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Find user
        cursor.execute("""
            SELECT id, mobile, password, role
            FROM users
            WHERE mobile = %s
        """, (data.mobile,))

        user = cursor.fetchone()

        if not user:
            return {
                "success": False,
                "message": "User not found"
            }

        # Check password
        if not bcrypt.checkpw(
            data.password.encode(),
            user["password"].encode()
        ):
            return {
                "success": False,
                "message": "Invalid password"
            }

        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "mobile": user["mobile"],
                "role": user["role"]
            }
        }

    finally:
        cursor.close()
        connection.close()