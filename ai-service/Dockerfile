FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Preload the ML models during image compilation so boot time is instant!
RUN python -c "from inference import get_text_model, get_image_model; get_text_model(); get_image_model()"

EXPOSE 8000

CMD ["python", "main.py"]
