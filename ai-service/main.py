from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import uvicorn

from inference import get_text_similarity, get_image_similarity, get_text_model, get_image_model

app = FastAPI(
    title="CampusFind AI Service",
    description="Microservice for multimodal similarity matching using NLP and Vision Models",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since it's internal we can restrict it later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to load models into memory
@app.on_event("startup")
async def startup_event():
    print("Initializing CampusFind AI Service...")
    get_text_model()
    get_image_model()
    print("Models loaded successfully.")

class TextRequest(BaseModel):
    text1: str
    text2: str

class TextSimilarityResponse(BaseModel):
    similarity_score: float

class ImageSimilarityResponse(BaseModel):
    similarity_score: float

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "campusfind-ai-service"}

@app.post("/api/v1/similarity/text", response_model=TextSimilarityResponse)
def compute_text_similarity(payload: TextRequest):
    try:
        score = get_text_similarity(payload.text1, payload.text2)
        return TextSimilarityResponse(similarity_score=score)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/similarity/image", response_model=ImageSimilarityResponse)
async def compute_image_similarity(
    image1: UploadFile = File(...),
    image2: UploadFile = File(...)
):
    try:
        img1_bytes = await image1.read()
        img2_bytes = await image2.read()
        score = get_image_similarity(img1_bytes, img2_bytes)
        return ImageSimilarityResponse(similarity_score=score)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
