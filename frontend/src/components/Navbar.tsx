import React from 'react';
import { BookOpen, RefreshCw, LogOut } from 'lucide-react';

interface NavbarProps {
  hasDocument: boolean;
  onReset: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ hasDocument, onReset, onLogout }) => {
  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#E5E7EB] sticky top-0 z-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-md bg-[#111827] text-white flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-semibold text-lg text-[#111827] tracking-tight">StudyMate</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-normal text-[#6B7280] border-l border-[#E5E7EB] pl-2">
              AI Study Assistant
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {hasDocument && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 text-xs font-medium text-[#111827] bg-[#F8FAFC] hover:bg-[#E5E7EB] border border-[#E5E7EB] px-3 py-1.5 rounded-md transition-colors cursor-pointer"
              title="Upload a new document"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>Change Document</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center space-x-1.5 text-xs font-medium text-[#6B7280] hover:text-[#DC2626] bg-[#FFFFFF] hover:bg-[#FEF2F2] border border-[#E5E7EB] px-3 py-1.5 rounded-md transition-colors cursor-pointer"
              title="Sign out of StudyMate"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
