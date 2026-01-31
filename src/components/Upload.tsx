import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PageContainer, PageHeader, Button, ProgressBar } from './ui';
import { MAX_FILE_SIZE_MB, ALLOWED_EXTENSIONS } from '@/config/constants';
import { validateFile, formatFileTypeError, formatFileSizeError } from '@/utils/fileValidation';

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { documents, uploadDocument, uploadProgress, showToast } = useApp();
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
    const invalidTypeFiles: string[] = [];
    const tooLargeFiles: { name: string; size: number }[] = [];

    files.forEach((file) => {
      const validation = validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else if (validation.error === 'invalid_type') {
        invalidTypeFiles.push(file.name);
      } else if (validation.error === 'too_large') {
        tooLargeFiles.push({ name: file.name, size: file.size });
      }
    });

    // Upload valid files
    validFiles.forEach((file) => uploadDocument(file));

    // Show error for invalid file types
    if (invalidTypeFiles.length > 0) {
      showToast('error', formatFileTypeError(invalidTypeFiles));
    }

    // Show error for files that are too large
    if (tooLargeFiles.length > 0) {
      showToast('error', formatFileSizeError(tooLargeFiles));
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

  const qaAction = (
    <Button
      variant={documents.length > 0 ? 'primary' : 'secondary'}
      onClick={() => navigate('/qa')}
    >
      Ask Questions →
    </Button>
  );

  return (
    <PageContainer>
      <PageHeader
        title="Upload Documents"
        subtitle={`Upload your documents to start asking questions. Supports PDF, TXT, DOC, DOCX, RTF, ODT, MD, and CSV files (max ${MAX_FILE_SIZE_MB}MB).`}
        action={qaAction}
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
          border-2 border-dashed rounded-xl p-8 sm:p-12 lg:p-16 text-center cursor-pointer transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
          }
        `}
      >
        <div className="text-5xl sm:text-6xl mb-4 sm:mb-5 pointer-events-none">
          {isDragging ? '📥' : '📄'}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 pointer-events-none">
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-5 pointer-events-none">
          or tap to browse
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
          Maximum file size: {MAX_FILE_SIZE_MB}MB.
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
