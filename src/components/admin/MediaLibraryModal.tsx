'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  Copy,
  CheckCircle2,
  Search,
  Loader2,
  ExternalLink,
  Plus,
} from 'lucide-react';

export interface MediaFileItem {
  name: string;
  path: string;
  id?: string;
  size?: number;
  mimetype?: string;
  createdAt?: string;
  publicUrl: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  mode: 'featured' | 'insert';
  storageFolder?: 'blog' | 'services' | 'general' | 'documents';
  folder?: 'blog' | 'services' | 'general' | 'documents';
  onSelect: (result: {
    url: string;
    altText?: string;
    caption?: string;
    alignment?: 'center' | 'left' | 'right';
  }) => void;
  onClose: () => void;
}

export default function MediaLibraryModal({
  isOpen,
  mode,
  storageFolder = 'blog',
  folder,
  onSelect,
  onClose,
}: MediaLibraryModalProps) {
  const activeFolder = folder || storageFolder;
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [files, setFiles] = useState<MediaFileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<MediaFileItem | null>(null);

  // Insert options
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [alignment, setAlignment] = useState<'center' | 'left' | 'right'>('center');

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch files when modal opens
  useEffect(() => {
    if (!isOpen) return;
    loadFiles();
  }, [isOpen, activeFolder]);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/storage/list?bucket=website-media&folder=${activeFolder}`
      );
      const data = await res.json();
      if (data.files && Array.isArray(data.files)) {
        setFiles(data.files);
        if (data.files.length > 0 && !selectedFile) {
          setSelectedFile(data.files[0]);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'website-media');
      formData.append('folder', activeFolder);

      const res = await fetch('/api/admin/storage/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      const newFileItem: MediaFileItem = {
        name: data.filename || file.name,
        path: data.path,
        size: data.size || file.size,
        publicUrl: data.publicUrl,
      };

      setFiles((prev) => [newFileItem, ...prev]);
      setSelectedFile(newFileItem);
      setActiveTab('library');
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = async (item: MediaFileItem) => {
    if (!confirm(`Delete image "${item.name}" from storage bucket?`)) return;

    try {
      await fetch('/api/admin/storage/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket: 'website-media', url: item.publicUrl }),
      });

      setFiles((prev) => prev.filter((f) => f.path !== item.path));
      if (selectedFile?.path === item.path) {
        setSelectedFile(null);
      }
    } catch {
      // ignore
    }
  };

  const handleConfirmSelect = () => {
    if (!selectedFile) return;
    onSelect({
      url: selectedFile.publicUrl,
      altText: altText || selectedFile.name,
      caption,
      alignment,
    });
    onClose();
  };

  const handleCopyLink = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.publicUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-5xl h-[88vh] max-h-[760px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Mode */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF6F0] text-[#1A8F4B] flex items-center justify-center shadow-xs">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0D3B3E]">
                {mode === 'featured' ? 'Select Featured Image' : 'Insert Image into Content'}
              </h2>
              <p className="text-[11px] text-slate-500">
                Supabase Storage Bucket: <span className="font-mono text-[#1A8F4B]">website-media/{storageFolder}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch buttons */}
            <div className="flex items-center p-1 bg-slate-200/60 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'library'
                    ? 'bg-white text-[#0D3B3E] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Media Library ({files.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'upload'
                    ? 'bg-white text-[#0D3B3E] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Area */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'upload' ? (
            /* Upload Tab */
            <div className="flex-1 p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-slate-50/40">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files);
                }}
                className="w-full max-w-lg p-10 border-2 border-dashed border-[#1A8F4B]/40 hover:border-[#1A8F4B] bg-white rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer group shadow-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 rounded-2xl bg-[#EAF6F0] text-[#1A8F4B] flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-800">
                  {isUploading ? 'Uploading to Supabase Storage...' : 'Upload Image to Storage'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Drag and drop files here, or click to browse. Supports JPG, PNG, WEBP up to 10MB.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />

                <button
                  type="button"
                  disabled={isUploading}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-[#0C4A4E] hover:bg-[#083639] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Browse File
                </button>
              </div>

              {uploadError && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 max-w-md">
                  {uploadError}
                </div>
              )}
            </div>
          ) : (
            /* Media Library Tab */
            <>
              {/* Left: Thumbnail Grid */}
              <div className="flex-1 flex flex-col border-r border-slate-100 overflow-hidden bg-slate-50/30">
                {/* Search Bar */}
                <div className="p-3.5 border-b border-slate-100 bg-white flex items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search image name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-8.5 pl-8.5 pr-3 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:border-[#1A8F4B]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={loadFiles}
                    className="text-xs text-[#1A8F4B] hover:underline font-bold"
                  >
                    Refresh
                  </button>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                  {isLoading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin text-[#1A8F4B]" />
                      <span className="text-xs">Loading media assets...</span>
                    </div>
                  ) : filteredFiles.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400 text-center">
                      <ImageIcon className="w-10 h-10 stroke-1" />
                      <p className="text-xs font-semibold text-slate-600">No media assets found</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className="px-4 py-2 rounded-xl bg-[#0C4A4E] text-white text-xs font-bold"
                      >
                        Upload First Image
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                      {filteredFiles.map((file) => {
                        const isSelected = selectedFile?.path === file.path;
                        return (
                          <div
                            key={file.path}
                            onClick={() => setSelectedFile(file)}
                            className={`group relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-100 shadow-2xs ${
                              isSelected
                                ? 'border-[#1A8F4B] ring-2 ring-[#1A8F4B]/30 scale-[0.98]'
                                : 'border-transparent hover:border-slate-300'
                            }`}
                          >
                            <Image
                              src={file.publicUrl}
                              alt={file.name}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#1A8F4B] text-white flex items-center justify-center shadow-md">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                              <p className="text-[10px] text-white font-medium truncate">
                                {file.name}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Selected Image Details & Actions */}
              <div className="w-72 sm:w-80 border-l border-slate-100 bg-white flex flex-col overflow-y-auto p-5 space-y-5">
                {selectedFile ? (
                  <>
                    <div className="space-y-2">
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                        <Image
                          src={selectedFile.publicUrl}
                          alt={selectedFile.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800 break-all leading-snug">
                          {selectedFile.name}
                        </p>
                        <div className="flex items-center justify-between text-[10.5px] text-slate-400 font-mono">
                          <span>
                            {selectedFile.size
                              ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                              : 'Uploaded Asset'}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-1 text-[#1A8F4B] hover:underline cursor-pointer"
                          >
                            {copiedUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mode specific options */}
                    {mode === 'insert' && (
                      <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Alt Text (Image Description)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Audit documentation schedule"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Caption (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Figure 1: CBMS workflow"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Alignment
                          </label>
                          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
                            {(['left', 'center', 'right'] as const).map((align) => (
                              <button
                                key={align}
                                type="button"
                                onClick={() => setAlignment(align)}
                                className={`py-1 text-[11px] font-semibold rounded capitalize transition-all cursor-pointer ${
                                  alignment === align
                                    ? 'bg-white text-[#0D3B3E] shadow-2xs font-bold'
                                    : 'text-slate-500'
                                }`}
                              >
                                {align}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Buttons */}
                    <div className="pt-4 border-t border-slate-100 space-y-2 mt-auto">
                      <button
                        type="button"
                        onClick={handleConfirmSelect}
                        className="w-full py-2.5 rounded-xl bg-[#0C4A4E] hover:bg-[#083639] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {mode === 'featured'
                            ? 'Set as Featured Image'
                            : 'Insert Image into Content'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteFile(selectedFile)}
                        className="w-full py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete from Storage</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 p-4">
                    <ImageIcon className="w-8 h-8 stroke-1 mb-2" />
                    <p className="text-xs">Select an image to preview details</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
