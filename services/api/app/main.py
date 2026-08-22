from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time
import logging
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.router import api_v1_router

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("incorvo_reach")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables on startup
    logger.info("Initializing database schema...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database schema initialized successfully.")
    yield
    logger.info("Shutting down application...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Incorvo Reach - Verified Actions. Measurable Growth. Enterprise Two-Sided Action Marketplace.",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_correlation_and_audit_headers(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    response.headers["X-Powered-By"] = "Incorvo Reach / Quenix Analytics"
    return response

app.include_router(api_v1_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "platform": settings.APP_NAME,
        "tagline": "Verified Actions. Measurable Growth.",
        "parent_company": settings.PARENT_COMPANY,
        "api_documentation": "/docs",
        "api_v1": settings.API_V1_STR
    }
