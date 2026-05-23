from fastapi import APIRouter
from pydantic import BaseModel

from fraud_app.core.db import get_connection

router = APIRouter()


class FeedbackRequest(BaseModel):

    module: str

    prediction: str

    actual_label: str

    feedback: str


@router.post("/feedback")
def submit_feedback(
    request: FeedbackRequest
):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO feedback_logs(
            module,
            prediction,
            actual_label,
            feedback
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            request.module,
            request.prediction,
            request.actual_label,
            request.feedback
        )
    )

    conn.commit()

    conn.close()

    return {
        "status": "success",
        "message": "Feedback stored successfully"
    }