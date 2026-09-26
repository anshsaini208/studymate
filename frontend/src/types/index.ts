export interface HealthResponse {
  status: string;
  service: string;
}

export interface UploadResponse {
  success: boolean;
  document_id: string;
  filename: string;
  pages: number;
  chunks: number;
  message: string;
}

export interface SourceCitation {
  filename: string;
  page: number;
  content: string;
}

export interface ChatResponse {
  answer: string;
  sources: SourceCitation[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
  timestamp: string;
}

export interface DocumentInfo {
  document_id: string;
  filename: string;
  pages: number;
  chunks: number;
}
