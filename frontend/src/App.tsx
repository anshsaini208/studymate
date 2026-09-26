import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { UploadArea } from './components/UploadArea';
import { DocumentCard } from './components/DocumentCard';
import { ChatFeed } from './components/ChatFeed';
import { ChatInput } from './components/ChatInput';
import type { DocumentInfo, ChatMessage } from './types';
import { chatWithDocument } from './services/api';
import { AlertCircle } from 'lucide-react';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDocument(null);
    setMessages([]);
    setError(null);
    // Reset attempt counter on logout
    localStorage.removeItem('studymate_login_attempts');
    localStorage.removeItem('studymate_lockout_until');
  };

  const handleUploadSuccess = (docInfo: DocumentInfo) => {
    setDocument(docInfo);
    setMessages([]);
    setError(null);
  };

  const handleReset = () => {
    setDocument(null);
    setMessages([]);
    setError(null);
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };

  const handleSendMessage = async (question: string) => {
    if (!document) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatWithDocument(document.document_id, question);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve answer.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar
        hasDocument={!!document}
        onReset={handleReset}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col max-w-[1200px] w-full mx-auto px-4 sm:px-6">
        {!document ? (
          <div className="flex-1 flex items-center justify-center">
            <UploadArea onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col py-4">
            {/* Document Status Header */}
            <div className="mb-4">
              <DocumentCard document={document} />
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md flex items-start space-x-2 text-[#DC2626] text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            {/* Chat Interaction Feed */}
            <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg shadow-2xs overflow-hidden min-h-[450px]">
              <ChatFeed
                messages={messages}
                isLoading={isLoading}
                filename={document.filename}
              />
              <ChatInput
                onSendMessage={handleSendMessage}
                onClearChat={handleClearChat}
                isLoading={isLoading}
                hasMessages={messages.length > 0}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
