from fastapi import (
    APIRouter,
    UploadFile,
    File
)

from fraud_app.modules.attachment_shield.service import (
    analyze_attachment
)

router = APIRouter()

@router.post("/analyze-attachment")
async def analyze(
    file: UploadFile = File(...)
):

    contents = await file.read()

    result = analyze_attachment(
        file.filename
    )

    return {
        "filename": file.filename,
        "size": len(contents),
        "analysis": result
    }