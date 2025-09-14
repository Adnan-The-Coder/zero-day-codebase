# /apps/python-backend/main.py
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from pathlib import Path

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.ml_models import ModelManager
from app.core.logging_config import setup_logging

# Global model manager instance
model_manager = None
#model comment (check)
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global model_manager
    
    # Startup
    setup_logging()
    model_manager = ModelManager()
    await model_manager.load_models()
    
    # Store in app state for access in routes
    app.state.model_manager = model_manager
    
    yield
    
    # Shutdown
    if model_manager:
        await model_manager.cleanup()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ML-powered API with multiple models for classification tasks",
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "ML API Backend",
        "version": settings.VERSION,
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    global model_manager
    return {
        "status": "healthy",
        "models_loaded": len(model_manager.models) if model_manager else 0,
        "available_models": list(model_manager.models.keys()) if model_manager else []
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )

#main.py code