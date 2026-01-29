from pydantic import BaseModel, Field
from typing import Literal, List, Dict, Any, Optional

class ScanRequest(BaseModel):
    access_key_id: str = Field(..., description="AWS Access Key ID", examples=["AKIA..."])
    secret_access_key: str = Field(..., description="AWS Secret Access Key", examples=["wJalrXU..."])
    region: str = Field(..., description="Target AWS Region", examples=["us-east-1"])
    mode: Literal["mock", "real"] = Field("mock", description="Scan mode")

class ResourceModel(BaseModel):
    id: Optional[str]
    name: Optional[str]
    type: str
    risk: str
    compliance: str
    reasons: List[str]
    metadata: Dict[str, Any]

class ScanResponse(BaseModel):
    total: int
    mode: str
    resources: List[ResourceModel]