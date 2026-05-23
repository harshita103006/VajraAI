from .rules import SUSPICIOUS_EXTENSIONS
from .mime_checker import detect_mime_type
from fraud_app.core.response_builder import build_response


def analyze_attachment(filename: str):

    filename_lower = filename.lower()

    mime_type = detect_mime_type(filename)

    flags = []

    risk_score = 0

    # Suspicious executable extensions
    for ext in SUSPICIOUS_EXTENSIONS:

        if filename_lower.endswith(ext):

            flags.append(
                "Suspicious executable extension"
            )

            risk_score += 40

    # Double extension detection
    parts = filename_lower.split(".")

    if len(parts) > 2:

        flags.append(
            "Double extension detected"
        )

        risk_score += 30

    # Executable disguised as document
    if (
        ".pdf.exe" in filename_lower
        or ".docx.exe" in filename_lower
        or ".xlsx.exe" in filename_lower
    ):

        flags.append(
            "Executable disguised as document"
        )

        risk_score += 40

    # Unknown MIME type
    if mime_type is None:

        flags.append(
            "Unknown MIME type"
        )

        risk_score += 20

    # MIME mismatch detection
    if (
        filename_lower.endswith(".pdf")
        and mime_type != "application/pdf"
    ):

        flags.append(
            "MIME mismatch detected"
        )

        risk_score += 40

    # Clamp risk score
    risk_score = min(risk_score, 100)

    # Risk levels
    if risk_score >= 80:
        level = "CRITICAL"

    elif risk_score >= 50:
        level = "HIGH"

    elif risk_score >= 20:
        level = "MEDIUM"

    else:
        level = "SAFE"

    return build_response(
        module="attachment_shield",
        risk_score=risk_score,
        risk_level=level,
        flags=flags,
        explanations=[],
        metadata={
            "filename": filename,
            "mime_type": mime_type
        }
    )