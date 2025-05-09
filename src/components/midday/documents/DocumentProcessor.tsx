'use client';

/**
 * Document Processor Component Wrapper for Midday
 * 
 * This component handles document uploading, processing, and analysis.
 * It requires installation of the dependencies listed in midday-package-update.json.
 * 
 * NOTE: This is a placeholder implementation until we install the required dependencies.
 */

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  File, 
  X, 
  FileText, 
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { 
  DocumentType, 
  ProcessedDocument, 
  createEmptyDocument, 
  formatFileSize, 
  getDocumentType 
} from '@/lib/midday/document-utils';

interface DocumentProcessorProps {
  onDocumentProcessed?: (document: ProcessedDocument) => void;
  onError?: (error: Error) => void;
  maxSizeMB?: number;
  allowedTypes?: DocumentType[];
}

export default function DocumentProcessor({
  onDocumentProcessed,
  onError,
  maxSizeMB = 10,
  allowedTypes = Object.values(DocumentType),
}: DocumentProcessorProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processedDocs, setProcessedDocs] = useState<ProcessedDocument[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Maximum file size in bytes
  const maxSize = maxSizeMB * 1024 * 1024;

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize,
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
      setError(null);
    },
    onDropRejected: (rejectedFiles) => {
      // Handle rejected files (too large, wrong type, etc.)
      const errors = rejectedFiles.map(file => {
        if (file.file.size > maxSize) {
          return `File "${file.file.name}" is too large. Max size is ${maxSizeMB}MB.`;
        } else {
          return `File "${file.file.name}" is not a supported type.`;
        }
      });
      setError(errors.join(' '));
    },
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const processFiles = async () => {
    if (files.length === 0) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      // This is a placeholder that simulates document processing
      // In a real implementation, we would use mammoth, unpdf, and officeparser
      // to extract and process document content
      
      const newProcessedDocs: ProcessedDocument[] = [];
      
      for (const file of files) {
        // Create a base document with metadata
        const doc = createEmptyDocument(file.name, file.size);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate content extraction (would use proper libraries in real impl)
        doc.content = `Sample extracted content from ${file.name}. This is a placeholder.`;
        
        // Simulate document analysis
        doc.analysis = {
          summary: `This is a sample ${getDocumentType(file.name)} document.`,
          entities: [],
          keywords: ['sample', 'document', 'test'],
          categories: ['uncategorized'],
        };
        
        // Add to processed documents
        newProcessedDocs.push(doc);
        
        // Call callback if provided
        if (onDocumentProcessed) {
          onDocumentProcessed(doc);
        }
      }
      
      // Update state with processed documents
      setProcessedDocs([...processedDocs, ...newProcessedDocs]);
      
      // Clear files after processing
      setFiles([]);
      
    } catch (err) {
      console.error('Error processing documents:', err);
      setError(err instanceof Error ? err.message : 'Unknown error processing documents');
      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload dropzone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Upload Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            {...getRootProps()} 
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {isDragActive
                ? "Drop files here..."
                : "Drag & drop files here, or click to select files"
              }
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supported files: PDF, Word, Excel, CSV, TXT, Images
              <br />
              Max size: {maxSizeMB}MB
            </p>
          </div>
          
          {/* Error messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {/* File list */}
          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-sm text-gray-700 mb-2">Selected Files ({files.length})</h3>
              <div className="divide-y">
                {files.map((file, index) => (
                  <div key={index} className="py-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <File className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={processFiles} 
                disabled={processing}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Process Files
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Processed documents */}
      {processedDocs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Processed Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {processedDocs.map((doc) => (
                <div key={doc.id} className="py-3">
                  <div className="flex items-start mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">{doc.title}</h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(doc.metadata.size)} • 
                        Processed: {new Date(doc.metadata.processedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Document summary */}
                  {doc.analysis?.summary && (
                    <div className="ml-7 mt-2">
                      <h5 className="text-sm font-medium mb-1">Summary</h5>
                      <p className="text-sm text-gray-700">{doc.analysis.summary}</p>
                    </div>
                  )}
                  
                  {/* Document content preview */}
                  {doc.content && (
                    <div className="ml-7 mt-2">
                      <h5 className="text-sm font-medium mb-1">Content Preview</h5>
                      <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded max-h-24 overflow-y-auto">
                        {doc.content.substring(0, 200)}
                        {doc.content.length > 200 ? '...' : ''}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-md">
        <p className="text-amber-800 text-sm">
          <strong>Note:</strong> This is a placeholder component. The actual implementation will use document processing libraries like mammoth, unpdf, and officeparser to extract and process document content.
        </p>
      </div>
    </div>
  );
}