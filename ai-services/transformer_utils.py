from fastapi import Form, HTTPException
from sentence_transformers import SentenceTransformer
from PIL import Image
import io

import numpy as np

model = None
CACHED_ANCHOR_GLOBAL = None
CACHED_ANCHOR_SPECIFIC = None
CACHED_BACKGROUND_EMBEDDING = None

model = None

def load_model():
    global model
    if (model is None):
        model = SentenceTransformer('clip-ViT-B-32', device='cpu')
    return model

def normalize(vector):
    norm = np.linalg.norm(vector)
    if (norm == 0):
        return vector
    return vector / norm

def load_anchors(model):
    global CACHED_ANCHOR_GLOBAL, CACHED_ANCHOR_SPECIFIC, CACHED_BACKGROUND_EMBEDDING

    text_global = "A wide angle view of a full scene, a whole person, or an entire environment."
    text_specific = "A macro close-up detail, a specific body part, texture, color, or isolated object."
    text_background = "A blurry, out-of-focus, low-quality image with messy clutter and bad composition."

    vec_global = model.encode(text_global)
    vec_specific = model.encode(text_specific)

    CACHED_ANCHOR_GLOBAL = normalize(vec_global)
    CACHED_ANCHOR_SPECIFIC = normalize(vec_specific)
    CACHED_BACKGROUND_EMBEDDING = normalize(model.encode(text_background))
    return

def check_user_intent(query_vector):
    
    score_global = np.dot(query_vector, CACHED_ANCHOR_GLOBAL)
    score_specific = np.dot(query_vector, CACHED_ANCHOR_SPECIFIC)

    if (score_global > score_specific):
        return "GLOBAL"
    else:
        return "SPECIFIC"

async def embed (
    image_data=None,
    text: str = Form(None),
):
    if text is None and image_data is None:
        raise HTTPException(status_code=400, detail="No text or file provided")
    
    try:
        refined_embedding = None
        if text:
            print("Embedding textd...")
            embedding = normalize(np.array(model.encode(text), dtype = np.float32))
            specific_embedding = normalize(np.array(model.encode(f"A high-quality, sharp, focused, well-lit photo of {text}."), dtype = np.float32))
            background_embedding = normalize(np.array(CACHED_BACKGROUND_EMBEDDING, dtype = np.float32))
            
            if (check_user_intent(embedding) == "GLOBAL"):
                refined_embedding = embedding + (0.8) * specific_embedding
            else:
                refined_embedding = embedding + (0.8) * specific_embedding - (0.5) * background_embedding

        elif image_data:
            print("Embedding image...")
            image = Image.open(io.BytesIO(image_data)).convert("RGB")
            refined_embedding = np.array(model.encode(image), dtype = np.float32)
        print("Image embedded successfully")

        return normalize(refined_embedding)

    except Exception as e:
        print(f"Error {e}")
        raise HTTPException(status_code=500, detail=str(e))


