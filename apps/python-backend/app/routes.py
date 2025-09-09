from fastapi import APIRouter
from app.ml_model import predict

router = APIRouter()

@router.post("/predict")
async def make_prediction(data: dict):
    result = predict(data)
    return {"prediction": result}
