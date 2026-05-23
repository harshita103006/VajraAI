def calculate_hybrid_risk(
    phishing_score: float,
    regex_score: float,
    ai_generated_score: float,
    has_pii: bool,
    has_urls: bool
):

    risk = (
        (0.40 * phishing_score)
        + (0.40 * regex_score)
        + (0.10 * ai_generated_score)
    )

    if has_pii:
       risk += 0.05

    if has_urls:
        risk += 0.10

    risk = max(0.0, min(risk, 1.0))

    return round(risk * 100, 1)