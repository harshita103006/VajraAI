from datetime import datetime


def build_response(
    module: str,
    risk_score: int,
    risk_level: str,
    flags: list,
    explanations: list,
    metadata: dict
):

    return {
        "status": "success",
        "module": module,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "flags": flags,
        "explanations": explanations,
        "metadata": metadata,
        "timestamp": datetime.utcnow().isoformat()
    }