import io
import numpy as np
from PIL import Image
from sklearn.metrics.pairwise import cosine_similarity
import torch
import torch.nn as nn
from torchvision import models, transforms
from sentence_transformers import SentenceTransformer

# ---------------------------------------------------------
# TEXT EMBEDDING MODEL
# ---------------------------------------------------------
# Using a small and fast pretrained model for sentence embeddings
_text_model = None

def get_text_model():
    global _text_model
    if _text_model is None:
        print("Loading text embedding model...")
        _text_model = SentenceTransformer("all-MiniLM-L6-v2")
    return _text_model

def get_text_similarity(text1: str, text2: str) -> float:
    if not text1 or not text2:
        return 0.0
    model = get_text_model()
    embeddings = model.encode([text1, text2])
    # Compute cosine similarity
    similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    # Ensure value is between 0 and 1
    return float(max(0, similarity))

# ---------------------------------------------------------
# IMAGE EMBEDDING MODEL
# ---------------------------------------------------------
# Using ResNet50 for image feature extraction
_image_model = None
_image_preprocess = None

def get_image_model():
    global _image_model, _image_preprocess
    if _image_model is None:
        print("Loading image embedding model...")
        weights = models.ResNet50_Weights.DEFAULT
        _image_model = models.resnet50(weights=weights)
        _image_model = nn.Sequential(*list(_image_model.children())[:-1]) # Remove classification layer
        _image_model.eval()
        _image_preprocess = weights.transforms()
    return _image_model, _image_preprocess

def get_image_embedding(image_bytes: bytes) -> np.ndarray:
    model, preprocess = get_image_model()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = preprocess(image).unsqueeze(0)
    with torch.no_grad():
        features = model(tensor)
    return features.squeeze().numpy()

def get_image_similarity(img1_bytes: bytes, img2_bytes: bytes) -> float:
    if not img1_bytes or not img2_bytes:
        return 0.0
    try:
        emb1 = get_image_embedding(img1_bytes)
        emb2 = get_image_embedding(img2_bytes)
        similarity = cosine_similarity([emb1], [emb2])[0][0]
        return float(max(0, similarity))
    except Exception as e:
        print(f"Error computing image similarity: {e}")
        return 0.0
