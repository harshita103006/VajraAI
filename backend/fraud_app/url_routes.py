from fastapi import APIRouter
from pydantic import BaseModel
from fraud_app.schemas.response_schema import AnalysisResponse
from fraud_app.modules.url_analyzer.service import analyze_url

router = APIRouter()

class URLRequest(BaseModel):
    url: str

@router.post(
    "/analyze-url",
    response_model=AnalysisResponse
)
def analyze(request: URLRequest):
    return analyze_url(request.url)