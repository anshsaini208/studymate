import React, { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Send, Trash2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (question: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
  hasMessages: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onClearChat,
  isLoading,
  hasMessages,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  return (
    <div className="border-t border-[#E5E7EB] bg-[#FFFFFF] p-4 sticky bottom-0 z-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="relative flex items-center rounded-lg border border-[#E5E7EB] focus-within:border-[#111827] bg-[#FFFFFF] shadow-2xs transition-colors">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask a question about your study material... (Press Enter to send)"
            className="w-full resize-none py-3 pl-4 pr-24 text-sm text-[#111827] placeholder-[#9CA3AF] bg-transparent focus:outline-hidden disabled:opacity-50"
          />

          <div className="absolute right-2 flex items-center space-x-1">
            {hasMessages && (
              <button
                type="button"
                onClick={onClearChat}
                disabled={isLoading}
                title="Clear conversation"
                className="p-1.5 text-[#9CA3AF] hover:text-[#DC2626] rounded-md transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              title="Send question"
              className="p-2 bg-[#111827] hover:bg-[#374151] text-white rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="mt-2 text-[11px] text-center text-[#9CA3AF]">
          Grounded exclusively on your document • Page citations verified
        </p>
      </div>
    </div>
  );
};
