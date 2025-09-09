from fastapi import FastAPI
from app.routes import router

app = FastAPI(title="Zero Day AI Backend")

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Zero Day codebase AI Backend Running 🚀"}
