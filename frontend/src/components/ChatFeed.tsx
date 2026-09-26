import React, { useEffect, useRef } from 'react';
import { Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '../types';
import { SourceList } from './SourceList';

interface ChatFeedProps {
  messages: ChatMessage[];
  isLoading: boolean;
  filename: string;
}

export const ChatFeed: React.FC<ChatFeedProps> = ({ messages, isLoading, filename }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-center mb-3">
          <Bot className="w-6 h-6 text-[#111827]" />
        </div>
        <h3 className="font-semibold text-base text-[#111827]">
          Ready to answer your questions
        </h3>
        <p className="text-xs text-[#6B7280] max-w-md mt-1 leading-relaxed">
          Ask any question about <span className="font-medium text-[#111827]">{filename}</span>.
          StudyMate will retrieve relevant sections and provide a grounded response with page numbers.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
      {messages.map((message) => {
        const isUser = message.role === 'user';

        return (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-medium ${
                isUser
                  ? 'bg-[#111827] text-white'
                  : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827]'
              }`}
            >
              {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Content Container */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-4 text-sm leading-relaxed ${
                isUser
                  ? 'bg-[#111827] text-[#FFFFFF]'
                  : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] shadow-xs'
              }`}
            >
              {isUser ? (
                <div className="whitespace-pre-wrap font-normal">
                  {message.content}
                </div>
              ) : (
                <div className="markdown-content space-y-2 text-[#111827] font-normal leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ ...props }) => <h1 className="text-lg font-bold mt-2 mb-1" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-base font-bold mt-2 mb-1" {...props} />,
                      h3: ({ ...props }) => <h3 className="text-sm font-semibold mt-2 mb-1" {...props} />,
                      p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                      ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                      li: ({ ...props }) => <li className="mb-0.5" {...props} />,
                      strong: ({ ...props }) => <strong className="font-semibold text-[#111827]" {...props} />,
                      blockquote: ({ ...props }) => (
                        <blockquote className="border-l-3 border-[#E5E7EB] pl-3 italic text-[#6B7280] my-2" {...props} />
                      ),
                      table: ({ ...props }) => (
                        <div className="overflow-x-auto my-3">
                          <table className="min-w-full divide-y divide-[#E5E7EB] border border-[#E5E7EB] text-xs" {...props} />
                        </div>
                      ),
                      thead: ({ ...props }) => <thead className="bg-[#F8FAFC]" {...props} />,
                      th: ({ ...props }) => (
                        <th className="px-3 py-2 text-left font-semibold text-[#111827] border-b border-[#E5E7EB]" {...props} />
                      ),
                      td: ({ ...props }) => (
                        <td className="px-3 py-2 border-b border-[#E5E7EB] text-[#374151]" {...props} />
                      ),
                      code: ({ ...props }) => (
                        <code className="bg-[#F8FAFC] border border-[#E5E7EB] text-[#111827] px-1 py-0.5 rounded text-xs font-mono" {...props} />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}

              {/* Render sources if available for assistant */}
              {!isUser && message.sources && message.sources.length > 0 && (
                <SourceList sources={message.sources} />
              )}
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className="flex items-start space-x-3">
          <div className="w-7 h-7 rounded-md bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-[#111827]" />
          </div>
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm text-[#6B7280] flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
            <span>Finding relevant passages & generating grounded answer...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
