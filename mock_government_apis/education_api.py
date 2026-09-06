from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="MahaConnect Education Department API",
    description="Mock Education Department System",
    version="1.0.0"
)


class EducationRequest(BaseModel):
    mobile: str


@app.get("/")
def home():
    return {
        "department": "Education Department",
        "status": "online"
    }


@app.post("/records")
def get_education_records(data: EducationRequest):

    return {
        "success": True,
        "message": "Education records retrieved successfully",
        "department": "Education Department",
        "student": {
            "mobile": data.mobile,
            "institution": "Vishwaniketan's Institute of Management Entrepreneurship and Engineering Technology",
            "program": "Computer Science and Engineering (AIML)",
            "year": "3rd Year",
            "status": "Active"
        }
    }