from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "ML API Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Server settings
    PORT: int = 8000
    DEBUG: bool = False
    
    # CORS settings
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Model paths
    MODELS_DIR: str = "./models"
    SPAM_MODEL_PATH: str = "./models/spam_tfidf_logreg.pkl"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
