from .utils import extract_features
from .scorer import calculate_score
from fraud_app.core.explanations import generate_explanations
from .domain_intel import get_domain_age
from urllib.parse import urlparse
from .redirect_checker import resolve_redirects
from fraud_app.core.logger import log_threat
from fraud_app.core.response_builder import build_response

from fraud_app.core.threat_intel import (
    add_malicious_domain,
    is_known_malicious_domain
)
from fraud_app.core.config import (
    URL_HIGH_RISK_THRESHOLD,
    NEW_DOMAIN_RISK,
    REDIRECT_RISK,
    MAX_RISK_SCORE
)

def analyze_url(url: str):
    redirect_data = resolve_redirects(url)

    final_url = redirect_data["final_url"]
    redirect_count = redirect_data["redirect_count"]
    original_features = extract_features(url)
    features = extract_features(final_url)
    if original_features["is_shortened"]:
        features["is_shortened"] = True
    result = calculate_score(features)
    parsed = urlparse(url)
    domain = parsed.netloc

    domain_age = get_domain_age(domain)

    if result["score"] >= URL_HIGH_RISK_THRESHOLD:
        add_malicious_domain(domain)
        log_threat(
            module="url_shield",
            threat_type="malicious_domain",
            risk_level=result["level"],
            details=domain
        )
    if domain_age is not None and domain_age < 30:
        result["score"] += NEW_DOMAIN_RISK
        result["flags"].append("Newly registered domain")

    if redirect_count > 2:
        result["score"] += REDIRECT_RISK
        result["flags"].append("Multiple redirects detected")

    if is_known_malicious_domain(domain):
        result["score"] += 20
        result["flags"].append("Known malicious domain")

    result["score"] = min(result["score"], 100)

    return build_response(
        module="url_shield",
        risk_score=result["score"],
        risk_level=result["level"],
        flags=result["flags"],
        explanations=generate_explanations(
            result["flags"]
        ),
        metadata={
            "url": url,
            "features": features,
            "domain_age_days": domain_age,
            "final_url": final_url,
            "redirect_count": redirect_count
        }
    )
