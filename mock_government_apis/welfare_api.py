from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="MahaConnect Welfare Department API",
    description="Mock Welfare Department System",
    version="1.0.0"
)


class WelfareRequest(BaseModel):
    mobile: str


@app.get("/")
def home():
    return {
        "department": "Welfare Department",
        "status": "online"
    }


@app.post("/schemes")
def get_welfare_schemes(data: WelfareRequest):

    return {
        "success": True,
        "message": "Welfare schemes retrieved successfully",
        "department": "Welfare Department",
        "citizen": {
            "mobile": data.mobile
        },
        "schemes": [
            {
                "name": "Student Welfare Support",
                "category": "Education",
                "status": "Available"
            },
            {
                "name": "Financial Assistance",
                "category": "Financial Support",
                "status": "Eligibility Check Required"
            },
            {
                "name": "Citizen Welfare Benefits",
                "category": "General Welfare",
                "status": "Eligibility Check Required"
            }
        ]
    }

@app.post("/financial-support")
def get_financial_support(data: WelfareRequest):

    return {
        "success": True,
        "message": "Financial assistance programs retrieved successfully",
        "department": "Welfare Department",
        "citizen": {
            "mobile": data.mobile
        },
        "programs": [
            {
                "name": "Education Financial Aid",
                "category": "Education",
                "status": "Eligibility Check Required"
            },
            {
                "name": "Employment Support",
                "category": "Employment",
                "status": "Eligibility Check Required"
            },
            {
                "name": "Citizen Assistance",
                "category": "General Welfare",
                "status": "Eligibility Check Required"
            }
        ]
    }

@app.post("/benefits")
def get_welfare_benefits(data: WelfareRequest):

    return {
        "success": True,
        "message": "Welfare benefits retrieved successfully",
        "department": "Welfare Department",
        "citizen": {
            "mobile": data.mobile
        },
        "benefits": [
            {
                "name": "Housing Support",
                "category": "Housing",
                "status": "Eligibility Check Required"
            },
            {
                "name": "Health Support",
                "category": "Health",
                "status": "Eligibility Check Required"
            },
            {
                "name": "Family Welfare",
                "category": "Family",
                "status": "Eligibility Check Required"
            }
        ]
    }