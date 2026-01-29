from fastapi import APIRouter, HTTPException, Depends
from typing import Union

from app.schemas.scan import ScanRequest, ScanResponse
from app.services.aws_client import MockAWSClient, RealAWSClient, AWSClientError
from app.services.analysis import analyze_resources
from app.core.logger import logger

router = APIRouter()

def get_aws_client(req: ScanRequest) -> Union[MockAWSClient, RealAWSClient]:
    """Dependency to resolve the correct AWS client based on mode."""
    mode = req.mode.lower()
    
    if mode == "mock":
        logger.info("Mode is 'mock'. Using MockAWSClient.")
        return MockAWSClient()
        
    if mode == "real":
        logger.info("Mode is 'real'. validating credentials...")
        if not req.access_key_id.strip() or not req.secret_access_key.strip() or not req.region.strip():
            logger.warning("Missing credentials for real scan mode.")
            raise HTTPException(
                status_code=400, 
                detail="For mode='real' provide non-empty access_key_id, secret_access_key and region."
            )
        try:
            return RealAWSClient(
                access_key=req.access_key_id.strip(),
                secret_key=req.secret_access_key.strip(),
                region=req.region.strip(),
            )
        except AWSClientError as e:
            logger.error(f"Failed to initialize RealAWSClient: {e}")
            raise HTTPException(status_code=401, detail=str(e))
            
    logger.error(f"Invalid mode requested: {mode}")
    raise HTTPException(status_code=400, detail="mode must be 'mock' or 'real'")

@router.post("/scan", response_model=ScanResponse)
def scan(req: ScanRequest):
    """
    Run a security scan.
    """
    logger.info(f"Received Scan Request. Region: {req.region}, Mode: {req.mode}")

    # 1. Get Client (Mock or Real)
    client = get_aws_client(req)

    # 2. Fetch Data
    try:
        ec2s = client.list_ec2_instances()
        s3s = client.list_s3_buckets()
    except AWSClientError as e:
        logger.error(f"Scan aborted due to AWS Error: {e}")
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        logger.critical(f"Unexpected internal error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")

    # 3. Normalize Data
    resources = []
    for inst in ec2s:
        resources.append({
            "id": inst.get("InstanceId"),
            "name": inst.get("Name") or inst.get("InstanceId"),
            "type": "EC2",
            "metadata": inst
        })
    for bucket in s3s:
        resources.append({
            "id": bucket.get("Name"),
            "name": bucket.get("Name"),
            "type": "S3",
            "metadata": bucket
        })

    # 4. Analyze
    analyzed = analyze_resources(resources)

    return {
        "total": len(analyzed), 
        "resources": analyzed, 
        "mode": req.mode
    }