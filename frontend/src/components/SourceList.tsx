import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileCode } from 'lucide-react';
import type { SourceCitation } from '../types';

interface SourceListProps {
  sources: SourceCitation[];
}

export const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 text-xs font-medium text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
      >
        <FileCode className="w-3.5 h-3.5" />
        <span>
          {sources.length} {sources.length === 1 ? 'Source reference' : 'Source references'}
        </span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2.5 space-y-2">
          {sources.map((src, index) => (
            <div
              key={index}
              className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-md p-2.5 text-xs"
            >
              <div className="flex items-center justify-between text-[#111827] font-medium mb-1">
                <span className="truncate max-w-[240px] sm:max-w-none">{src.filename}</span>
                <span className="bg-[#E5E7EB] text-[#111827] px-1.5 py-0.5 rounded text-[10px] shrink-0 font-semibold">
                  Page {src.page}
                </span>
              </div>
              <p className="text-[#6B7280] leading-relaxed italic line-clamp-3">
                "{src.content}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
