from fastapi import APIRouter
from pydantic import BaseModel
from fraud_app.schemas.response_schema import AnalysisResponse
from fraud_app.modules.url_analyzer.service import analyze_url
from fastapi import Depends
from fraud_app.core.security import verify_api_key
from fraud_app.core.limiter import limiter
from fastapi import Request

router = APIRouter()

class URLRequest(BaseModel):
    url: str

@router.post(
    "/analyze-url",
    response_model=AnalysisResponse
)
@limiter.limit("20/minute")
def analyze(
    request: Request,
    payload: URLRequest,
    _: str = Depends(verify_api_key)
):

    return analyze_url(payload.url)