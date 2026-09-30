import io
import numpy as np
from PIL import Image
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

# ---------------------------------------------------------
# TEXT EMBEDDING MODEL
# ---------------------------------------------------------
_text_model = None

def get_text_model():
    global _text_model
    if _text_model is None:
        print("Loading text embedding model (SBERT)...")
        _text_model = SentenceTransformer("all-MiniLM-L6-v2")
    return _text_model

def get_text_similarity(text1: str, text2: str) -> float:
    if not text1 or not text2:
        return 0.0
    model = get_text_model()
    embeddings = model.encode([text1, text2])
    similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return float(max(0, similarity))

# ---------------------------------------------------------
# IMAGE EMBEDDING MODEL (CLIP)
# ---------------------------------------------------------
_clip_model = None

def get_image_model():
    global _clip_model
    if _clip_model is None:
        print("Loading image embedding model (CLIP)...")
        _clip_model = SentenceTransformer('clip-ViT-B-32')
    return _clip_model

def get_image_embedding(image_bytes: bytes):
    model = get_image_model()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    # For clip models, sentence-transformers can directly encode PIL Images
    return model.encode(image)

def get_image_similarity(img1_bytes: bytes, img2_bytes: bytes) -> float:
    if not img1_bytes or not img2_bytes:
        return 0.0
    try:
        emb1 = get_image_embedding(img1_bytes)
        emb2 = get_image_embedding(img2_bytes)
        visual_similarity = cosine_similarity([emb1], [emb2])[0][0]
        
        print(f"CLIP Image Score: {visual_similarity}")
        return float(max(0, visual_similarity))
    except Exception as e:
        print(f"Error computing CLIP image similarity: {e}")
        return 0.0
