type OfficeParserGlobal = {
  parseOffice: (file: ArrayBuffer | File, config?: Record<string, unknown>) => Promise<{
    toText: () => string;
  }>;
};

declare global {
  interface Window {
    officeParser?: OfficeParserGlobal;
  }
}

const OFFICE_PARSER_CDN = 'https://unpkg.com/officeparser@6.0.4/dist/officeparser.browser.js';
const PDF_WORKER_SRC = 'https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs';

const TEXT_EXTENSIONS = new Set(['.txt', '.md', '.csv']);
const LEGACY_DOC_EXTENSION = '.doc';
/** Formats that require OfficeParser; do not fall back to file.text() (produces garbage). */
const BINARY_FORMAT_EXTENSIONS = new Set(['.pdf', '.docx', '.rtf', '.odt']);

const getFileExtension = (fileName: string): string => {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : '';
};

const loadOfficeParser = (): Promise<OfficeParserGlobal> => {
  return new Promise((resolve, reject) => {
    if (window.officeParser) {
      resolve(window.officeParser);
      return;
    }

    const script = document.createElement('script');
    script.src = OFFICE_PARSER_CDN;
    script.async = true;
    script.onload = () => {
      if (window.officeParser) {
        resolve(window.officeParser);
      } else {
        reject(new Error('OfficeParser failed to load.'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load OfficeParser script.'));
    document.head.appendChild(script);
  });
};

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = getFileExtension(file.name);

  // Fast path for plain text formats
  if (TEXT_EXTENSIONS.has(ext)) {
    return (await file.text()).trim();
  }

  const buffer = await file.arrayBuffer();

  try {
    const officeParser = await loadOfficeParser();
    const ast = await officeParser.parseOffice(buffer, {
      newlineDelimiter: '\n',
      pdfWorkerSrc: PDF_WORKER_SRC,
    });
    const text = ast?.toText?.() ?? '';
    return text.trim();
  } catch (err) {
    // PDF/DOCX/RTF/ODT must use OfficeParser; file.text() would send raw binary garbage to the API
    if (BINARY_FORMAT_EXTENSIONS.has(ext)) {
      throw new Error(
        'Could not extract text from this file. If you see this in production, ensure the document extraction script can load (check browser console for blocked scripts).'
          + (err instanceof Error ? ` ${err.message}` : '')
      );
    }
    // Fallback: best-effort for legacy .doc only
    if (ext === LEGACY_DOC_EXTENSION) {
      const decoded = new TextDecoder('latin1').decode(buffer);
      const cleaned = decoded
        .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleaned.length > 0) {
        return cleaned;
      }
    }

    const fallback = await file.text();
    return fallback.trim();
  }
}
