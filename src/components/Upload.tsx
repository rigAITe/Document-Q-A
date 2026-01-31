import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useApp } from '@/context/AppContext';
import { PageContainer, PageHeader, Button, ProgressBar } from './ui';

const ALLOWED_MIME_TYPES = [
  'text/plain',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/rtf',
  'text/rtf',
  'application/vnd.oasis.opendocument.text',
  'text/markdown',
  'text/csv',
];

const ALLOWED_EXTENSIONS = ['.txt', '.pdf', '.doc', '.docx', '.rtf', '.odt', '.md', '.csv'];

const isValidDocumentFile = (file: File): boolean => {
  if (ALLOWED_MIME_TYPES.includes(file.type)) {
    return true;
  }
  const fileName = file.name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
};

export const Upload: React.FC = () => {
  const { uploadDocument, uploadProgress, showToast } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (dragCounterRef.current === 1) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFiles = (files: File[]): void => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      if (isValidDocumentFile(file)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    validFiles.forEach((file) => uploadDocument(file));

    if (invalidFiles.length > 0) {
      const fileNames =
        invalidFiles.length > 2
          ? `${invalidFiles.slice(0, 2).join(', ')} and ${invalidFiles.length - 2} more`
          : invalidFiles.join(', ');
      showToast(
        'error',
        `Invalid file type: ${fileNames}. Only documents (PDF, TXT, DOC, DOCX, RTF, ODT, MD, CSV) are allowed.`
      );
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Upload Documents"
        subtitle="Upload your documents to start asking questions. Supports PDF, TXT, DOC, DOCX, RTF, ODT, MD, and CSV files."
      />

      <div
        role="button"
        tabIndex={0}
        aria-label="Drop zone for file upload. Click or drag files here."
        aria-describedby="upload-instructions"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleButtonClick();
          }
        }}
        className={`
          border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
          }
        `}
      >
        <div className="text-6xl mb-5 pointer-events-none">
          {isDragging ? '📥' : '📄'}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 pointer-events-none">
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 pointer-events-none">
          or click to browse
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick();
          }}
          className={isDragging ? 'pointer-events-none' : ''}
        >
          Select Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_EXTENSIONS.join(',')}
          onChange={handleFileInput}
          className="sr-only"
          aria-label="File upload input"
        />
        <span id="upload-instructions" className="sr-only">
          Supported file types: PDF, TXT, DOC, DOCX, RTF, ODT, MD, CSV. 
          You can drag and drop files or click to browse.
        </span>
      </div>

      {uploadProgress.length > 0 && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Upload Progress
          </h3>
          <div className="flex flex-col gap-3">
            {uploadProgress.map((progress) => (
              <ProgressBar
                key={progress.documentId}
                progress={progress.progress}
                status={progress.status}
                error={progress.error}
              />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
};
