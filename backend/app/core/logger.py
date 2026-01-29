import logging
import sys
from app.core.config import settings

def setup_logging():
    """
    Configure the root logger to output to stdout.
    This ensures logs are captured by container runtimes (Docker/AWS).
    """
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    handler.setFormatter(formatter)
    
    # Remove existing handlers to avoid duplicates (e.g. uvicorn's default)
    if logger.hasHandlers():
        logger.handlers.clear()
        
    logger.addHandler(handler)

    # Set specific log levels for noisy libraries if needed
    logging.getLogger("boto3").setLevel(logging.CRITICAL)
    logging.getLogger("botocore").setLevel(logging.CRITICAL)

    return logger

# Create a module-level logger instance
logger = logging.getLogger(settings.PROJECT_NAME)