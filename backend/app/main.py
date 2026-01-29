from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logger import setup_logging, logger
from app.api.v1.scan import router as scan_router

# Lifecycle handler to setup logging on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.info("Application startup: Logging initialized.")
    yield
    logger.info("Application shutdown.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(scan_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    logger.debug("Health check endpoint called.")
    return {"service": "mini-cspm-backend", "status": "operational"}