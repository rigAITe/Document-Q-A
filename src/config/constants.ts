export const MAX_QUESTION_LENGTH = 500;
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ALLOWED_MIME_TYPES = [
  'text/plain',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/rtf',
  'text/rtf',
  'application/vnd.oasis.opendocument.text',
  'text/markdown',
  'text/csv',
] as const;

export const ALLOWED_EXTENSIONS = ['.txt', '.pdf', '.doc', '.docx', '.rtf', '.odt', '.md', '.csv'] as const;

export const OPENAI_MODEL = 'gpt-3.5-turbo';
export const OPENAI_MAX_TOKENS = 1000;
export const OPENAI_TEMPERATURE = 0.7;
export const OPENAI_MAX_CONTENT_CHARS = 12000;

export const UPLOAD_PROGRESS_CLEAR_DELAY = 1000;
export const UPLOAD_PROGRESS_INTERVAL = 200;
export const UPLOAD_PROGRESS_INCREMENT = 10;
export const UPLOAD_PROGRESS_MAX = 90;

export const DEFAULT_TOAST_DURATION = 5000;
export const ERROR_TOAST_DURATION = 3000;
