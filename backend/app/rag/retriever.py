from typing import List, Dict, Any
from app.core.config import settings
from app.rag.embeddings import embed_query
from app.rag.vectorstore import vector_store

class DocumentNotFoundError(Exception):
    pass

def retrieve_relevant_chunks(
    document_id: str,
    question: str,
    top_k: int = settings.TOP_K,
    threshold: float = settings.SIMILARITY_THRESHOLD
) -> List[Dict[str, Any]]:
    """
    Retrieves the most semantically relevant chunks for a question within a specific document.
    """
    if not vector_store.has_document(document_id):
        raise DocumentNotFoundError(f"Document with ID '{document_id}' was not found. Please upload the PDF first.")

    query_vec = embed_query(question)
    results = vector_store.search(
        document_id=document_id,
        query_embedding=query_vec,
        top_k=top_k,
        threshold=threshold
    )
    return results
