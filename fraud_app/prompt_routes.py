from fastapi import APIRouter
from pydantic import BaseModel

from fraud_app.modules.prompt_shield.service import analyze_prompt

router = APIRouter()

class PromptRequest(BaseModel):
    prompt: str

@router.post("/analyze-prompt")
def analyze(request: PromptRequest):
    return analyze_prompt(request.prompt)