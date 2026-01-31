import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '@/config/constants';
import { formatFileSize } from '@/utils/formatters';

export type FileValidationError = 'invalid_type' | 'too_large';

export type FileValidationResult = {
  isValid: boolean;
  error?: FileValidationError;
};

export const validateFile = (file: File): FileValidationResult => {
  const isValidType = ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number]) ||
    ALLOWED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

  if (!isValidType) {
    return { isValid: false, error: 'invalid_type' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { isValid: false, error: 'too_large' };
  }

  return { isValid: true };
};

export const formatFileTypeError = (fileNames: string[]): string => {
  const fileList = fileNames.length > 2
    ? `${fileNames.slice(0, 2).join(', ')} and ${fileNames.length - 2} more`
    : fileNames.join(', ');

  return `Invalid file type: ${fileList}. Only documents (${ALLOWED_EXTENSIONS.join(', ').toUpperCase()}) are allowed.`;
};

export const formatFileSizeError = (files: { name: string; size: number }[]): string => {
  const fileDetails = files
    .slice(0, 2)
    .map((f) => `${f.name} (${formatFileSize(f.size)})`)
    .join(', ');
  const moreText = files.length > 2 ? ` and ${files.length - 2} more` : '';

  return `File too large: ${fileDetails}${moreText}. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
};
