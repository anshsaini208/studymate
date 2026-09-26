# StudyMate — Technical Stack

## 1. Architecture

StudyMate uses a two-tier architecture:

```text
React Frontend
       |
       | REST API
       ↓
FastAPI Backend
       |
       ├── PDF Processing
       ├── Chunking
       ├── Embeddings
       ├── FAISS Retrieval
       └── LLM Generation
```

## 2. Frontend

### React

Use React for:

- UI rendering
- Component architecture
- Application state

### TypeScript

Use TypeScript for:

- Type safety
- API response types
- Component props
- Better maintainability

Avoid unnecessary use of `any`.

### Vite

Use Vite for:

- Development server
- Production build
- Fast frontend development

### Tailwind CSS

Use Tailwind CSS for:

- Layout
- Responsive design
- Component styling
- Consistent spacing

Do not introduce another CSS framework.

### Axios

Use Axios for frontend → FastAPI communication.

All API requests should be centralized in:

```text
src/services/api.ts
```

### Lucide React

Use `lucide-react` for UI icons.

Do not use icons as decoration everywhere.

## 3. Backend

### Python

Use Python 3.11+ for:

- PDF processing
- RAG pipeline
- embeddings
- vector search
- LLM communication

### FastAPI

Use FastAPI for:

- REST API
- File upload
- Request validation
- API routing
- Backend service

### Uvicorn

Development:

```bash
uvicorn app.main:app --reload
```

Production:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## 4. PDF Processing

Use:

```text
pypdf
```

Responsibilities:

- Read PDFs
- Extract text
- Preserve page numbers

OCR is not included in MVP.

## 5. Text Chunking

Use a recursive text splitter.

Recommended:

```text
RecursiveCharacterTextSplitter
```

Initial settings:

```text
chunk_size = 800
chunk_overlap = 150
```

The splitter must preserve metadata.

## 6. Embeddings

Use:

```text
sentence-transformers
```

Model:

```text
sentence-transformers/all-MiniLM-L6-v2
```

Purpose:

Convert text into numerical vector representations.

```text
Document chunk
      ↓
Embedding model
      ↓
Vector
```

## 7. Vector Database

Use:

```text
FAISS
```

Purpose:

- Store embeddings
- Perform similarity search
- Retrieve relevant document chunks

Do not use Pinecone, Weaviate, or another external vector database in the MVP.

## 8. LLM

Use:

```text
OpenRouter
```

The backend communicates with OpenRouter.

The API key must be stored in:

```env
OPENROUTER_API_KEY=
```

The model must be configurable:

```env
OPENROUTER_MODEL=
```

Do not hardcode the API key.

Do not expose the API key to React.

## 9. Environment Configuration

Backend:

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
FRONTEND_URL=
TOP_K=5
SIMILARITY_THRESHOLD=
MAX_FILE_SIZE_MB=10
```

Frontend:

```env
VITE_API_URL=
```

Provide `.env.example`.

Never commit `.env`.

## 10. API Architecture

Frontend:

```text
frontend/
    src/
        services/
            api.ts
```

API methods:

```text
uploadDocument()
chatWithDocument()
getHealth()
```

Backend:

```text
backend/app/api/
    upload.py
    chat.py
```

## 11. RAG Architecture

```text
PDF
 ↓
pypdf
 ↓
Page Text
 ↓
Recursive Chunking
 ↓
Sentence Transformer
 ↓
FAISS
```

Query:

```text
Question
 ↓
Embedding
 ↓
FAISS Search
 ↓
Top-K Chunks
 ↓
Context
 ↓
OpenRouter
 ↓
Grounded Answer
```

## 12. Metadata

Every chunk must preserve:

```json
{
  "document_id": "abc123",
  "filename": "dbms.pdf",
  "page": 12
}
```

Metadata is required for source attribution and document isolation.

## 13. Backend Modules

```text
backend/app/

main.py

api/
├── upload.py
└── chat.py

rag/
├── loader.py
├── chunker.py
├── embeddings.py
├── vectorstore.py
└── retriever.py

services/
└── llm.py

models/
└── schemas.py
```

Responsibilities:

### loader.py
PDF → page-aware text

### chunker.py
Text → chunks

### embeddings.py
Chunks → embeddings

### vectorstore.py
Embeddings → FAISS

### retriever.py
Question → relevant chunks

### llm.py
Context + question → answer

### schemas.py
Request/response validation

## 14. Deployment

### Frontend

Deploy to:

```text
Vercel
```

Build command:

```bash
npm run build
```

Environment variable:

```text
VITE_API_URL
```

### Backend

Deploy FastAPI to a platform that supports Python web services.

Production command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Environment variables must be configured on the hosting platform.

## 15. Dependency Principle

Use the smallest practical dependency set.

Avoid adding:

- Redux unless required
- Database ORM
- Authentication libraries
- Celery
- Redis
- Docker unless deployment requires it
- Kubernetes
- Multiple vector databases
- Multiple LLM SDKs

Every dependency should have a clear purpose.

## 16. Technical Principle

Prefer:

```text
Simple
Explicit
Typed
Testable
Deployable
```

over:

```text
Abstract
Over-engineered
Highly configurable
Distributed
Complex
```

The technical stack exists to support the product, not become the product.
