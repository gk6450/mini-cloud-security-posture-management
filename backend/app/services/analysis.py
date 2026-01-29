from typing import List, Dict, Any
from app.core.logger import logger

def analyze_resources(resources: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    logger.info(f"Analyzing {len(resources)} resources against security policies...")
    
    results = []
    risk_counts = {"High": 0, "Medium": 0, "Low": 0}

    for r in resources:
        metadata = r.get("metadata", {})
        rtype = r.get("type")
        risk = "Low"
        compliance = "Pass"
        reasons = []

        if rtype == "EC2":
            state = metadata.get("State", {}).get("Name", "").lower()
            public_ip = metadata.get("PublicIpAddress")
            network_public = False
            for ni in metadata.get("NetworkInterfaces", []):
                if ni.get("Association", {}).get("PublicIp"):
                    network_public = True
                    break
            is_public = bool(public_ip) or network_public
            
            if state == "running" and is_public:
                risk = "High"
                compliance = "Fail"
                reasons.append("EC2 running and public-facing")
            elif state == "running" and not is_public:
                risk = "Medium"
                reasons.append("EC2 running in private subnet (no public IP)")
            elif state != "running":
                risk = "Low"
                
        elif rtype == "S3":
            enc = metadata.get("Encryption") is True
            public = metadata.get("Public") is True
            logging = metadata.get("Logging") is True
            versioning = metadata.get("Versioning") is True
            if not enc:
                reasons.append("SSE disabled")
            if public:
                reasons.append("Bucket is public")
            if not logging:
                reasons.append("Server access logging disabled")
            if not versioning:
                reasons.append("Versioning disabled")
            if reasons:
                risk = "High"
                compliance = "Fail"
        
        risk_counts[risk] = risk_counts.get(risk, 0) + 1

        results.append({
            "id": r.get("id"),
            "name": r.get("name"),
            "type": r.get("type"),
            "risk": risk,
            "compliance": compliance,
            "reasons": reasons,
            "metadata": metadata
        })
    
    logger.info(f"Analysis Complete. Risk Summary: {risk_counts}")
    return results