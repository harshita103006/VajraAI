from fastapi import APIRouter
from pydantic import BaseModel

from fraud_app.modules.attachment_shield.service import analyze_attachment

router = APIRouter()

class AttachmentRequest(BaseModel):
    filename: str

@router.post("/analyze-attachment")
def analyze(request: AttachmentRequest):
    return analyze_attachment(request.filename)