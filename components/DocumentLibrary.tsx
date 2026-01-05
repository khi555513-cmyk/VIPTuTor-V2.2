
import React, { useState } from 'react';
import { DOCUMENT_LIBRARY, ZALO_CONSULTATION_URL } from '../constants';
import { DocumentItem, AccountTier } from '../types';
import { FileText, Download, Lock, Search, Filter, FolderOpen, Crown, Eye, Heart, MessageCircle, X } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface DocumentLibraryProps {
  userTier: AccountTier;
  onUpgradeRequired: () => void;
}

const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ userTier, onUpgradeRequired }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'THCS' | 'THPT' | 'IELTS' | 'KHAC'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]); // Should persist in real app

  const filteredDocs = DOCUMENT_LIBRARY.filter(doc => {
    const matchTab = activeTab === 'ALL' || doc.category === activeTab;
    const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleDownload = (doc: DocumentItem) => {
    if (doc.isVipOnly && userTier !== 'vip') {
      onUpgradeRequired();
      return;
    }
    // Simulate download
    alert(`Đang tải xuống: ${doc.title}\n(Link dummy trong demo)`);
  };

  const handlePreview = (doc: DocumentItem) => {
    if (doc.isVipOnly && userTier !== 'vip') {
      onUpgradeRequired();
      return;
    }
    setPreviewDoc(doc);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const TabButton = ({ label, value }: { label: string, value: typeof activeTab }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap active:scale-95 ${
        activeTab === value 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 flex flex-col relative">
      <div className="h-16 border-b border-gray-200 dark:border-slate-800 flex items-center px-4 md:px-6 bg-white dark:bg-slate-900 shadow-sm shrink-0">
        <h1 className="font-bold text-lg md:text-xl text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-indigo-600" />
          Kho Tài Liệu Ôn Thi
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm kiếm tài liệu..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              <TabButton label="Tất cả" value="ALL" />
              <TabButton label="THCS (Lớp 6-9)" value="THCS" />
              <TabButton label="THPT (Lớp 10-12)" value="THPT" />
              <TabButton label="IELTS" value="IELTS" />
              <TabButton label="Khác" value="KHAC" />
            </div>
          </div>

          {/* Document Grid */}
          {filteredDocs.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400 animate-fade-in">
              <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Không tìm thấy tài liệu phù hợp.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
              {filteredDocs.map((doc) => {
                const isLocked = doc.isVipOnly && userTier !== 'vip';
                const isFav = favorites.includes(doc.id);
                return (
                  <div key={doc.id} onClick={() => handlePreview(doc)} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col relative group cursor-pointer animate-slide-up">
                    {doc.isVipOnly && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm z-10">
                        <Crown className="w-3 h-3 fill-white" /> VIP
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4 mb-3">
                      <div className={`p-3 rounded-lg shrink-0 transition-transform group-hover:scale-110 duration-300 ${doc.fileType === 'PDF' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm line-clamp-2 leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{doc.title}</h3>
                        <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-slate-700 dark:text-gray-300 px-2 py-0.5 rounded-md">
                          {doc.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                      {doc.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700 mt-auto">
                      <div className="flex gap-2">
                         <button 
                           onClick={(e) => toggleFavorite(doc.id, e)}
                           className={`p-1.5 rounded-lg transition-all ${isFav ? 'bg-pink-50 text-pink-500' : 'hover:bg-gray-100 text-gray-400'}`}
                         >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-pink-500' : ''}`} />
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); handlePreview(doc); }}
                           className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-all"
                           title="Xem trước"
                         >
                            <Eye className="w-4 h-4" />
                         </button>
                      </div>

                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                          isLocked 
                            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-not-allowed dark:bg-slate-700 dark:text-gray-400' 
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                        }`}
                      >
                        {isLocked ? <Lock className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                        {isLocked ? 'Khóa VIP' : 'Tải về'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Zalo Contact Bubble */}
      <a 
        href={ZALO_CONSULTATION_URL} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute bottom-6 right-6 z-30 group"
      >
         <div className="absolute -top-10 right-0 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Liên hệ Admin
         </div>
         <div className="relative w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 cursor-pointer zalo-ring">
            <MessageCircle className="w-8 h-8 text-white fill-white" />
         </div>
      </a>

      {/* Preview Modal - Z-Index 100 to cover sidebar */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setPreviewDoc(null)}>
           <div className="bg-white dark:bg-slate-900 w-full md:max-w-6xl h-full md:h-[95vh] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col relative" onClick={(e) => e.stopPropagation()}>
              
              <div className="h-14 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center px-4 bg-gray-50 dark:bg-slate-900 shrink-0">
                 <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <h3 className="font-bold text-gray-800 dark:text-white truncate">{previewDoc.title}</h3>
                 </div>
                 <button onClick={() => setPreviewDoc(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex-1 bg-gray-200 dark:bg-black/50 p-0 overflow-hidden relative">
                 {/* 
                    PRIORITY: Native PDF Viewer 
                    Req: "Mở trực tiếp file dưới định dạng pdf" (Open direct file in pdf format)
                    Req: "Không được tự ý scan văn bản" (Do not scan text) -> Do not use MarkdownRenderer for PDFs
                 */}
                 {previewDoc.fileType === 'PDF' ? (
                    <iframe 
                        // Use a fallback sample PDF if the URL is a dummy placeholder, to demonstrate the viewer works.
                        // In a real app, this would be the actual URL.
                        src={previewDoc.downloadUrl === '#' ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" : `${previewDoc.downloadUrl}#toolbar=0`}
                        className="w-full h-full border-none"
                        title={previewDoc.title}
                    />
                 ) : previewDoc.content ? (
                    // For non-PDF types (like DOCX text extraction), we can still use the markdown renderer
                    <div className="h-full overflow-y-auto p-8 md:p-16 custom-scrollbar">
                       <div className="bg-white text-slate-900 p-8 shadow-xl min-h-full max-w-4xl mx-auto rounded-sm border border-gray-300">
                          <MarkdownRenderer content={previewDoc.content} />
                       </div>
                    </div>
                 ) : (
                    /* Fallback for files without content or URL */
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-slate-900">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 mb-2">Bản xem trước không khả dụng cho tài liệu này.</p>
                        <p className="text-sm text-gray-400 mb-6">Vui lòng tải xuống để xem nội dung đầy đủ.</p>
                        <button 
                            onClick={() => handleDownload(previewDoc)}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-md active:scale-95 transition-all flex items-center gap-2"
                        >
                           <Download className="w-4 h-4" /> Tải tài liệu
                        </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DocumentLibrary;
