from transformers import pipeline
from .rules import regex_signals
from .privacy import mask_pii
from .perplexity import compute_perplexity
from fraud_app.models.phishing_roberta import predict_phishing
from fraud_app.core.orchestrator import calculate_hybrid_risk
from fraud_app.core.response_builder import build_response
ai_detector = None

def get_ai_detector():

    global ai_detector

    if ai_detector is None:

        from transformers import pipeline

        

    return ai_detector


def analyze_email(subject: str, body: str):
    text = f"Subject: {subject}\nBody: {body}"
    ppl = compute_perplexity(text)
    detector = get_ai_detector()
    
    roberta_result = predict_phishing(text)

    

    reg = regex_signals(subject, body)
    regex_score = float(reg.get("regex_score", 0.0))

    masked = mask_pii(body)
    pii_found = masked.get("pii_found", {}) or {}

 

    # ✅ Make phishing examples go Critical
    phishing_score = (
        roberta_result["score"] / 100
        if roberta_result["label"].lower() == "phishing"
        else 0
    )

    risk_percent = calculate_hybrid_risk(
        phishing_score=phishing_score,
        regex_score=regex_score,
        ai_generated_score=0,
        has_pii=bool(pii_found),
        has_urls=bool(reg.get("urls"))
    )

    risk = risk_percent / 100

    
        
    risk = max(0.0, min(risk, 1.0))
    risk_percent = round(risk * 100, 1)
    
    if risk_percent >= 80:
        tier = "Critical"
    elif risk_percent >= 60:
        tier = "High"
    elif risk_percent >= 30:
        tier = "Medium"
    else:
        tier = "Safe"

    reasons = [f"AI-generated probability: {round(ai_generated_prob, 2)}"]
    reasons += reg.get("flags", [])[:3]

    

    if reg.get("urls"):
        reasons.append("Contains URL(s)")
    if pii_found:
        reasons.append("PII detected and masked")

    if roberta_result["label"].lower() == "phishing":
        reasons.append("RoBERTa phishing detection")
    
        
    return build_response(
        module="email_shield",
        risk_score=risk_percent,
        risk_level=tier,
        flags=reasons[:6],
        explanations=[],
        metadata={
            "ai_text": {
                 "perplexity": ppl
            },
            "regex": reg,
            "privacy": {
                "pii_found": pii_found,
             "masked_preview": masked.get("masked_text", "")[:250],
            },
            
            "roberta_analysis": roberta_result
        }
    )