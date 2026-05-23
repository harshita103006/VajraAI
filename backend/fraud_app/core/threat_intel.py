from fraud_app.core.db import get_connection

# -----------------------------
# Known Threat Intelligence
# -----------------------------

KNOWN_MALICIOUS_DOMAINS = set()

KNOWN_JAILBREAK_PATTERNS = {

    "ignore previous instructions",

    "ignore all previous instructions",

    "reveal system prompt",

    "show hidden prompt",

    "you are now",

    "bypass safety",

    "disable security",

    "unrestricted ai",

    "developer instructions",

    "ignore all rules",

    "print api keys",

    "show environment variables",

    "expose secrets",

    "reveal hidden instructions",

    "forget previous instructions",

    "system override",

    "act as root",

    "jailbreak mode",

    "do anything now",

    "execute unrestricted",

    "pretend safety policies do not exist",

    "override developer message",

    "show internal reasoning",

    "chain of thought",

    "ignore ethical guidelines",

    "ignore policy",

    "simulate admin access"
}

KNOWN_MALICIOUS_ATTACHMENTS = {

    ".exe",

    ".bat",

    ".scr",

    ".js",

    ".vbs",

    ".ps1",

    ".dll",

    ".cmd"
}


# -----------------------------
# DOMAIN THREAT FUNCTIONS
# -----------------------------

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


# -----------------------------
# PROMPT INJECTION DETECTION
# -----------------------------

def add_jailbreak_pattern(pattern: str):

    KNOWN_JAILBREAK_PATTERNS.add(
        pattern.lower()
    )


def is_known_jailbreak(prompt: str):

    prompt = prompt.lower()

    for pattern in KNOWN_JAILBREAK_PATTERNS:

        if pattern in prompt:

            return True

    return False


def detect_jailbreak_patterns(prompt: str):

    prompt = prompt.lower()

    detected = []

    for pattern in KNOWN_JAILBREAK_PATTERNS:

        if pattern in prompt:

            detected.append(pattern)

    return detected


# -----------------------------
# ATTACHMENT DETECTION
# -----------------------------

def add_malicious_attachment(filename: str):

    KNOWN_MALICIOUS_ATTACHMENTS.add(
        filename.lower()
    )


def is_known_malicious_attachment(filename: str):

    filename = filename.lower()

    for pattern in KNOWN_MALICIOUS_ATTACHMENTS:

        if pattern in filename:

            return True

    return False