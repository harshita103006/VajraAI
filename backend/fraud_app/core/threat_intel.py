from fraud_app.core.db import get_connection
KNOWN_MALICIOUS_DOMAINS = set()

KNOWN_JAILBREAK_PATTERNS = set()

KNOWN_MALICIOUS_ATTACHMENTS = set()

def add_malicious_domain(domain: str):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        "INSERT OR IGNORE INTO malicious_domains(domain) VALUES (?)",
        (domain.lower(),)
    )

    conn.commit()

    conn.close()


def is_known_malicious_domain(domain: str):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM malicious_domains WHERE domain=?",
        (domain.lower(),)
    )

    result = cursor.fetchone()

    conn.close()

    return result is not None


def add_jailbreak_pattern(pattern: str):
    KNOWN_JAILBREAK_PATTERNS.add(pattern.lower())


def is_known_jailbreak(pattern: str):
    return pattern.lower() in KNOWN_JAILBREAK_PATTERNS


def add_malicious_attachment(filename: str):
    KNOWN_MALICIOUS_ATTACHMENTS.add(filename.lower())


def is_known_malicious_attachment(filename: str):
    return filename.lower() in KNOWN_MALICIOUS_ATTACHMENTS