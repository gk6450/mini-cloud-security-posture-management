import boto3
from botocore.exceptions import ClientError, NoCredentialsError, EndpointConnectionError
from typing import List, Dict, Any
from app.core.logger import logger
from app.data.mock_payloads import MOCK_EC2_INSTANCES, MOCK_S3_BUCKETS

class AWSClientError(Exception):
    pass

class MockAWSClient:
    """Richer realistic mocks for EC2 and S3 to help UI testing."""
    def list_ec2_instances(self) -> List[Dict[str, Any]]:
        logger.info(f"Returning {len(MOCK_EC2_INSTANCES)} mock EC2 instances")
        return MOCK_EC2_INSTANCES

    def list_s3_buckets(self) -> List[Dict[str, Any]]:
        logger.info(f"Returning {len(MOCK_S3_BUCKETS)} mock S3 buckets")
        return MOCK_S3_BUCKETS

class RealAWSClient:
    """Real AWS client using boto3; credentials are used in-memory and not stored."""
    def __init__(self, access_key: str, secret_key: str, region: str = "us-east-1"):
        if not access_key or not secret_key:
            logger.error("Attempted to initialize RealAWSClient without credentials")
            raise AWSClientError("Missing AWS credentials")

        self.session = boto3.Session(
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )
        self.region = region

        # lightweight credential check
        try:
            logger.info(f"Authenticating with AWS in region {region}...")
            sts = self.session.client("sts")
            identity = sts.get_caller_identity()
            logger.info(f"AWS Auth Success. Account: {identity.get('Account')}")
        except NoCredentialsError as e:
            logger.error("Invalid AWS Credentials provided")
            raise AWSClientError("Invalid AWS credentials") from e
        except ClientError as e:
            logger.error(f"AWS Client Error during auth: {e}")
            raise AWSClientError(f"AWS client error: {e}") from e
        except EndpointConnectionError as e:
            logger.error(f"Network error connecting to AWS: {e}")
            raise AWSClientError(f"Network/endpoint error: {e}") from e

    def list_ec2_instances(self) -> List[Dict[str, Any]]:
        logger.info("Fetching EC2 instances from AWS...")
        ec2 = self.session.client("ec2", region_name=self.region)
        items = []

        try:
            paginator = ec2.get_paginator("describe_instances")
            for page in paginator.paginate():
                for res in page.get("Reservations", []):
                    for inst in res.get("Instances", []):
                        items.append({
                            "InstanceId": inst.get("InstanceId"),
                            "Name": self._extract_name_tag(inst.get("Tags", [])),
                            "State": inst.get("State"),
                            "PublicIpAddress": inst.get("PublicIpAddress"),
                            "NetworkInterfaces": inst.get("NetworkInterfaces", []),
                            "SubnetId": inst.get("SubnetId"),
                        })
            logger.info(f"Successfully fetched {len(items)} EC2 instances")
        except ClientError as e:
            logger.error(f"Failed to fetch EC2 instances: {e}")
            raise AWSClientError(f"EC2 error: {e}") from e

        return items

    def list_s3_buckets(self) -> List[Dict[str, Any]]:
        logger.info("Fetching S3 buckets and security policies...")
        s3 = self.session.client("s3")
        items = []

        try:
            resp = s3.list_buckets()
            all_buckets = resp.get("Buckets", [])
            logger.info(f"Found {len(all_buckets)} buckets. Analyzing configurations...")
            
            for b in all_buckets:
                name = b["Name"]
                bucket_meta: Dict[str, Any] = {"Name": name}

                # --- Encryption ---
                try:
                    s3.get_bucket_encryption(Bucket=name)
                    bucket_meta["Encryption"] = True
                except ClientError:
                    bucket_meta["Encryption"] = False

                # --- Public Access Block ---
                try:
                    pab = s3.get_public_access_block(Bucket=name)
                    bucket_meta["PublicAccessBlock"] = pab.get("PublicAccessBlockConfiguration", {})
                except ClientError:
                    bucket_meta["PublicAccessBlock"] = {}

                # --- PUBLIC DETECTION ---
                public = False
                try:
                    status = s3.get_bucket_policy_status(Bucket=name)
                    public = status.get("PolicyStatus", {}).get("IsPublic", False)
                except ClientError:
                    public = False

                if not public:
                    try:
                        acl = s3.get_bucket_acl(Bucket=name)
                        for g in acl.get("Grants", []):
                            uri = g.get("Grantee", {}).get("URI", "")
                            if uri and ("AllUsers" in uri or "AuthenticatedUsers" in uri):
                                public = True
                                break
                    except ClientError:
                        pass

                bucket_meta["Public"] = public

                # --- Logging ---
                try:
                    logging = s3.get_bucket_logging(Bucket=name)
                    bucket_meta["Logging"] = bool(logging.get("LoggingEnabled"))
                except ClientError:
                    bucket_meta["Logging"] = False

                # --- Versioning ---
                try:
                    version = s3.get_bucket_versioning(Bucket=name)
                    bucket_meta["Versioning"] = version.get("Status") == "Enabled"
                except ClientError:
                    bucket_meta["Versioning"] = False

                items.append(bucket_meta)
            
            logger.info("S3 analysis complete.")

        except ClientError as e:
            logger.error(f"S3 Scan failed: {e}")
            raise AWSClientError(f"S3 error: {e}") from e

        return items

    @staticmethod
    def _extract_name_tag(tags):
        if not tags:
            return None
        for t in tags:
            if t.get("Key") == "Name":
                return t.get("Value")
        return None