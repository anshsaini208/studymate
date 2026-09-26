from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.rag.retriever import retrieve_relevant_chunks, DocumentNotFoundError
from app.services.llm import generate_grounded_answer, LLMServiceError

router = APIRouter(prefix="/api", tags=["Chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_document(request: ChatRequest):
    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    document_id = request.document_id.strip()
    if not document_id:
        raise HTTPException(status_code=400, detail="document_id is required.")

    # Retrieve relevant chunks
    try:
        chunks = retrieve_relevant_chunks(document_id, question)
    except DocumentNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving context from vector store: {str(e)}")

    # Generate grounded response
    try:
        answer, sources = await generate_grounded_answer(question, chunks)
    except LLMServiceError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error during answer generation: {str(e)}")

    return ChatResponse(
        answer=answer,
        sources=sources
    )
