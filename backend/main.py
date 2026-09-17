from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.auth.routes import router as auth_router
from backend.consent.routes import router as consent_router
from backend.profile.routes import router as profile_router
from backend.eligibility.routes import router as eligibility_router
from backend.applications.routes import router as applications_router
from backend.integration.routes import router as integration_router
from backend.notifications.routes import router as notifications_router
from backend.audit.logger import router as audit_router
from backend.officer.routes import router as officer_router
from backend.admin.routes import router as admin_router
from backend.settings.routes import router as settings_router

app = FastAPI(
    title="MahaConnect",
    description="Government Digital Services Interoperability Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(consent_router)
app.include_router(profile_router)
app.include_router(eligibility_router)
app.include_router(applications_router)
app.include_router(integration_router)
app.include_router(notifications_router)
app.include_router(audit_router)
app.include_router(officer_router)
app.include_router(admin_router)
app.include_router(settings_router)

@app.get("/")
def home():
    return {
        "project": "MahaConnect",
        "problem_statement": "SIH26129",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }