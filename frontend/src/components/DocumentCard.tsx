import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import type { DocumentInfo } from '../types';

interface DocumentCardProps {
  document: DocumentInfo;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-4 shadow-xs">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-md bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-[#111827]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Document
              </span>
              <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                <span>Ready</span>
              </span>
            </div>
            <h2 className="text-sm font-semibold text-[#111827] mt-0.5 truncate max-w-[280px] sm:max-w-[400px]">
              {document.filename}
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {document.pages} {document.pages === 1 ? 'page' : 'pages'} • {document.chunks} chunks indexed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
