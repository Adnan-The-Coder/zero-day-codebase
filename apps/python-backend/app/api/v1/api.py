from fastapi import APIRouter
# from app.api.v1.endpoints import spam, models
from app.api.v1.endpoints.spam import router as spam
from app.api.v1.endpoints.models import router as models

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(spam, prefix="/spam", tags=["spam"])
api_router.include_router(models, prefix="/models", tags=["models"])
