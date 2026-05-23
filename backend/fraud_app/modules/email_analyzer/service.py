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

        ai_detector = pipeline(
            "text-classification",
            model="roberta-base-openai-detector"
        )

    return ai_detector


def analyze_email(subject: str, body: str):
    text = f"Subject: {subject}\nBody: {body}"
    ppl = compute_perplexity(text)
    detector = get_ai_detector()
    ai_result = detector(text)[0]
    roberta_result = predict_phishing(text)

    model_label = str(ai_result.get("label", "")).upper()
    raw_score = float(ai_result.get("score", 0.0))

    # ✅ Force: higher score = more suspicious
    ai_generated_prob = (
        raw_score
        if model_label == "FAKE"
        else (1 - raw_score)
    )

    human_label = (
        "AI-Generated"
        if ai_generated_prob >= 0.5
        else "Human-Written"
    )

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
        ai_generated_score=ai_generated_prob,
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
            "ml": {
                "label": human_label,
                "model_label": model_label,
                "raw_score": round(raw_score, 4),
                "ai_generated_prob": round(ai_generated_prob, 4),
            },
            "regex": reg,
            "privacy": {
                "pii_found": pii_found,
             "masked_preview": masked.get("masked_text", "")[:250],
            },
            "ai_text": {
                "perplexity": ppl
            },
            "roberta_analysis": roberta_result
        }
    )