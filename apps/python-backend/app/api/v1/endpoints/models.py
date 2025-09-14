from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class ModelInfo(BaseModel):
    loaded_models: int
    available_models: Dict[str, str]

@router.get("/info", response_model=ModelInfo)
async def get_models_info(request: Request):
    """Get information about all loaded models"""
    try:
        model_manager = request.app.state.model_manager
        info = await model_manager.get_model_info()
        
        return ModelInfo(**info)
        
    except Exception as e:
        logger.error(f"Error getting model info: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving model information")

@router.get("/health")
async def models_health_check(request: Request):
    """Health check for models"""
    try:
        model_manager = request.app.state.model_manager
        info = await model_manager.get_model_info()
        
        return {
            "status": "healthy" if info["loaded_models"] > 0 else "no_models",
            "loaded_models": info["loaded_models"],
            "models": list(info["available_models"].keys())
        }
        
    except Exception as e:
        logger.error(f"Model health check error: {str(e)}")
        raise HTTPException(status_code=500, detail="Model health check failed")