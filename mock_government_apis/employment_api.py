from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="MahaConnect Employment Department API",
    description="Mock Employment Department System",
    version="1.0.0"
)


class EmploymentApplication(BaseModel):
    application_id: int
    mobile: str
    service_name: str


@app.get("/")
def home():
    return {
        "department": "Employment Department",
        "status": "online"
    }


@app.post("/applications")
def receive_application(data: EmploymentApplication):

    return {
        "success": True,
        "message": "Application received by Employment Department",
        "department": "Employment Department",
        "application": {
            "application_id": data.application_id,
            "mobile": data.mobile,
            "service_name": data.service_name,
            "status": "Pending"
        }
    }