from datetime import date


def calculate_age(dob):
    birth_date = date.fromisoformat(dob)
    today = date.today()

    age = today.year - birth_date.year

    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1

    return age


def check_employment_eligibility(dob):
    age = calculate_age(dob)

    if age < 18:
        return {
            "eligible": False,
            "age": age,
            "can_explore": True,
            "can_apply": False,
            "message": "You can explore employment services, but you must be 18 or older to apply."
        }

    return {
        "eligible": True,
        "age": age,
        "can_explore": True,
        "can_apply": True,
        "message": "You can explore and apply for employment services."
    }