from pydantic import BaseModel
from typing import List, Dict, Any


class AnalysisResponse(BaseModel):

    module: str

    risk_score: int

    risk_level: str

    flags: List[str]

    explanations: List[Dict[str, str]]

    metadata: Dict[str, Any]