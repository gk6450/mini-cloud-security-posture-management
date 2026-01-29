from app.services.analysis import analyze_resources

def test_ec2_high_risk():
    resources = [
        {"id":"i-1","name":"web","type":"EC2","metadata":{"InstanceId":"i-1","State":{"Name":"running"},"PublicIpAddress":"1.2.3.4","NetworkInterfaces":[]}}
    ]
    out = analyze_resources(resources)
    assert out[0]["risk"] == "High"
    assert "EC2 running and public-facing" in out[0]["reasons"]

def test_s3_high_risk():
    resources = [
        {"id":"b-1","name":"public","type":"S3","metadata":{"Name":"b-1","Encryption":False,"Public":True,"Logging":False,"Versioning":False}}
    ]
    out = analyze_resources(resources)
    assert out[0]["risk"] == "High"
    assert any("SSE disabled" in r or "Bucket is public" in r for r in out[0]["reasons"])