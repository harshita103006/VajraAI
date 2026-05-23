import re
from typing import Dict, Any


EMAIL_REGEX = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
)

PHONE_REGEX = re.compile(
    r"\b(?:\+?\d{1,3}[- ]?)?\d{10}\b"
)

OTP_REGEX = re.compile(
    r"\b\d{4,6}\b"
)


def mask_pii(text: str) -> Dict[str, Any]:

    found = {
        "emails": EMAIL_REGEX.findall(text),
        "phones": PHONE_REGEX.findall(text),
        "otps": OTP_REGEX.findall(text),
    }

    masked = text

    masked = EMAIL_REGEX.sub(
        "[EMAIL]",
        masked
    )

    masked = PHONE_REGEX.sub(
        "[PHONE]",
        masked
    )

    masked = OTP_REGEX.sub(
        "[OTP]",
        masked
    )

    pii_found = {
        k: list(set(v))[:5]
        for k, v in found.items()
        if v
    }

    return {
        "masked_text": masked,
        "pii_found": pii_found
    }