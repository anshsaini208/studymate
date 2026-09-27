from typing import List
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "healthy"
    service: str = "StudyMate API"

class UploadResponse(BaseModel):
    success: bool
    document_id: str
    filename: str
    pages: int
    chunks: int
    message: str

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, description="Question about the document")
    document_id: str = Field(..., min_length=1, description="Unique document ID")

class SourceCitation(BaseModel):
    filename: str
    page: int
    content: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceCitation] = Field(default_factory=list)
