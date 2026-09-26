import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.config import settings
from app.models.schemas import UploadResponse
from app.rag.loader import extract_pages_from_pdf, PDFExtractionError
from app.rag.chunker import chunk_pages
from app.rag.embeddings import embed_texts
from app.rag.vectorstore import vector_store

router = APIRouter(prefix="/api", tags=["Document"])

@router.post("/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    # Validate file extension
    filename = file.filename or "uploaded.pdf"
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Only PDF files are accepted."
        )

    # Read file content
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read uploaded file: {str(e)}")

    # Enforce file size limit
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB."
        )

    document_id = str(uuid.uuid4())[:8]

    # Extract pages
    try:
        pages = extract_pages_from_pdf(content, filename, document_id)
    except PDFExtractionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error during PDF extraction: {str(e)}")

    # Chunk pages
    chunks = chunk_pages(
        pages,
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP
    )

    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="Could not generate text chunks from the provided PDF."
        )

    # Embed and index
    try:
        texts_to_embed = [c["content"] for c in chunks]
        embeddings = embed_texts(texts_to_embed)
        vector_store.create_document_index(
            document_id=document_id,
            filename=filename,
            pages_count=len(pages),
            chunks=chunks,
            embeddings=embeddings
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate embeddings and index document: {str(e)}")

    return UploadResponse(
        success=True,
        document_id=document_id,
        filename=filename,
        pages=len(pages),
        chunks=len(chunks),
        message="Document processed successfully"
    )
