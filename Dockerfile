FROM node:20 AS frontend-builder
WORKDIR /app/client
COPY client/package*json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    libjpeg-dev \  
    zlib1g-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY ai-services/requirement.txt .
RUN pip install --no-cache-dir -r requirement.txt

COPY ai-serviecs/ ./ai-services/

COPY --from=frontend-builder /app/client/dist ./client/dist

RUN useradd -m -u 1000 user
USER user 
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR /app/ai-services

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
