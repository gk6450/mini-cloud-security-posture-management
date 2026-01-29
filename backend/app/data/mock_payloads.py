"""
Static mock data for simulation mode.
"""

MOCK_EC2_INSTANCES = [
    {"InstanceId":"i-mock-run-001","Name":"mock-web-1","State":{"Name":"running"},"PublicIpAddress":"3.3.3.10","NetworkInterfaces":[],"SubnetId":"subnet-public-01"},
    {"InstanceId":"i-mock-run-002","Name":"mock-web-2","State":{"Name":"running"},"PublicIpAddress":"3.3.3.11","NetworkInterfaces":[],"SubnetId":"subnet-public-01"},
    {"InstanceId":"i-mock-run-003","Name":"mock-app-1","State":{"Name":"running"},"PublicIpAddress":None,"NetworkInterfaces":[{"Association":{}}],"SubnetId":"subnet-private-01"},
    {"InstanceId":"i-mock-stopped-001","Name":"mock-db-1","State":{"Name":"stopped"},"PublicIpAddress":None,"NetworkInterfaces":[],"SubnetId":"subnet-private-02"},
    {"InstanceId":"i-mock-run-004","Name":"mock-api-1","State":{"Name":"running"},"PublicIpAddress":None,"NetworkInterfaces":[{"Association":{"PublicIp":"18.18.18.18"}}],"SubnetId":"subnet-public-02"},
    {"InstanceId":"i-mock-run-005","Name":None,"State":{"Name":"running"},"PublicIpAddress":"18.18.18.19","NetworkInterfaces":[],"SubnetId":"subnet-public-03"},
    {"InstanceId":"i-mock-run-006","Name":"mock-batch-1","State":{"Name":"running"},"PublicIpAddress":None,"NetworkInterfaces":[],"SubnetId":"subnet-private-03"},
    {"InstanceId":"i-mock-run-007","Name":"mock-cache-1","State":{"Name":"running"},"PublicIpAddress":"52.52.52.52","NetworkInterfaces":[],"SubnetId":"subnet-public-04"},
]

MOCK_S3_BUCKETS = [
    {"Name":"mock-public-bucket-1","Encryption":False,"Public":True,"Logging":False,"Versioning":False},
    {"Name":"mock-public-bucket-2","Encryption":False,"Public":True,"Logging":True,"Versioning":False},
    {"Name":"mock-secure-bucket-1","Encryption":True,"Public":False,"Logging":True,"Versioning":True},
    {"Name":"mock-internal-bucket","Encryption":True,"Public":False,"Logging":False,"Versioning":False},
    {"Name":"mock-logs-bucket","Encryption":True,"Public":False,"Logging":True,"Versioning":False},
    {"Name":"mock-archive-bucket","Encryption":False,"Public":False,"Logging":False,"Versioning":False},
]