from fraud_app.core.risk_engine import get_risk_level
def calculate_score(features):
    score = 0
    flags = []

    if features["has_ip"]:
        score += 25
        flags.append("IP address used")

    if features["long_url"]:
        score += 15
        flags.append("Very long URL")
    
    if features["is_shortened"]:
        score += 20
        flags.append("Shortened URL detected")

    if features["suspicious_tld"]:
        score += 30
        flags.append("Suspicious TLD")

    if features["brand_impersonation"]:
        score += 25
        flags.append("Brand impersonation detected")

    if features["has_hyphen"]:
        score += 10
        flags.append("Hyphenated domain")

    if not features["has_https"]:
        score += 20
        flags.append("No HTTPS")

    level = get_risk_level(score)
    return {
        "score": score,
        "level": level,
        "flags": flags
    }