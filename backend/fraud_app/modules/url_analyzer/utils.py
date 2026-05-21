from urllib.parse import urlparse
SHORTENERS = [
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "rb.gy",
    "is.gd"
]
KNOWN_BRANDS = [
    "paypal",
    "google",
    "amazon",
    "microsoft",
    "apple",
    "netflix",
    "bank",
    "instagram"
]

SUSPICIOUS_TLDS = [".xyz", ".tk", ".ru", ".top"]

def extract_features(url: str):
    parsed = urlparse(url)

    domain = parsed.netloc

    return {
        "has_ip": any(char.isdigit() for char in domain),
        "long_url": len(url) > 75,
        "suspicious_tld": any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS),
        "has_hyphen": "-" in domain,
        
        "has_https": url.startswith("https"),
        "brand_impersonation": any(
            brand in domain.lower()
            for brand in KNOWN_BRANDS
        ),
        "is_shortened": any(
             shortener in domain.lower()
             for shortener in SHORTENERS
        )
    }
    