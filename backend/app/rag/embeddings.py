import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from typing import List
import numpy as np
from sentence_transformers import SentenceTransformer
from app.core.config import settings

_model = None

def get_embedding_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
    return _model

def embed_texts(texts: List[str]) -> np.ndarray:
    """
    Generates normalized float32 embeddings for a list of texts.
    """
    if not texts:
        return np.empty((0, 384), dtype=np.float32)
    model = get_embedding_model()
    embeddings = model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
    return embeddings.astype(np.float32)

def embed_query(query: str) -> np.ndarray:
    """
    Generates a normalized float32 embedding for a single query string.
    """
    model = get_embedding_model()
    embedding = model.encode([query], convert_to_numpy=True, normalize_embeddings=True)
    return embedding.astype(np.float32)
