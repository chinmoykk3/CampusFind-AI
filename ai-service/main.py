from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import uvicorn
import urllib.request
import urllib.error

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

class ImageUrlRequest(BaseModel):
    url1: str
    url2: str

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

@app.post("/api/v1/similarity/image-urls", response_model=ImageSimilarityResponse)
def compute_image_similarity_from_urls(payload: ImageUrlRequest):
    try:
        def fetch_image(url: str) -> bytes:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            try:
                with urllib.request.urlopen(req, timeout=10) as response:
                    return response.read()
            except urllib.error.URLError:
                return None

        import os
        backend_url = os.environ.get("BACKEND_URL", "http://localhost:5000")
        url1 = f"{backend_url}{payload.url1}" if payload.url1.startswith("/uploads") else payload.url1
        url2 = f"{backend_url}{payload.url2}" if payload.url2.startswith("/uploads") else payload.url2

        bytes1 = fetch_image(url1)
        bytes2 = fetch_image(url2)

        if not bytes1 or not bytes2:
            return ImageSimilarityResponse(similarity_score=0.0)

        score = get_image_similarity(bytes1, bytes2)
        return ImageSimilarityResponse(similarity_score=score)
    except Exception as e:
        print(f"URL image compute error: {e}")
        return ImageSimilarityResponse(similarity_score=0.0)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
