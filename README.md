# MahaConnect

MahaConnect is a government service integration project developed for SIH26129.

The main idea of this project is to connect different government digital services through one common platform. Instead of using different portals for different services, citizens can use one profile and access services related to Education, Employment and Welfare.

## Problem Statement

Government services are available on different digital platforms. Because these platforms work separately, citizens may have to enter the same information multiple times and face difficulty in managing their services.

MahaConnect tries to solve this problem by providing a common integration layer between different government departments.

## Main Features

- Citizen registration and login
- Citizen Master Profile
- Education services
- Employment services
- Welfare services
- Consent management
- Service eligibility checking
- Online applications
- Officer login and application management
- Approve / Reject applications
- Citizen notifications
- Department API integration
- Audit logs
- Admin dashboard
- Role-based access

## How It Works

The citizen first creates an account and completes the Master Profile.

After login, the citizen can see different services such as:

- Education
- Employment
- Welfare

Before sharing profile information with a department, the system checks the user's consent.

Only the required information is shared with the particular department.

For example, employment-related information is shared with the Employment Department only when the required consent is given.

## Project Flow

Citizen
↓
Login / Registration
↓
Master Profile
↓
Dashboard
↓
Select Service
↓
Eligibility Check
↓
Consent Check
↓
Application
↓
Department API
↓
Officer
↓
Approve / Reject
↓
Notification to Citizen

## Technology Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI

### Database
- MySQL

### API Integration
- REST APIs
- Mock Department APIs

### Other Tools
- Git
- GitHub
- VS Code

## User Roles

### Citizen

Citizens can:

- Create an account
- Manage their profile
- View available services
- Give or remove consent
- Apply for services
- Check application status
- Receive notifications

### Government Officer

Officers can:

- View applications
- Check application details
- Approve applications
- Reject applications
- Send status updates to citizens

### Administrator

Admin can:

- View system information
- Manage users
- Manage departments
- Check integrations
- View audit logs
- Monitor system activity

## Consent Management

Consent is used to control how citizen information is shared.

The citizen can provide consent for:

- Education
- Employment
- Welfare

MahaConnect does not share the complete profile with every department. Only the required information is shared according to the service and consent.

## Department Integration

For the prototype, separate mock APIs are created for:

- Education Department
- Employment Department
- Welfare Department

These APIs represent how different government systems can communicate with MahaConnect.

Actual government APIs were not provided for the project, so mock APIs are used for demonstration.

## Database

MySQL is used to store project data.

Main tables include:

- users
- profiles
- consents
- applications
- notifications
- audit_logs

## Project Structure

```text
MahaConnect/
│
├── frontend/
├── backend/
├── mock_government_apis/
├── database/
├── tests/
├── docs/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md