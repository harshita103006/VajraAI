def get_risk_level(score: int):

    if score < 20:
        return "SAFE"

    elif score < 50:
        return "MEDIUM"

    elif score < 75:
        return "HIGH"

    return "CRITICAL"