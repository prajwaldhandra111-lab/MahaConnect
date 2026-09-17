from fastapi import APIRouter
import urllib.request
import json

router = APIRouter(
    prefix="/integration",
    tags=["Integration"]
)


@router.post("/employment")
def send_to_employment_department(
    application_id: int,
    mobile: str,
    service_name: str
):

    data = {
        "application_id": application_id,
        "mobile": mobile,
        "service_name": service_name
    }

    try:

        request = urllib.request.Request(
            "http://127.0.0.1:8001/applications",
            data=json.dumps(data).encode("utf-8"),
            headers={
                "Content-Type": "application/json"
            },
            method="POST"
        )

        with urllib.request.urlopen(request) as response:

            result = json.loads(
                response.read().decode("utf-8")
            )

        return {
            "success": True,
            "message": "Application successfully sent to Employment Department",
            "department_response": result
        }

    except Exception as error:

        return {
            "success": False,
            "message": "Unable to connect to Employment Department",
            "error": str(error)
        }

@router.post("/education")
def send_to_education_department(
    mobile: str
):

    data = {
        "mobile": mobile
    }

    try:

        request = urllib.request.Request(
            "http://127.0.0.1:8002/records",
            data=json.dumps(data).encode("utf-8"),
            headers={
                "Content-Type": "application/json"
            },
            method="POST"
        )

        with urllib.request.urlopen(request) as response:

            result = json.loads(
                response.read().decode("utf-8")
            )

        return {
            "success": True,
            "message": "Education records successfully retrieved",
            "department_response": result
        }

    except Exception as error:

        return {
            "success": False,
            "message": "Unable to connect to Education Department",
            "error": str(error)
        }

@router.post("/welfare")
def send_to_welfare_department(mobile: str):

    data = {
        "mobile": mobile
    }

    try:
        request = urllib.request.Request(
            "http://127.0.0.1:8003/schemes",
            data=json.dumps(data).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urllib.request.urlopen(request) as response:
            result = json.loads(response.read().decode("utf-8"))

        return {
            "success": True,
            "message": "Welfare schemes successfully retrieved",
            "department_response": result
        }

    except Exception as error:

        return {
            "success": False,
            "message": "Unable to connect to Welfare Department",
            "error": str(error)
        }

@router.post("/financial-support")
def send_to_financial_support(mobile: str):

    data = {
        "mobile": mobile
    }

    try:
        request = urllib.request.Request(
            "http://127.0.0.1:8003/financial-support",
            data=json.dumps(data).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urllib.request.urlopen(request) as response:
            result = json.loads(response.read().decode("utf-8"))

        return {
            "success": True,
            "message": "Financial assistance programs successfully retrieved",
            "department_response": result
        }

    except Exception as error:

        return {
            "success": False,
            "message": "Unable to connect to Welfare Department",
            "error": str(error)
        }


@router.post("/benefits")
def send_to_welfare_benefits(mobile: str):

    data = {
        "mobile": mobile
    }

    try:
        request = urllib.request.Request(
            "http://127.0.0.1:8003/benefits",
            data=json.dumps(data).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urllib.request.urlopen(request) as response:
            result = json.loads(response.read().decode("utf-8"))

        return {
            "success": True,
            "message": "Welfare benefits successfully retrieved",
            "department_response": result
        }

    except Exception as error:

        return {
            "success": False,
            "message": "Unable to connect to Welfare Department",
            "error": str(error)
        }

@router.get("/status")
def integration_status():

    departments = [
        {
            "name": "Education Department",
            "endpoint": "http://127.0.0.1:8002",
            "display_endpoint": "/api/education"
        },
        {
            "name": "Employment Department",
            "endpoint": "http://127.0.0.1:8001",
            "display_endpoint": "/api/employment"
        },
        {
            "name": "Welfare Department",
            "endpoint": "http://127.0.0.1:8003",
            "display_endpoint": "/api/welfare"
        }
    ]

    results = []

    for department in departments:

        try:

            request = urllib.request.Request(
                department["endpoint"],
                method="GET"
            )

            with urllib.request.urlopen(
                request,
                timeout=3
            ) as response:

                online = response.status == 200

        except Exception:

            online = False


        results.append(
            {
                "name": department["name"],
                "endpoint": department["display_endpoint"],
                "status": (
                    "Connected"
                    if online
                    else "Unavailable"
                ),
                "operational": online
            }
        )


    connected = sum(
        1
        for department in results
        if department["operational"]
    )

    total = len(results)

    availability = round(
        (connected / total) * 100
    ) if total else 0


    return {
        "success": True,
        "connected_apis": connected,
        "total_apis": total,
        "active_services": connected,
        "availability": availability,
        "departments": results
    }    