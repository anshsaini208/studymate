import os
# Ensure OpenMP runtime doesn't collide on Windows
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models.schemas import HealthResponse
from app.api import upload, chat
from app.rag.embeddings import get_embedding_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Preload embedding model on startup so initial document uploads don't trigger a 60s timeout
    try:
        print("[StudyMate] Preloading sentence-transformers embedding model...")
        get_embedding_model()
        print("[StudyMate] Embedding model ready!")
    except Exception as e:
        print(f"[StudyMate] Warning: Failed to pre-warm embedding model: {e}")
    yield

app = FastAPI(
    title="StudyMate API",
    description="Backend API for StudyMate RAG application",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
# When allow_credentials=True, standard browsers reject allow_origins=["*"].
# We allow FRONTEND_URL, standard localhost ports, and allow regex for deployed frontends.
origins = [
    origin.strip()
    for origin in [
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    if origin and origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_origin_regex=r"https?://.*" if not origins else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(upload.router)
app.include_router(chat.router)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        service="StudyMate API"
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
