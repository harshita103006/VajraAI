from .rules import JAILBREAK_PATTERNS
from fraud_app.core.response_builder import build_response
def analyze_prompt(prompt: str):

    prompt_lower = prompt.lower()

    detected = []

    risk_score = 0

    for pattern, weight in JAILBREAK_PATTERNS.items():

        if pattern in prompt_lower:
            detected.append(pattern)
            risk_score += weight

    risk_score = min(risk_score, 100)

    if risk_score >= 80:
        level = "CRITICAL"
    elif risk_score >= 50:
        level = "HIGH"
    elif risk_score >= 20:
        level = "MEDIUM"
    else:
        level = "SAFE"

    return build_response(
        module="prompt_shield",
        risk_score=risk_score,
        risk_level=level,
        flags=detected,
        explanations=[],
        metadata={
            "prompt_length": len(prompt)
        }
    )