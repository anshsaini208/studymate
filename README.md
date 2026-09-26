# 📚 StudyMate — AI Study Assistant

> **Chat with your study material.**

StudyMate is a full-stack **Retrieval-Augmented Generation (RAG)** application that allows students to upload academic PDFs and ask questions directly from their study material.

Instead of relying only on an LLM's general knowledge, StudyMate retrieves relevant information from the uploaded document and uses that context to generate **grounded, source-aware answers**.

---

## 🚀 Features

- 📄 Upload academic PDF documents
- 🔍 Extract text from PDFs page by page
- ✂️ Split documents into meaningful chunks
- 🧠 Generate semantic embeddings using Hugging Face
- ⚡ Fast similarity search using FAISS
- 🤖 Generate answers using an LLM through OpenRouter
- 📑 Display source filename and page information
- 🎯 Document-aware question answering
- 🛡️ Reduce hallucinations with context-grounded responses
- 💻 Responsive React frontend
- 🔌 FastAPI REST backend
- ☁️ Deployment-ready architecture

---

## 🧠 How StudyMate Works

StudyMate follows a standard Retrieval-Augmented Generation pipeline:

```text
                 ┌─────────────────┐
                 │   Upload PDF    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Text Extraction │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │    Chunking     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   Embeddings    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │      FAISS      │
                 │  Vector Store   │
                 └────────┬────────┘
                          │
                User Question
                          │
                          ▼
                 ┌─────────────────┐
                 │ Semantic Search │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Relevant Context│
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │       LLM       │
                 │    OpenRouter   │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Grounded Answer │
                 │   + Sources     │
                 └─────────────────┘
```

### Pipeline

```text
PDF
 ↓
Text Extraction
 ↓
Chunking
 ↓
Hugging Face Embeddings
 ↓
FAISS Vector Search
 ↓
Relevant Context Retrieval
 ↓
OpenRouter LLM
 ↓
Grounded Answer + Sources
```

---

## 🏗️ Architecture

```text
┌──────────────────────┐
│    React Frontend    │
│  TypeScript + Vite   │
└──────────┬───────────┘
           │
           │ REST API
           ▼
┌──────────────────────┐
│    FastAPI Backend   │
│       Python         │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌──────────┐ ┌──────────────┐
│  FAISS   │ │  OpenRouter  │
│  Search  │ │     LLM      │
└──────────┘ └──────────────┘
     ▲
     │
┌──────────────┐
│ PDF + Chunks │
└──────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Lucide React

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- python-dotenv

### RAG

- LangChain text splitters
- Hugging Face Sentence Transformers
- `sentence-transformers/all-MiniLM-L6-v2`
- FAISS
- pypdf

### LLM

- OpenRouter

### Deployment

- Vercel — Frontend
- Render — Backend

---

## 📁 Project Structure

```text
StudyMate/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── FileUpload.tsx
│       │   ├── ChatBox.tsx
│       │   ├── MessageBubble.tsx
│       │   ├── SourceCard.tsx
│       │   ├── DocumentCard.tsx
│       │   ├── LoadingIndicator.tsx
│       │   └── EmptyState.tsx
│       │
│       ├── pages/
│       │   └── Home.tsx
│       │
│       ├── services/
│       │   └── api.ts
│       │
│       ├── types/
│       │   └── index.ts
│       │
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload.py
│   │   │   └── chat.py
│   │   │
│   │   ├── rag/
│   │   │   ├── loader.py
│   │   │   ├── chunker.py
│   │   │   ├── embeddings.py
│   │   │   ├── vectorstore.py
│   │   │   └── retriever.py
│   │   │
│   │   ├── services/
│   │   │   └── llm.py
│   │   │
│   │   ├── models/
│   │   │   └── schemas.py
│   │   │
│   │   └── main.py
│   │
│   ├── data/
│   │   ├── uploads/
│   │   └── vectorstore/
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── prd.md
├── techstack.md
├── design.md
├── task.md
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone (https://github.com/anshsaini208/studymate)
cd StudyMate
```

---

# 🔧 Backend Setup

### 2. Navigate to Backend

```bash
cd backend
```

### 3. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it.

**Windows:**

```bash
venv\Scripts\activate
```

**Linux/macOS:**

```bash
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

Create a `.env` file inside `backend/`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=your_model_name

FRONTEND_URL=http://localhost:5173

TOP_K=5
SIMILARITY_THRESHOLD=0.3
MAX_FILE_SIZE_MB=10
```

> ⚠️ Never commit your `.env` file or API keys to GitHub.

### 6. Start the Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

---

# 🎨 Frontend Setup

### 7. Navigate to Frontend

Open another terminal:

```bash
cd frontend
```

### 8. Install Dependencies

```bash
npm install
```

### 9. Configure Environment Variable

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://127.0.0.1:8000
```

### 10. Start Development Server

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔑 OpenRouter Configuration

StudyMate uses **OpenRouter** to communicate with the selected LLM.

Create an API key from your OpenRouter account and add it to:

```env
OPENROUTER_API_KEY=your_api_key
```

The API key is used **only by the backend**.

The frontend never receives the API key.

---

# 🔌 API Endpoints

## Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok"
}
```

---

## Upload Document

```http
POST /api/upload
```

Uploads and processes a PDF.

The backend:

1. Validates the PDF
2. Extracts text
3. Splits text into chunks
4. Generates embeddings
5. Stores embeddings in FAISS
6. Creates a document ID

Example response:

```json
{
  "success": true,
  "document_id": "example-document-id",
  "filename": "machine-learning.pdf",
  "pages": 25,
  "chunks": 142,
  "message": "Document processed successfully"
}
```

---

## Ask a Question

```http
POST /api/chat
```

Example request:

```json
{
  "question": "What is supervised learning?",
  "document_id": "example-document-id"
}
```

Example response:

```json
{
  "answer": "Supervised learning is a machine learning approach...",
  "sources": [
    {
      "filename": "machine-learning.pdf",
      "page": 4,
      "content": "Supervised learning is..."
    }
  ]
}
```

---

# 🧠 RAG Configuration

StudyMate uses the following basic configuration:

| Component | Configuration |
|---|---|
| Embedding Model | `all-MiniLM-L6-v2` |
| Chunk Size | 800 |
| Chunk Overlap | 150 |
| Retrieval | FAISS |
| Top K | 5 |
| PDF Library | pypdf |
| LLM Provider | OpenRouter |

These values can be adjusted based on the document type and retrieval quality.

---

# 🎯 Hallucination Control

StudyMate is designed to keep answers grounded in the uploaded document.

The LLM receives:

```text
User Question
      +
Retrieved Document Context
      ↓
     LLM
      ↓
Grounded Answer
```

If the required information cannot be found in the retrieved context, the system is instructed to respond:

> "I couldn't find this information in the uploaded document."

This prevents the application from presenting unrelated model knowledge as if it came from the user's study material.

---

# 📑 Source Attribution

Each answer can include relevant source information such as:

- Document filename
- Page number
- Retrieved content

Example:

```text
Answer:
Supervised learning uses labeled training data...

Sources:
📄 machine-learning.pdf
📖 Page 4
```

This allows users to verify the generated answer against their original study material.

---

# 🌐 Deployment

## Frontend — Vercel

Build the frontend:

```bash
npm run build
```

Deploy the `frontend` directory to Vercel.

Set:

```env
VITE_API_URL=https://YOUR-BACKEND-URL
```

---

## Backend — Render

Deploy the `backend` directory as a Python Web Service.

### Build Command

```bash
pip install -r requirements.txt
```

### Start Command

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Configure:

```env
OPENROUTER_API_KEY=your_api_key
OPENROUTER_MODEL=your_model
FRONTEND_URL=https://YOUR-FRONTEND-URL
TOP_K=5
SIMILARITY_THRESHOLD=0.3
MAX_FILE_SIZE_MB=10
```

After deployment, update the frontend:

```env
VITE_API_URL=https://YOUR-BACKEND-URL
```

---

# ⚠️ Deployment Consideration

The MVP uses local filesystem storage for uploaded PDFs and FAISS indexes.

On cloud platforms with ephemeral storage, these files may not survive service restarts or redeployments.

For a production-scale version, persistent storage can be added using:

- Object storage
- PostgreSQL
- Persistent disks
- Managed vector databases

The current architecture intentionally keeps the MVP simple.

---

# 🔒 Security

StudyMate follows basic security practices:

- API keys are stored in environment variables
- API keys are never exposed to the frontend
- `.env` files are excluded from Git
- Uploaded files are validated
- File size limits are enforced
- Backend controls LLM communication
- CORS is configured for the frontend

---

# 🚧 Current Limitations

The current MVP does not include:

- User authentication
- Persistent cloud document storage
- OCR for scanned PDFs
- Image understanding
- Voice interaction
- Multi-user document management
- Advanced conversation memory
- Fine-tuned models
- Managed vector database

These features can be added in future versions.

---

# 🔮 Future Improvements

Possible future improvements include:

- 🔐 User authentication
- ☁️ Persistent document storage
- 🗄️ PostgreSQL integration
- 🔎 Hybrid search
- 🧠 Reranking models
- 📚 Multiple document collections
- 💬 Conversation history
- 📊 Usage analytics
- 📱 Improved mobile experience
- 🖼️ OCR and multimodal PDF support
- ⚡ Streaming LLM responses
- 🔒 User-specific document isolation
- 🗃️ Production vector database

---

# 📸 Application Flow

```text
1. Upload Study Material
          ↓
2. PDF Processing
          ↓
3. Embedding Generation
          ↓
4. FAISS Index Creation
          ↓
5. Ask Question
          ↓
6. Retrieve Relevant Chunks
          ↓
7. Generate Grounded Answer
          ↓
8. Display Answer + Sources
```

---

# 🎓 Use Cases

StudyMate can be used for:

- 📖 Exam preparation
- 📝 Lecture notes
- 📚 Textbooks
- 💻 Programming documentation
- 🧮 Technical subjects
- 🧠 Research papers
- 📄 Course material
- 🎯 Quick revision

---

# 🤝 Contributing

Contributions are welcome.

```bash
# Fork the repository

# Create a feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -m "Add your feature"

# Push the branch
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 📜 License

This project is intended for educational and portfolio purposes.

Add an appropriate open-source license if you plan to distribute or modify the project publicly.

---

# 👨‍💻 Author

**Ansh Saini**

B.Tech — Computer Science / Artificial Intelligence & Machine Learning  
COER University

Interested in:

- Artificial Intelligence
- Machine Learning
- Generative AI
- Retrieval-Augmented Generation
- Data Analytics
- Full-Stack Development

---

## ⭐ Support

If you find StudyMate useful or interesting, consider giving the repository a ⭐ on GitHub.

---

**StudyMate — Chat with your study material.**
