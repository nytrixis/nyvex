"use client";
import React, { useState, useRef } from "react";
import { useStateContext } from "@/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  FileText, 
  Upload, 
  Download, 
  File, 
  FileImage, 
  FileCode, 
  FileType,
  Trash2,
  ExternalLink
} from "lucide-react";
interface DocumentManagerProps {
  startupId: number;
  isOwner: boolean;
}

// Document types for the dropdown
const documentTypes = [
  { value: "business_plan", label: "Business Plan" },
  { value: "financial_statement", label: "Financial Statement" },
  { value: "legal_document", label: "Legal Document" },
  { value: "pitch_deck", label: "Pitch Deck" },
  { value: "team_profile", label: "Team Profile" },
  { value: "market_research", label: "Market Research" },
  { value: "other", label: "Other" },
];

const DocumentManager: React.FC<DocumentManagerProps> = ({ startupId, isOwner }) => {
  const { uploadDocument, getStartupDocuments, isLoading } = useStateContext();
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentType, setDocumentType] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents on component mount
  React.useEffect(() => {
    fetchDocuments();
  }, [startupId]);

  // Fetch documents from the blockchain
  const fetchDocuments = async () => {
    try {
      const docs = await getStartupDocuments(startupId);
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  // Handle document upload
  const handleUpload = async () => {
    if (!selectedFile || !documentType) return;
    
    try {
      setIsUploading(true);
      await uploadDocument(startupId, selectedFile, documentType);
      
      // Reset form and refresh documents
      setSelectedFile(null);
      setDocumentType("");
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Fetch updated documents
      await fetchDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Get icon based on file type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <FileImage className="h-5 w-5" />;
    if (mimeType.includes('pdf')) return <FileType className="h-5 w-5" />;
    if (mimeType.includes('html') || mimeType.includes('javascript') || mimeType.includes('css')) {
      return <FileCode className="h-5 w-5" />;
    }
    return <FileText className="h-5 w-5" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get document type label
  const getDocumentTypeLabel = (value: string) => {
    const docType = documentTypes.find(type => type.value === value);
    return docType ? docType.label : value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileText className="mr-2 h-5 w-5 text-[#00d8ff]" />
            Documents
          </CardTitle>
          <CardDescription>
            View and manage startup documents
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Upload Section (Only visible to owners) */}
          {isOwner && (
            <div className="mb-6 p-4 bg-zinc-900 rounded-lg border border-zinc-700">
              <h3 className="text-sm font-medium mb-3 text-white">Upload New Document</h3>
              
              <div className="space-y-4">
                {/* Document Type Selection */}
                <div>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* File Input */}
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                  
                  {/* File Preview */}
                  {previewUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-zinc-400 mb-2">Preview:</p>
                      <div className="relative h-32 w-32 overflow-hidden rounded-md border border-zinc-700">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Selected File Info */}
                  {selectedFile && !previewUrl && (
                    <div className="flex items-center space-x-2 text-sm text-zinc-400">
                      <File className="h-4 w-4" />
                      <span>{selectedFile.name}</span>
                      <span>({formatFileSize(selectedFile.size)})</span>
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || !documentType || isUploading}
                  className="bg-[#00d8ff] text-black hover:bg-[#00c5e8]"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {/* Documents List */}
          {documents.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-700">
                    <TableHead className="text-zinc-400">Type</TableHead>
                    <TableHead className="text-zinc-400">Name</TableHead>
                    <TableHead className="text-zinc-400">Size</TableHead>
                    <TableHead className="text-zinc-400">Uploaded</TableHead>
                    <TableHead className="text-zinc-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc, index) => (
                    <TableRow key={index} className="border-zinc-700">
                      <TableCell>
                        <Badge variant="outline" className="bg-zinc-700 text-[#00d8ff] border-none">
                          {getDocumentTypeLabel(doc.documentType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium flex items-center">
                        {getFileIcon(doc.metadata.mimeType)}
                        <span className="ml-2">{doc.metadata.name}</span>
                      </TableCell>
                      <TableCell>{formatFileSize(doc.metadata.size)}</TableCell>
                      <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {/* View/Download Button */}
                          <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-zinc-700 hover:bg-zinc-600 transition-colors"
                          >
                            <Download className="h-4 w-4 text-[#00d8ff]" />
                          </a>
                          
                          {/* View on IPFS Button */}
                          <a 
                            href={`https://gateway.pinata.cloud/ipfs/${doc.metadata.cid}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-zinc-700 hover:bg-zinc-600 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4 text-[#00d8ff]" />
                          </a>
                          
                          {/* Delete Button (Only for owners) */}
                          {isOwner && (
                            <button 
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-zinc-700 hover:bg-red-900 transition-colors"
                              onClick={() => {
                                // Delete functionality would be implemented here
                                alert("Delete functionality would be implemented here");
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-zinc-600 mb-3" />
              <h3 className="text-lg font-medium text-zinc-400">No documents yet</h3>
              <p className="text-zinc-500 mt-1">
                {isOwner 
                  ? "Upload your first document to get started" 
                  : "This startup hasn't uploaded any documents yet"}
              </p>
            </div>
          )}
        </CardContent>
        
        {isOwner && documents.length > 0 && (
          <CardFooter className="border-t border-zinc-700 px-6 py-4">
            <p className="text-xs text-zinc-500">
              Documents are stored on IPFS and linked to this startup on the blockchain.
            </p>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default DocumentManager;
