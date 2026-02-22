from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uuid
from redis_utils import save_item, create_index, vector_search, search_by_filename, delete_item, page_lookup
from transformer_utils import embed, load_model, load_anchors
from fastapi.staticfiles import StaticFiles
import os, pathlib

@asynccontextmanager
async def startup_event(app: FastAPI):
    try:
        model = load_model()
        load_anchors(model)

        await create_index()
    except Exception as e:
        print(f"Error in loading the CLIP model and/or creating the index. Is Redis Stack running? {e}")
    yield

app = FastAPI(lifespan=startup_event)

BASE_DIR = pathlib.Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
if (not os.path.exists("uploads")):
    os.makedirs("uploads")
app.mount("/images", StaticFiles(directory="uploads"), name="images")
@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    try:
        original_name = os.path.basename(file.filename)
        ext = os.path.splitext(original_name)[1].lower()    
        item_id = str(uuid.uuid4())
        stored_name = f"{item_id}{ext}"
        file_data = await file.read()

        embedding = await embed(file_data, None)

        await save_item(item_id, original_name, embedding, stored_name)

        path = os.path.join(UPLOAD_DIR, stored_name)
        with open(path, "wb") as buffer:
            buffer.write(file_data)
        
        return {"message": "success", "id": item_id, "filename": original_name}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/pages")
async def search_page(page: int = 0):
    try:
        results = await page_lookup(page)
        output = []
        for doc in results.docs:
            output.append({
                "id": doc.id,
                "filename": doc.filename,
                "imageUrl": f"/images/{doc.stored_name}",
                "created_at": doc.created_at,
                "stored_name": doc.stored_name,
            })
        return {"results": output}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search")
async def search(q: str, isFileName: bool):
    try:
        print("returning results")
        result = None
        if (isFileName is True):
            result = await search_by_filename(q)
        else:
            query_vectors = await embed(None, q)
            result = await vector_search(query_vectors)

        if (result is None):
            raise HTTPException(status_code=404, detail="No matching files")
        output = []
        for doc in result.docs:

            if (1-float(doc.score) < .25):
                continue
            output.append({
                "id": doc.id,
                "filename": doc.filename,
                "stored_name": doc.stored_name,
                "score": 1 - float(doc.score),
                "imageUrl": f"/images/{doc.stored_name}"
            })
        images_url = [item["imageUrl"] for item in output]
        return {"results": output, "images": images_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.delete("/delete/{stored_filename}")
async def delete(stored_filename: str):
    try:
        item_id = stored_filename.split(".")[0]
        await delete_item(item_id)
        upload_path = UPLOAD_DIR / stored_filename
        if (upload_path.exists() == False):
            raise HTTPException(status_code=404, detail="File cannot be deleted because it does not exist")
        os.remove(upload_path)
        return {"message": "Image deleted successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)