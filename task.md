# StudyMate — Engineering Task Rules

## 1. Core Execution Philosophy

Before changing code, understand the existing project.

Do not start coding immediately.

First inspect:

- Repository structure
- Existing files
- package.json
- requirements.txt
- Environment configuration
- Existing components
- Existing API routes

Then determine the smallest change required.

Do not modify files simply because they could be improved.

## 2. Primary Engineering Principles

### Think Before Coding

Before implementing a feature:

1. Understand the requirement.
2. Inspect the relevant files.
3. Identify dependencies.
4. Determine the smallest implementation.
5. Consider how the change affects existing functionality.
6. Implement.
7. Test.
8. Fix only confirmed problems.

Do not modify files simply because they could be improved.

### Simplicity First

Prefer the simplest solution that satisfies the requirement.

Example:

Prefer:

```text
React
→ FastAPI
→ FAISS
→ OpenRouter
```

over:

```text
React
→ API Gateway
→ Service A
→ Queue
→ Service B
→ Vector DB
→ Service C
→ LLM Gateway
```

The project is an MVP.

Do not introduce infrastructure that the product does not need.

### Surgical Changes

When fixing a problem:

- Identify the root cause.
- Change only the necessary code.
- Avoid unrelated refactoring.
- Do not rewrite working modules.
- Do not change architecture without a reason.
- Preserve existing behavior.

A bug fix should be small and targeted.

### Goal-Driven Execution

Every change must support one of these goals:

```text
1. Working RAG pipeline
2. Reliable document processing
3. Correct retrieval
4. Grounded answers
5. Clear source attribution
6. Usable frontend
7. Production deployment
```

If a change does not support one of these goals, question whether it is necessary.

## 3. Do Not Over-Engineer

Do NOT add:

- Authentication
- Database
- Redis
- Celery
- Kubernetes
- Microservices
- Docker
- Complex state management
- Advanced caching
- Background workers
- Multiple vector databases

unless a real requirement appears.

## 4. No Mock Functionality

Never create fake implementations such as:

```python
return "This is a generated answer."
```

Never fake:

- Retrieval
- Embeddings
- Sources
- Processing status
- AI responses

The RAG pipeline must actually work.

## 5. Work Incrementally

Implement in this order:

### Phase 1 — Project Foundation

Create:

```text
frontend/
backend/
```

Verify both can run.

### Phase 2 — Backend Health

Implement:

```http
GET /health
```

Verify response.

### Phase 3 — PDF Upload

Implement:

```http
POST /api/upload
```

Verify:

- PDF validation
- File saving
- Error handling

### Phase 4 — PDF Extraction

Implement:

```text
PDF
→ pages
→ text
```

Verify extracted content.

### Phase 5 — Chunking

Implement:

```text
text
→ chunks
```

Verify:

- chunk size
- overlap
- metadata

### Phase 6 — Embeddings

Implement:

```text
chunks
→ embeddings
```

Verify embedding generation.

### Phase 7 — FAISS

Implement:

```text
embeddings
→ FAISS
```

Verify similarity search.

### Phase 8 — Retrieval

Implement:

```text
question
→ embedding
→ FAISS
→ relevant chunks
```

Verify returned sources.

### Phase 9 — LLM

Connect OpenRouter.

Verify:

```text
context + question
→ answer
```

Ensure API key stays server-side.

### Phase 10 — Chat API

Connect:

```http
POST /api/chat
```

Test:

- valid question
- empty question
- invalid document ID
- unrelated question

### Phase 11 — Frontend

Build:

- Navbar
- Upload
- Document status
- Chat
- Sources
- Error states

### Phase 12 — Integration

Connect:

```text
React
↓
FastAPI
↓
RAG
↓
OpenRouter
↓
React
```

Test the complete user journey.

## 6. Testing Rule

After each meaningful implementation:

1. Run the relevant test.
2. Inspect the result.
3. Fix errors.
4. Continue.

Do not wait until the entire application is finished before testing.

## 7. Debugging Rule

When an error occurs:

```text
Error
 ↓
Read full error
 ↓
Identify root cause
 ↓
Locate responsible file
 ↓
Make smallest fix
 ↓
Run test again
```

Do not randomly modify multiple files.

## 8. Dependency Rule

Before adding a dependency ask:

```text
Does the project actually need this?
```

If the answer is no:

Do not add it.

Avoid duplicate libraries that solve the same problem.

## 9. Environment Variable Rule

Never hardcode:

- API keys
- Secrets
- Production URLs

Use:

```text
.env
.env.example
```

Frontend:

```text
VITE_API_URL
```

Backend:

```text
OPENROUTER_API_KEY
OPENROUTER_MODEL
FRONTEND_URL
```

Never commit `.env`.

## 10. Security Rule

Never expose:

```text
OPENROUTER_API_KEY
```

to React.

Never place it in:

```text
VITE_*
```

variables.

Never commit `.env`.

## 11. RAG Quality Rule

Do not judge RAG only by whether the API returns 200.

Verify:

```text
Question
 ↓
Relevant chunks
 ↓
Correct context
 ↓
Grounded answer
 ↓
Correct page source
```

Test with questions whose answers are clearly present in the document.

Then test with questions that are clearly absent.

## 12. Source Accuracy Rule

Never invent page numbers.

Page metadata must come from the actual PDF extraction process.

Every displayed source must correspond to retrieved content.

## 13. Frontend Quality Rule

Do not build UI before understanding the API response format.

Frontend types must match backend schemas.

Avoid:

```typescript
any
```

unless there is a documented reason.

## 14. Design Rule

Follow `design.md`.

Do not introduce:

- Glassmorphism
- AI gradients
- Neon UI
- Decorative blobs
- Excessive animations

The UI should remain clean and professional.

## 15. Git Rule

Make changes in logical increments.

Use meaningful commits when appropriate:

```text
feat: add PDF upload API
feat: implement document chunking
feat: add FAISS retrieval
feat: connect OpenRouter
feat: build chat interface
fix: handle invalid PDF uploads
```

Do not commit:

```text
.env
API keys
secrets
large generated files
```

## 16. Before Declaring Completion

Verify all of the following.

### Backend

- [ ] FastAPI starts
- [ ] `/health` works
- [ ] PDF upload works
- [ ] PDF extraction works
- [ ] Chunking works
- [ ] Embeddings work
- [ ] FAISS works
- [ ] Retrieval works
- [ ] OpenRouter works
- [ ] Chat endpoint works
- [ ] Errors are handled
- [ ] CORS works

### Frontend

- [ ] React starts
- [ ] Upload works
- [ ] Processing state works
- [ ] Document status works
- [ ] Chat works
- [ ] Loading state works
- [ ] Sources display
- [ ] Errors display
- [ ] Mobile layout works

### Deployment

- [ ] Production build succeeds
- [ ] Environment variables documented
- [ ] Backend uses `$PORT`
- [ ] Frontend uses `VITE_API_URL`
- [ ] `.env` is ignored
- [ ] CORS is configured

## 17. Completion Standard

Do not say:

```text
"Implementation complete"
```

until the core user journey has been tested:

```text
Open StudyMate
      ↓
Upload real PDF
      ↓
PDF processed
      ↓
Ask real question
      ↓
Retrieve relevant content
      ↓
Generate grounded answer
      ↓
Display source page
```

That complete flow is the definition of "done".

## 18. Final Engineering Rule

Think first.

Keep it simple.

Make surgical changes.

Test continuously.

Solve the actual problem.

Do not build features just because they are technically interesting.

The goal is:

```text
A small,
correct,
understandable,
deployable RAG application.
```
