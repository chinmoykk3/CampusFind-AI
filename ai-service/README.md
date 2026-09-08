# CampusFind AI Service

This microservice provides AI-powered similarity matching using NLP (Sentence Embeddings) and Computer Vision (Image Feature Extraction). It exposes a FastAPI server that the Node.js backend can communicate with for producing advanced multimodal matching scores.

## Setup Instructions

1. **Prerequisites**: Ensure you have Python 3.9+ installed and added to your system PATH.
2. **Create a Virtual Environment**:

   ```sh
   python -m venv venv
   ```

3. **Activate Environment**:
   - On Windows: `venv\Scripts\activate`
   - On Mac/Linux: `source venv/bin/activate`
4. **Install Dependencies**:

   ```sh
   pip install -r requirements.txt
   ```

## Running the Service

Start the FastAPI server on port 8000:

```sh
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

> **Note**: On the first run, the pre-trained NLP and Vision models (`all-MiniLM-L6-v2` and `ResNet50`) will be downloaded. This might take a minute or two depending on your connection.

## Endpoints

- **`GET /health`** - Verification that the service is running.
- **`POST /api/v1/similarity/text`** - Compute cosine similarity score between two texts.
- **`POST /api/v1/similarity/image`** - Compute cosine similarity score between two images.

## Integration with Node.js

When updating the express backend, you can make HTTP requests to `http://localhost:8000/api/v1/similarity/text` to replace Jaccard similarity with these advanced semantic scores.
