import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.schemas import ChatResponse, SourceCitation
from app.rag.loader import extract_pages_from_pdf, PDFExtractionError
from app.rag.chunker import chunk_pages
from app.rag.embeddings import embed_texts
from app.rag.vectorstore import vector_store
from app.rag.retriever import retrieve_relevant_chunks

client = TestClient(app)

SAMPLE_PDF_BYTES = b"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 6 0 R >>
endobj
4 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 7 0 R >>
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
6 0 obj
<< /Length 115 >>
stream
BT
/F1 12 Tf
72 700 Td
(Database Management Systems. A primary key uniquely identifies each record in a relational database table.) Tj
ET
endstream
endobj
7 0 obj
<< /Length 135 >>
stream
BT
/F1 12 Tf
72 700 Td
(Second Normal Form or 2NF requires the relation to be in 1NF and have no partial functional dependency on candidate key.) Tj
ET
endstream
endobj
xref
0 8
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000224 00000 n 
0000000333 00000 n 
0000000401 00000 n 
0000000568 00000 n 
trailer
<< /Size 8 /Root 1 0 R >>
startxref
755
%%EOF"""

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "StudyMate API"}

def test_upload_invalid_file_type():
    response = client.post(
        "/api/upload",
        files={"file": ("lecture.txt", b"plain text", "text/plain")}
    )
    assert response.status_code == 400
    assert "PDF" in response.json()["detail"]

def test_upload_empty_pdf():
    response = client.post(
        "/api/upload",
        files={"file": ("empty.pdf", b"", "application/pdf")}
    )
    assert response.status_code == 400

def test_upload_valid_pdf_and_retrieval():
    # 1. Upload
    response = client.post(
        "/api/upload",
        files={"file": ("dbms_exam.pdf", SAMPLE_PDF_BYTES, "application/pdf")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["filename"] == "dbms_exam.pdf"
    assert data["pages"] == 2
    assert data["chunks"] >= 2
    doc_id = data["document_id"]

    # 2. Retrieval for 2NF should match page 2
    chunks_2nf = retrieve_relevant_chunks(doc_id, "What is 2NF partial dependency?", top_k=1)
    assert len(chunks_2nf) > 0
    assert chunks_2nf[0]["page"] == 2
    assert "Second Normal Form" in chunks_2nf[0]["content"]

    # 3. Retrieval for primary key should match page 1
    chunks_pk = retrieve_relevant_chunks(doc_id, "What uniquely identifies records?", top_k=1)
    assert len(chunks_pk) > 0
    assert chunks_pk[0]["page"] == 1
    assert "primary key" in chunks_pk[0]["content"]

def test_chat_nonexistent_document():
    response = client.post(
        "/api/chat",
        json={"document_id": "missing_doc", "question": "Explain 2NF"}
    )
    assert response.status_code == 404

def test_chat_empty_question():
    response = client.post(
        "/api/chat",
        json={"document_id": "any_doc", "question": "   "}
    )
    assert response.status_code in [400, 422]


def test_chat_response_sources_default_is_not_shared():
    first = ChatResponse(answer="First answer")
    second = ChatResponse(answer="Second answer")

    first.sources.append(SourceCitation(filename="test.pdf", page=1, content="Example source"))

    assert len(first.sources) == 1
    assert len(second.sources) == 0
