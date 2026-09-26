import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import faiss
import numpy as np
from typing import List, Dict, Any, Optional

class DocumentIndex:
    def __init__(self, document_id: str, filename: str, pages_count: int, dimension: int = 384):
        self.document_id = document_id
        self.filename = filename
        self.pages_count = pages_count
        self.dimension = dimension
        self.index = faiss.IndexFlatIP(dimension)
        self.chunks: List[Dict[str, Any]] = []

    def add_chunks(self, chunks: List[Dict[str, Any]], embeddings: np.ndarray):
        if len(chunks) == 0:
            return
        if embeddings.shape[0] != len(chunks):
            raise ValueError(f"Mismatch: {embeddings.shape[0]} embeddings vs {len(chunks)} chunks")
        self.index.add(embeddings)
        self.chunks.extend(chunks)

    def search(self, query_embedding: np.ndarray, top_k: int = 5, threshold: float = 0.0) -> List[Dict[str, Any]]:
        if self.index.ntotal == 0:
            return []
        
        k = min(top_k, self.index.ntotal)
        scores, indices = self.index.search(query_embedding, k)

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0 or idx >= len(self.chunks):
                continue
            if score >= threshold:
                chunk_copy = dict(self.chunks[idx])
                chunk_copy["score"] = float(score)
                results.append(chunk_copy)

        return results

class VectorStoreManager:
    def __init__(self):
        self._stores: Dict[str, DocumentIndex] = {}

    def create_document_index(
        self,
        document_id: str,
        filename: str,
        pages_count: int,
        chunks: List[Dict[str, Any]],
        embeddings: np.ndarray
    ) -> DocumentIndex:
        dimension = embeddings.shape[1] if embeddings.shape[0] > 0 else 384
        doc_idx = DocumentIndex(document_id, filename, pages_count, dimension)
        doc_idx.add_chunks(chunks, embeddings)
        self._stores[document_id] = doc_idx
        return doc_idx

    def get_document_index(self, document_id: str) -> Optional[DocumentIndex]:
        return self._stores.get(document_id)

    def has_document(self, document_id: str) -> bool:
        return document_id in self._stores

    def search(
        self,
        document_id: str,
        query_embedding: np.ndarray,
        top_k: int = 5,
        threshold: float = 0.0
    ) -> List[Dict[str, Any]]:
        doc_idx = self.get_document_index(document_id)
        if not doc_idx:
            raise KeyError(f"Document ID '{document_id}' not found in vector store.")
        return doc_idx.search(query_embedding, top_k=top_k, threshold=threshold)

# Singleton vector store instance
vector_store = VectorStoreManager()
