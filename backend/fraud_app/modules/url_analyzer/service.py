from .utils import extract_features
from .scorer import calculate_score
from fraud_app.core.explanations import generate_explanations
from .domain_intel import get_domain_age
from urllib.parse import urlparse
from .redirect_checker import resolve_redirects
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
    if domain_age is not None and domain_age < 30:
        result["score"] += 25
        result["flags"].append("Newly registered domain")

    if redirect_count > 2:
        result["score"] += 15
        result["flags"].append("Multiple redirects detected")
    return {
    "module": "url_shield",

    "risk_score": result["score"],

    "risk_level": result["level"],

    "flags": result["flags"],

    "explanations": generate_explanations(
        result["flags"]
    ),

    "metadata": {
        "url": url,
        "features": features,
        "domain_age_days": domain_age,
        "final_url": final_url,
        "redirect_count": redirect_count
    }
}