import joblib
import logging
import os
import asyncio
from pathlib import Path
from typing import Dict, Any, List
from sklearn.base import BaseEstimator
import numpy as np

logger = logging.getLogger(__name__)

class ModelManager:
    """Manages loading and inference of ML models"""
    
    def __init__(self):
        self.models: Dict[str, BaseEstimator] = {}
        self.model_configs = {
            "spam_classifier": {
                "path": "./models/spam_tfidf_logreg.pkl",
                "type": "sklearn",
                "description": "Email spam/phishing classifier using TF-IDF and Logistic Regression"
            }
            # Add more models here as needed
        }
    
    async def load_models(self):
        """Load all available models"""
        logger.info("Loading ML models...")
        
        for model_name, config in self.model_configs.items():
            try:
                await self._load_model(model_name, config)
            except Exception as e:
                logger.error(f"Failed to load model {model_name}: {str(e)}")
        
        logger.info(f"Loaded {len(self.models)} models successfully")
    
    async def _load_model(self, model_name: str, config: Dict[str, Any]):
        """Load a single model"""
        model_path = config["path"]
        
        if not os.path.exists(model_path):
            logger.warning(f"Model file not found: {model_path}")
            return
        
        try:
            # Load model in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            model = await loop.run_in_executor(None, joblib.load, model_path)
            
            self.models[model_name] = {
                "model": model,
                "config": config
            }
            
            logger.info(f"Successfully loaded model: {model_name}")
            
        except Exception as e:
            logger.error(f"Error loading model {model_name}: {str(e)}")
            raise
    
    async def predict(self, model_name: str, input_data: Any) -> Dict[str, Any]:
        """Make prediction using specified model"""
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found")
        
        try:
            model_info = self.models[model_name]
            model = model_info["model"]
            
            # Run prediction in thread pool
            loop = asyncio.get_event_loop()
            
            if isinstance(input_data, str):
                input_data = [input_data]
            
            prediction = await loop.run_in_executor(None, model.predict, input_data)
            
            # Get prediction probabilities if available
            probabilities = None
            if hasattr(model, 'predict_proba'):
                probabilities = await loop.run_in_executor(None, model.predict_proba, input_data)
                probabilities = probabilities[0].tolist()  # Convert to list for JSON serialization
            
            return {
                "prediction": int(prediction[0]),
                "probabilities": probabilities,
                "model_used": model_name,
                "model_description": model_info["config"]["description"]
            }
            
        except Exception as e:
            logger.error(f"Prediction error for model {model_name}: {str(e)}")
            raise
    
    async def get_model_info(self) -> Dict[str, Any]:
        """Get information about loaded models"""
        return {
            "loaded_models": len(self.models),
            "available_models": {
                name: info["config"]["description"] 
                for name, info in self.models.items()
            }
        }
    
    async def cleanup(self):
        """Cleanup resources"""
        logger.info("Cleaning up model manager...")
        self.models.clear()
