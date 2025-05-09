/**
 * Utility functions for document processing with Midday components
 */

/**
 * Document types supported by the processor
 */
export enum DocumentType {
  PDF = 'pdf',
  DOCX = 'docx',
  DOC = 'doc',
  XLSX = 'xlsx',
  XLS = 'xls',
  CSV = 'csv',
  TXT = 'txt',
  IMAGE = 'image',
}

/**
 * Processed document data structure
 */
export interface ProcessedDocument {
  id: string;
  title: string;
  content: string;
  metadata: {
    type: DocumentType;
    size: number; // in bytes
    pageCount?: number;
    createdAt: string;
    processedAt: string;
  };
  analysis?: {
    summary?: string;
    entities?: Record<string, any>[];
    keywords?: string[];
    categories?: string[];
  };
  originalUrl?: string;
}

/**
 * Get the document type from a file name or path
 */
export function getDocumentType(fileName: string): DocumentType {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return DocumentType.PDF;
    case 'docx':
      return DocumentType.DOCX;
    case 'doc':
      return DocumentType.DOC;
    case 'xlsx':
      return DocumentType.XLSX;
    case 'xls':
      return DocumentType.XLS;
    case 'csv':
      return DocumentType.CSV;
    case 'txt':
      return DocumentType.TXT;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return DocumentType.IMAGE;
    default:
      throw new Error(`Unsupported file extension: ${extension}`);
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

/**
 * Creates a document ID from a file name
 */
export function createDocumentId(fileName: string): string {
  return `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/**
 * Helper function to create an empty processed document structure
 */
export function createEmptyDocument(fileName: string, fileSize: number): ProcessedDocument {
  const now = new Date().toISOString();
  return {
    id: createDocumentId(fileName),
    title: fileName,
    content: '',
    metadata: {
      type: getDocumentType(fileName),
      size: fileSize,
      createdAt: now,
      processedAt: now,
    },
  };
}