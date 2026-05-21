EXPLANATION_MAP = {
    "Suspicious TLD":
        ".xyz, .tk and similar domains are commonly abused in phishing attacks.",

    "No HTTPS":
        "The website does not use HTTPS encryption.",

    "Hyphenated domain":
        "Phishing domains often use hyphens to imitate trusted brands.",

    "Brand impersonation detected":
        "The URL appears to imitate a known trusted brand.",

    "Shortened URL detected":
        "Shortened URLs can hide malicious destinations.",

    "IP address used":
        "Legitimate websites rarely use raw IP addresses in URLs.",

    "Very long URL":
        "Extremely long URLs are commonly used to obscure malicious intent."
}

def generate_explanations(flags):

    explanations = []

    for flag in flags:

        explanations.append({
            "issue": flag,
            "reason": EXPLANATION_MAP.get(
                flag,
                "Potentially suspicious behavior detected."
            )
        })

    return explanations