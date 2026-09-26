import React, { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileText, Loader2, AlertCircle } from 'lucide-react';
import { uploadDocument } from '../services/api';
import type { DocumentInfo } from '../types';

interface UploadAreaProps {
  onUploadSuccess: (doc: DocumentInfo) => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('Extracting text & creating embeddings...');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (file: File) => {
    setError(null);

    // Validation
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setError('Please upload a PDF file. Other file formats are not supported.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('The selected file exceeds the 10 MB size limit.');
      return;
    }

    setIsProcessing(true);
    setProcessingStage('Extracting text, chunking pages, and generating vectors...');

    try {
      const result = await uploadDocument(file);
      onUploadSuccess({
        document_id: result.document_id,
        filename: result.filename,
        pages: result.pages,
        chunks: result.chunks,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to process the document.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827] tracking-tight">
          Chat with your study material
        </h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Upload a lecture note, textbook chapter, or research paper to start asking questions.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center transition-all cursor-pointer bg-[#FFFFFF] ${
          isDragging
            ? 'border-[#111827] bg-[#F8FAFC]'
            : 'border-[#E5E7EB] hover:border-[#9CA3AF] hover:bg-[#F8FAFC]'
        } ${isProcessing ? 'pointer-events-none opacity-90' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <Loader2 className="w-10 h-10 text-[#111827] animate-spin" />
            <div>
              <p className="font-medium text-[#111827] text-base">Processing document</p>
              <p className="text-xs text-[#6B7280] mt-1">{processingStage}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center text-[#111827]">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#111827]">
                Drag and drop your file here, or{' '}
                <span className="underline underline-offset-2">browse from your computer</span>
              </p>
              <p className="text-xs text-[#6B7280] mt-1.5 flex items-center justify-center space-x-1">
                <FileText className="w-3.5 h-3.5" />
                <span>PDF only • 10 MB maximum</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md flex items-start space-x-2.5 text-[#DC2626] text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}
    </div>
  );
};
