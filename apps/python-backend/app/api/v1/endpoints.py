# from fastapi import APIRouter, HTTPException, Request
# from pydantic import BaseModel
# from typing import Optional
# import logging

# logger = logging.getLogger(__name__)

# router = APIRouter()

# class SpamClassificationRequest(BaseModel):
#     text: str
#     model_name: Optional[str] = "spam_classifier"

# class SpamClassificationResponse(BaseModel):
#     prediction: int
#     probabilities: Optional[list] = None
#     confidence: Optional[float] = None
#     model_used: str
#     model_description: str
#     is_spam: bool

# @router.post("/classify", response_model=SpamClassificationResponse)
# async def classify_spam(request: SpamClassificationRequest, fastapi_request: Request):
#     """
#     Classify text as spam/phishing (1) or not spam (0)
    
#     - **text**: The email or message text to classify
#     - **model_name**: Optional model name to use (default: spam_classifier)
#     """
#     try:
#         model_manager = fastapi_request.app.state.model_manager
        
#         if not request.text.strip():
#             raise HTTPException(status_code=400, detail="Text cannot be empty")
        
#         # Make prediction
#         result = await model_manager.predict(request.model_name, request.text)
        
#         # Calculate confidence if probabilities available
#         confidence = None
#         if result["probabilities"]:
#             confidence = max(result["probabilities"])
        
#         return SpamClassificationResponse(
#             prediction=result["prediction"],
#             probabilities=result["probabilities"],
#             confidence=confidence,
#             model_used=result["model_used"],
#             model_description=result["model_description"],
#             is_spam=bool(result["prediction"])
#         )
        
#     except ValueError as e:
#         raise HTTPException(status_code=404, detail=str(e))
#     except Exception as e:
#         logger.error(f"Classification error: {str(e)}")
#         raise HTTPException(status_code=500, detail="Internal server error during classification")

# @router.get("/models")
# async def list_spam_models(request: Request):
#     """List available spam classification models"""
#     try:
#         model_manager = request.app.state.model_manager
#         info = await model_manager.get_model_info()
        
#         # Filter for spam-related models
#         spam_models = {
#             name: desc for name, desc in info["available_models"].items()
#             if "spam" in name.lower() or "phishing" in desc.lower()
#         }
        
#         return {
#             "spam_models": spam_models,
#             "total_models": len(spam_models)
#         }
        
#     except Exception as e:
#         logger.error(f"Error listing models: {str(e)}")
#         raise HTTPException(status_code=500, detail="Error retrieving model information")
