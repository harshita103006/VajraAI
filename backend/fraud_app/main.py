from fastapi import FastAPI
from pydantic import BaseModel
from fraud_app.modules.email_analyzer.service import analyze_email
from fastapi.middleware.cors import CORSMiddleware
from fraud_app.url_routes import router as url_router
from fraud_app.prompt_routes import router as prompt_router
from fraud_app.attachment_routes import router as attachment_router
from fraud_app.core.db import initialize_database
from fraud_app.threat_routes import router as threat_router
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi.responses import JSONResponse
from fraud_app.core.limiter import limiter
from fraud_app.feedback_routes import router as feedback_router

app = FastAPI(title="Fraud Email Analyzer MVP")

app.state.limiter = limiter

initialize_database()

@app.exception_handler(
    RateLimitExceeded
)
async def rate_limit_handler(
    request,
    exc
):

    return JSONResponse(
        status_code=429,
        content={
            "status": "error",
            "message": "Rate limit exceeded"
        }
    )

app.include_router(url_router)
app.include_router(prompt_router)
app.include_router(attachment_router)
app.include_router(threat_router)
app.include_router(feedback_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailIn(BaseModel):
    subject: str
    body: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze/email")
def analyze(payload: EmailIn):
    return analyze_email(payload.subject, payload.body)
