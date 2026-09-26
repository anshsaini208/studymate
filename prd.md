# StudyMate — Product Requirements Document

## 1. Product Overview

### Product Name
StudyMate

### Tagline
Chat with your study material.

### Product Type
AI-powered document question-answering application using Retrieval-Augmented Generation (RAG).

### Target Users
- College students
- University students
- Students preparing for exams
- Learners working with technical notes, textbooks, and PDFs

### Core Problem

Students often have large amounts of study material distributed across PDFs, lecture notes, textbooks, and assignments.

Finding a specific concept inside these documents is time-consuming.

StudyMate allows students to upload their study material and ask questions directly against the uploaded documents.

The system retrieves relevant information from the documents and uses an LLM to generate a grounded answer.

## 2. Product Goal

Build a simple, reliable, and deployable RAG application where a student can:

1. Upload a PDF.
2. Wait for the document to be processed.
3. Ask questions about the document.
4. Receive an answer grounded in the document.
5. See the source document and page number used to generate the answer.

The primary goal is not to build a large AI platform.

The primary goal is to demonstrate a correct and understandable RAG implementation.

## 3. MVP Scope

The MVP must support:

- PDF upload
- PDF text extraction
- Page-aware document processing
- Text chunking
- Embedding generation
- FAISS vector storage
- Semantic similarity search
- LLM-based answer generation
- Source references
- Document-aware retrieval
- Chat interface
- Error handling
- Responsive UI
- Production deployment configuration

## 4. Core User Flow

```text
User opens StudyMate
        ↓
Uploads PDF
        ↓
Backend validates PDF
        ↓
Text extracted page-by-page
        ↓
Text split into chunks
        ↓
Embeddings generated
        ↓
Vectors stored in FAISS
        ↓
Document becomes ready
        ↓
User asks a question
        ↓
Question embedding generated
        ↓
Relevant chunks retrieved
        ↓
Retrieved context sent to LLM
        ↓
Grounded answer generated
        ↓
Answer + sources returned
        ↓
User sees answer
```

## 5. Functional Requirements

### FR-01: PDF Upload

The user must be able to upload a PDF.

Requirements:

- Accept PDF files only.
- Reject unsupported file types.
- Enforce a reasonable file size limit.
- Display selected filename.
- Display processing state.
- Display success or failure state.

Initial maximum file size:

```text
10 MB
```

The limit should be configurable.

### FR-02: PDF Processing

The backend must extract text from the uploaded PDF.

Text must be extracted page-by-page.

Each extracted page must preserve:

- document ID
- filename
- page number
- extracted text

The system must reject PDFs that contain no extractable text.

OCR is NOT part of the MVP.

### FR-03: Text Chunking

Extracted text must be divided into smaller chunks.

Initial configuration:

```text
chunk_size = 800
chunk_overlap = 150
```

These values must be configurable.

Each chunk must preserve:

```text
document_id
filename
page
```

### FR-04: Embeddings

Use a local Hugging Face embedding model.

Initial model:

```text
sentence-transformers/all-MiniLM-L6-v2
```

Embeddings must be generated for document chunks.

The embedding model must not require a paid API.

### FR-05: Vector Storage

Use FAISS for vector similarity search.

The system must:

- Create a FAISS index.
- Add document embeddings.
- Store metadata associated with vectors.
- Save/load the vector index where appropriate.
- Search for relevant chunks.

Initial retrieval count:

```text
top_k = 5
```

Make top_k configurable.

### FR-06: Document Isolation

Every uploaded document must have a unique document ID.

Example:

```text
document_id = uuid
```

Retrieval must respect the selected document.

A question about Document A must not retrieve chunks from Document B.

### FR-07: Question Answering

The user must be able to ask questions about the selected document.

Example:

```text
User:
Explain normalization in DBMS.
```

StudyMate should retrieve relevant chunks and generate a grounded answer.

### FR-08: Grounded Responses

The LLM must primarily use retrieved document context.

The system must not intentionally generate unsupported information.

If relevant information cannot be found, return:

```text
I couldn't find this information in the uploaded document.
```

Do not fabricate an answer.

### FR-09: Source References

Each answer should provide relevant sources.

Source information should contain:

```text
filename
page
short excerpt
```

Example:

```text
Sources

DBMS Unit 1.pdf
Page 12

"Normalization organizes data to reduce..."
```

### FR-10: Chat

The interface must support a simple conversational experience.

Required:

- User messages
- Assistant messages
- Loading state
- Error state
- Auto-scroll
- Enter to send
- Shift + Enter for multiline input
- Clear chat

Conversation history does not need to be persisted in a database for the MVP.

## 6. Backend API Requirements

### Health

```http
GET /health
```

Response:

```json
{
  "status": "healthy",
  "service": "StudyMate API"
}
```

### Upload

```http
POST /api/upload
```

Request:

```text
multipart/form-data
file
```

Response:

```json
{
  "success": true,
  "document_id": "abc123",
  "filename": "dbms.pdf",
  "pages": 25,
  "chunks": 120,
  "message": "Document processed successfully"
}
```

### Chat

```http
POST /api/chat
```

Request:

```json
{
  "question": "What is normalization?",
  "document_id": "abc123"
}
```

Response:

```json
{
  "answer": "Normalization is...",
  "sources": [
    {
      "filename": "dbms.pdf",
      "page": 12,
      "content": "..."
    }
  ]
}
```

## 7. Frontend Requirements

The frontend must provide:

### Landing / Home

- Product introduction
- PDF upload
- Document status
- Chat interface

### Document Area

Display:

- Filename
- Number of pages
- Processing status
- Selected document

### Chat Area

Display:

- Messages
- Sources
- Loading indicator
- Error messages

## 8. Non-Functional Requirements

### Performance

The application should remain responsive during:

- PDF upload
- document processing
- retrieval
- LLM generation

Long-running operations must show loading states.

### Reliability

The application should gracefully handle:

- Invalid PDFs
- Empty PDFs
- Corrupted PDFs
- Empty questions
- Missing document IDs
- API failures
- LLM failures
- Embedding failures
- Vector store failures

### Security

Never expose:

```text
OPENROUTER_API_KEY
```

to the frontend.

All LLM API calls must happen on the backend.

Do not commit `.env`.

## 9. Out of Scope

Do NOT implement these in the MVP:

- Authentication
- User accounts
- Payments
- Admin dashboard
- Social features
- OCR
- Voice input
- Image understanding
- Multi-agent systems
- Fine-tuning
- Complex analytics
- Recommendation engines
- Paid vector databases
- Microservices
- Kubernetes

These may be considered later.

## 10. Success Criteria

StudyMate is considered successful when a user can:

1. Open the application.
2. Upload a PDF.
3. Successfully process the PDF.
4. Ask a question.
5. Retrieve relevant document content.
6. Receive a grounded answer.
7. See the source page.
8. Ask follow-up questions.
9. Handle an unrelated question without hallucinating.
10. Use the application from a deployed frontend and backend.

## 11. Product Principle

StudyMate should prioritize:

```text
Correct RAG
>
Simple Architecture
>
Reliable UX
>
Clean Code
>
Deployment
>
Extra Features
```

Do not add features simply because they look impressive.

Build the smallest system that demonstrates a correct RAG pipeline.
