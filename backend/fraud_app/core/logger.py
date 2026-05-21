from fraud_app.core.db import get_connection


def log_threat(
    module: str,
    threat_type: str,
    risk_level: str,
    details: str
):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO threat_logs(
            module,
            threat_type,
            risk_level,
            details
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            module,
            threat_type,
            risk_level,
            details
        )
    )

    conn.commit()

    conn.close()