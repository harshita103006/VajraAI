from fastapi import APIRouter
from fraud_app.core.db import get_connection

router = APIRouter()


@router.get("/threats/domains")
def get_domains():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        "SELECT domain, created_at FROM malicious_domains"
    )

    rows = cursor.fetchall()

    conn.close()

    return [
        {
            "domain": row["domain"],
            "created_at": row["created_at"]
        }
        for row in rows
    ]

@router.get("/threats/stats")
def get_stats():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        "SELECT COUNT(*) as count FROM malicious_domains"
    )

    domain_count = cursor.fetchone()["count"]

    conn.close()

    return {
        "total_malicious_domains": domain_count
    }

@router.get("/threats/logs")
def get_logs():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            module,
            threat_type,
            risk_level,
            details,
            created_at
        FROM threat_logs
        ORDER BY created_at DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    return [
        {
            "module": row["module"],
            "threat_type": row["threat_type"],
            "risk_level": row["risk_level"],
            "details": row["details"],
            "created_at": row["created_at"]
        }
        for row in rows
    ]