


import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Paperclip, X, Save, Sparkles, BookOpen, GraduationCap, Copy, 
  FileText, Gamepad2, Zap, ArrowRight, MessageCircle, Lock, Menu, ChevronDown, Mic, LayoutGrid, Plus, Loader2, Image as ImageIcon
} from 'lucide-react';
import { Message, Role, TutorMode, Attachment, SavedKnowledgeItem, GameData, AppNotification } from '../types';
import { generateTutorResponse } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import mammoth from 'mammoth';
import MiniGame from './MiniGame';

interface ChatInterfaceProps {
  currentSessionId: string;
  onSaveKnowledge: (item: SavedKnowledgeItem) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onPlayGame: (data: GameData) => void;
  onAddNotification: (note: AppNotification) => void;
  checkLimit: () => boolean;
  incrementUsage: () => void;
  onToggleSidebar?: () => void;
  onOpenProfile?: () => void;
}

const SUGGESTIONS = [
  { 
    label: "Ngữ Pháp", 
    text: "Giải thích thì Hiện tại hoàn thành (Present Perfect).", 
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  { 
    label: "Từ vựng IELTS", 
    text: "10 từ vựng C1 chủ đề Môi trường (Environment).", 
    icon: Sparkles,
    color: "text-purple-600",
    bg: "bg-purple-100"
  },
  { 
    label: "Mini Game", 
    text: "Tạo game trắc nghiệm về Giới từ.", 
    icon: Gamepad2,
    color: "text-green-600",
    bg: "bg-green-100",
    mode: TutorMode.GAME
  },
  { 
    label: "Giao Tiếp", 
    text: "Đóng vai người bản xứ nói về Sở thích.", 
    icon: MessageCircle,
    color: "text-indigo-600",
    bg: "bg-indigo-100"
  }
];

// Helper: Compress Image to avoid Mobile Browser Crash (White Screen)
const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Limit max dimension to 1920px (Safe for mobile RAM & AI OCR)
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1920;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
             resolve(event.target?.result as string); // Fallback to original
             return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG 0.8 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  currentSessionId, 
  onSaveKnowledge, 
  messages, 
  setMessages, 
  onPlayGame,
  onAddNotification,
  checkLimit,
  incrementUsage,
  onToggleSidebar,
  onOpenProfile
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>(''); // Detailed status
  const [mode, setMode] = useState<TutorMode>(TutorMode.GENERAL);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showMobileModes, setShowMobileModes] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textOverride?: string, modeOverride?: TutorMode, displayTextOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : input;
    const displayText = displayTextOverride || textToSend;
    const modeToUse = modeOverride || mode;

    if ((!textToSend.trim() && attachments.length === 0) || isLoading || isProcessingFile) return;

    if (!checkLimit()) {
      const limitMsg: Message = {
        id: Date.now().toString(),
        role: Role.MODEL,
        text: `🔒 **TÍNH NĂNG ĐÃ BỊ KHÓA**\n\nBạn đã sử dụng hết lưu lượng miễn phí trong ngày. Tính năng chat đã bị khóa ngay lập tức.\n\nĐể tiếp tục sử dụng, vui lòng:\n\n1. Vào mục **Cài đặt (Profile)**\n2. Chọn gói **PRO/VIP**\n3. Liên hệ Zalo để nhận mã kích hoạt ngay lập tức.\n\n👉 *Không gián đoạn học tập - Nâng cấp ngay!*`,
        timestamp: Date.now(),
        modeUsed: modeToUse
      };
      setMessages(prev => [...prev, limitMsg]);
      return;
    }

    if (modeOverride) setMode(modeOverride);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: displayText,
      timestamp: Date.now(),
      attachments: [...attachments],
      modeUsed: modeToUse,
    };

    setMessages(prev => [...prev, userMessage]);
    incrementUsage(); 

    if (typeof textOverride !== 'string') setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      const responseText = await generateTutorResponse(textToSend, userMessage.attachments || [], modeToUse);

      let isGameData = false;
      let finalText = responseText;

      if (modeToUse === TutorMode.GAME) {
         try {
           const jsonMatch = responseText.match(/\{[\s\S]*\}/);
           if (jsonMatch) {
             const potentialJson = jsonMatch[0];
             JSON.parse(potentialJson); 
             finalText = potentialJson;
             isGameData = true;
           }
         } catch (e) {
           console.warn("Failed to parse game data, falling back to text.", e);
         }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: finalText,
        timestamp: Date.now(),
        modeUsed: modeToUse,
        isGameData: isGameData
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: Role.MODEL,
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: Date.now(),
        modeUsed: modeToUse
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCreateGame = () => {
    const lastMsg = messages[messages.length - 1];
    let context = "";
    if (lastMsg) {
      context = `Based on the following content: "${lastMsg.text.slice(0, 500)}...", create a mini game.`;
    } else {
      context = "Create a general English mini game.";
    }
    handleSendMessage(context, TutorMode.GAME, "🎮 Đang kích hoạt chế độ tạo Mini Game từ nội dung trên...");
  };

  const isTextFile = (file: File) => {
    const textTypes = [
      'text/', 'application/json', 'application/javascript', 
      'application/x-javascript', 'application/typescript', 'application/xml'
    ];
    const textExts = ['.md', '.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.c', '.cpp', '.h', '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.sql', '.txt', '.csv', '.html', '.css'];
    return textTypes.some(t => file.type.startsWith(t)) || textExts.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Strict limit for Mobile Stability
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB per file

    setIsProcessingFile(true);
    setProcessingStatus("Đang chuẩn bị...");

    // Process Sequentially to save Memory on Mobile
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProcessingStatus(`Đang xử lý ${i + 1}/${files.length}: ${file.name.slice(0, 15)}...`);
      
      // Small delay to let UI render update
      await new Promise(r => setTimeout(r, 50));

      if (file.size > MAX_SIZE) {
        alert(`File "${file.name}" quá lớn (>50MB). Vui lòng chọn file nhỏ hơn.`);
        continue;
      }

      try {
        // 1. IMAGE HANDLING (Compression)
        if (file.type.startsWith('image/')) {
           setProcessingStatus("Đang nén ảnh...");
           const compressedDataUrl = await compressImage(file);
           setAttachments(prev => [...prev, { mimeType: 'image/jpeg', data: compressedDataUrl, name: file.name, isText: false }]);
        }
        
        // 2. WORD DOCUMENTS
        else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          setProcessingStatus("Đang đọc tài liệu...");
          await new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
              try {
                const arrayBuffer = event.target?.result as ArrayBuffer;
                const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
                setAttachments(prev => [...prev, { mimeType: 'text/plain', data: result.value, name: file.name, isText: true }]);
              } catch (err) { console.error(err); }
              resolve();
            };
            reader.readAsArrayBuffer(file);
          });
        }

        // 3. TEXT FILES
        else if (isTextFile(file)) {
          setProcessingStatus("Đang đọc text...");
          await new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
               setAttachments(prev => [...prev, { mimeType: file.type || 'text/plain', data: event.target?.result as string, name: file.name, isText: true }]);
               resolve();
            };
            reader.readAsText(file);
          });
        }

        // 4. OTHER BINARIES (PDFs, etc)
        else {
           setProcessingStatus("Đang mã hóa...");
           await new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              if (typeof reader.result === 'string') {
                setAttachments(prev => [...prev, { mimeType: file.type, data: reader.result as string, name: file.name, isText: false }]);
              }
              resolve();
            };
            reader.readAsDataURL(file);
          });
        }
      } catch (err) {
        console.error("File processing error", err);
        alert(`Không thể xử lý file: ${file.name}`);
      }
    }

    setProcessingStatus("");
    setIsProcessingFile(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderAttachmentPreview = (att: Attachment) => {
    const isImage = att.mimeType.startsWith('image/');
    if (isImage) {
      return <img src={att.data} alt="attachment" className="h-14 w-14 object-cover rounded-lg border border-gray-200 shadow-sm" />;
    }
    return (
      <div className="h-14 w-14 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center p-1 text-center shadow-sm">
        <FileText className={`w-5 h-5 mb-1 text-gray-500`} />
        <span className="text-[9px] text-gray-600 font-medium break-all line-clamp-1">{att.name || 'File'}</span>
      </div>
    );
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.role === Role.MODEL && msg.isGameData) {
      try {
        const gameData = JSON.parse(msg.text) as GameData;
        return (
          <MiniGame 
            data={gameData} 
            onRequestFullScreen={onPlayGame}
            onPlayLater={(data) => {
              onAddNotification({ 
                id: Date.now().toString(), 
                title: 'Đã lưu Mini Game 🎮', 
                message: `Game "${data.title}" đã được lưu. Nhấn để chơi ngay!`, 
                type: 'achievement', 
                timestamp: Date.now(), 
                isRead: false,
                gameData: data 
              });
            }}
          />
        );
      } catch (e) {
        return <MarkdownRenderer content={msg.text} />;
      }
    }
    return <MarkdownRenderer content={msg.text} />;
  };

  const handleModeSelect = (newMode: TutorMode) => {
    setMode(newMode);
    setShowMobileModes(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative transition-colors duration-300">
      {/* --- HEADER --- */}
      {/* Desktop (md+) */}
      <div className="hidden md:flex h-16 border-b border-gray-200 dark:border-slate-700 items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20 shadow-sm shrink-0 sticky top-0">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 dark:text-gray-100 text-lg tracking-tight">VIP Tutor</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online • AI Expert
            </p>
          </div>
        </div>
        <div className="flex bg-gray-100/80 dark:bg-slate-800/80 p-1 rounded-xl shadow-inner border border-gray-200/50 dark:border-slate-700">
          <button onClick={() => setMode(TutorMode.GENERAL)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${mode === TutorMode.GENERAL ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm scale-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'}`}>General</button>
          <button onClick={() => setMode(TutorMode.EXERCISE)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${mode === TutorMode.EXERCISE ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm scale-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'}`}>Exercises</button>
          <button onClick={() => setMode(TutorMode.THEORY)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${mode === TutorMode.THEORY ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm scale-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'}`}>Theory</button>
          <button onClick={() => setMode(TutorMode.GAME)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${mode === TutorMode.GAME ? 'bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-sm scale-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'}`}>Game</button>
        </div>
      </div>

      {/* Mobile Header (Compact) */}
      <div className="md:hidden h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b dark:border-slate-800 flex items-center justify-between px-3 relative z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={onToggleSidebar} className="text-gray-600 dark:text-gray-300 p-2 active:bg-gray-100 dark:active:bg-slate-800 rounded-full transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative">
             <button 
               onClick={() => setShowMobileModes(!showMobileModes)}
               className="flex items-center gap-1 font-bold text-gray-800 dark:text-white text-lg active:opacity-70 transition-opacity"
             >
               VIP<span className="text-indigo-600 dark:text-indigo-400">Tutor</span> <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showMobileModes ? 'rotate-180' : ''}`} />
             </button>
             {showMobileModes && (
               <div className="absolute top-full left-0 mt-3 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 py-2 animate-pop-in z-50 origin-top-left">
                 <button onClick={() => handleModeSelect(TutorMode.GENERAL)} className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${mode === TutorMode.GENERAL ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                    <MessageCircle className="w-5 h-5" /> General Chat
                 </button>
                 <button onClick={() => handleModeSelect(TutorMode.EXERCISE)} className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${mode === TutorMode.EXERCISE ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                    <Sparkles className="w-5 h-5 text-purple-500" /> Solve Exercises
                 </button>
                 <button onClick={() => handleModeSelect(TutorMode.THEORY)} className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${mode === TutorMode.THEORY ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                    <BookOpen className="w-5 h-5 text-blue-500" /> Theory Expert
                 </button>
                 <button onClick={() => handleModeSelect(TutorMode.GAME)} className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${mode === TutorMode.GAME ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                    <Gamepad2 className="w-5 h-5 text-green-500" /> Mini Game
                 </button>
               </div>
             )}
          </div>
        </div>
        <button 
          onClick={onOpenProfile}
          className="p-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800 rounded-full active:scale-95 transition-transform hover:shadow-md border border-indigo-100 dark:border-slate-700"
        >
           <Sparkles className="w-5 h-5" />
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-5 bg-slate-50 dark:bg-slate-900 relative scroll-smooth pb-24 md:pb-32">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in -mt-10 md:mt-0">
             
             {/* Mobile: Minimalist Welcome */}
             <div className="md:hidden flex flex-col items-center w-full">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-float shadow-lg shadow-indigo-200/50 dark:shadow-none">
                    <GraduationCap className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                   Hôm nay bạn muốn học gì?
                </h2>
                {/* Horizontal Scroll Suggestions */}
                <div className="flex overflow-x-auto gap-3 w-full px-4 pb-4 scrollbar-hide snap-x">
                   {SUGGESTIONS.map((s, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSendMessage(s.text, s.mode as TutorMode)}
                        className="snap-center shrink-0 w-36 p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-lg transition-all text-center flex flex-col items-center gap-3 active:scale-95"
                      >
                         <div className={`p-3 rounded-full ${s.bg} dark:bg-slate-700`}>
                            <s.icon className={`w-6 h-6 ${s.color} dark:text-indigo-300`} />
                         </div>
                         <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{s.label}</span>
                      </button>
                   ))}
                </div>
             </div>
             
             {/* Desktop: Full Welcome */}
             <div className="hidden md:flex flex-col items-center justify-center text-center mb-8 max-w-lg px-4 mt-4">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-xl shadow-indigo-200 dark:shadow-none animate-float">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 tracking-tight">Welcome to VIP Tutor</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                   Hệ thống gia sư AI cao cấp. Sẵn sàng giải bài tập, tạo đề thi và luyện tập tiếng Anh chuyên sâu.
                </p>
             </div>
             <div className="hidden md:grid grid-cols-2 gap-4 w-full max-w-3xl px-4 pb-4">
                {SUGGESTIONS.map((s, idx) => (
                  <button key={idx} onClick={() => handleSendMessage(s.text, s.mode as TutorMode)} className="flex flex-col items-start p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-left relative overflow-hidden active:scale-[0.99]">
                     <div className="flex items-center gap-3 w-full mb-3">
                        <div className={`p-2.5 rounded-xl ${s.bg} dark:bg-slate-700 group-hover:scale-110 transition-transform`}><s.icon className={`w-5 h-5 ${s.color} dark:text-indigo-300`} /></div>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{s.label}</span>
                     </div>
                     <p className="text-sm text-gray-700 dark:text-gray-300 font-medium pr-6 leading-relaxed line-clamp-2">{s.text}</p>
                  </button>
                ))}
             </div>
          </div>
        )}
        
        {messages.map((msg, index) => {
          const isLastMessage = index === messages.length - 1;
          const isModel = msg.role === Role.MODEL;
          return (
            <div key={msg.id} className={`flex w-full animate-slide-up ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-[88%] md:max-w-[70%] rounded-[1.5rem] shadow-sm border px-1 ${msg.role === Role.USER ? 'bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] text-white border-transparent rounded-br-none shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-gray-100 dark:shadow-none'}`}>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="p-3 gap-2 flex flex-wrap">
                    {msg.attachments.map((att, idx) => (<div key={idx} className="relative group transition-transform hover:scale-105">{renderAttachmentPreview(att)}</div>))}
                  </div>
                )}
                <div className="p-3 md:p-5 overflow-x-auto text-[14px] md:text-[15px] leading-relaxed font-sans">
                  {msg.role === Role.USER ? (<p className="whitespace-pre-wrap break-words">{msg.text}</p>) : (renderMessageContent(msg))}
                </div>
                <div className={`px-4 py-2 text-[10px] flex items-center justify-between opacity-70 border-t ${msg.role === Role.USER ? 'border-white/20 text-indigo-50' : 'border-gray-100 dark:border-slate-700 text-gray-400'}`}>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.role === Role.MODEL && !msg.isGameData && (
                     <div className="flex gap-2">
                        <button onClick={() => navigator.clipboard.writeText(msg.text)} className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-1"><Copy className="w-3 h-3" /> Copy</button>
                     </div>
                  )}
                </div>
                {isLastMessage && isModel && !msg.isGameData && !isLoading && (
                  <div className="absolute -bottom-10 left-0 animate-pop-in z-20">
                     <button onClick={handleQuickCreateGame} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 text-xs font-bold py-1.5 px-3 rounded-full shadow-lg hover:bg-green-50 dark:hover:bg-slate-700 hover:scale-105 transition-all"><Zap className="w-3 h-3 fill-green-500 text-green-500" /> Tạo Game</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {(isLoading || isProcessingFile) && (
          <div className="flex justify-start w-full animate-fade-in">
             <div className="bg-white dark:bg-slate-800 p-4 rounded-[1.5rem] rounded-bl-none shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-3">
                  {isProcessingFile ? (
                     <>
                        <ImageIcon className="w-4 h-4 text-pink-500 animate-pulse" />
                        <span className="text-xs text-gray-600 dark:text-gray-300 font-medium animate-pulse">{processingStatus || "Đang xử lý file..."}</span>
                     </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </>
                  )}
               </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- UNIFIED INPUT AREA (Mobile Style for Desktop) --- */}
      <div className="fixed bottom-4 left-0 right-0 md:left-64 z-40 px-3 md:px-0 pointer-events-none">
        <div className="max-w-4xl mx-auto w-full pointer-events-auto">
           {/* Attachment Previews */}
           {attachments.length > 0 && (
            <div className="mb-2 mx-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 p-3 flex gap-3 overflow-x-auto animate-slide-up">
               {attachments.map((att, idx) => (
                  <div key={idx} className="relative inline-block group shrink-0 transition-transform hover:scale-105">
                      {renderAttachmentPreview(att)}
                      <button onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md z-10 hover:bg-red-600 transition-colors"><X className="w-3 h-3" /></button>
                  </div>
               ))}
            </div>
          )}

          {/* Floating Pill Input Bar */}
          <div className="flex items-end gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-black/50 border border-white/50 dark:border-slate-700 rounded-[2rem] p-2 pr-3 transition-all focus-within:shadow-[0_8px_40px_rgb(99,102,241,0.2)] focus-within:border-indigo-200 dark:focus-within:border-indigo-800">
             
             {/* Upload Button */}
             <input type="file" multiple accept="image/*,.pdf,.doc,.docx" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
             <button 
               onClick={() => fileInputRef.current?.click()} 
               className="w-10 h-10 md:w-11 md:h-11 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 shrink-0"
               title="Tải ảnh/file"
             >
               <Plus className="w-5 h-5 md:w-6 md:h-6" />
             </button>

             {/* Text Area */}
             <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                placeholder={isProcessingFile ? "Đang xử lý file..." : mode === TutorMode.EXERCISE ? "Dán bài tập hoặc tải ảnh..." : "Hỏi tôi bất cứ điều gì..."}
                disabled={isProcessingFile}
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 text-gray-800 dark:text-white text-[15px] md:text-base placeholder-gray-400 dark:placeholder-gray-500 min-h-[44px] max-h-32 leading-relaxed"
                rows={1}
             />

             {/* Send Button */}
             <button 
               onClick={() => handleSendMessage()}
               disabled={(!input.trim() && attachments.length === 0) || isLoading || isProcessingFile}
               className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-90 shrink-0 mb-0.5 ${(!input.trim() && attachments.length === 0) || isLoading || isProcessingFile ? 'bg-gray-300 dark:bg-slate-600 shadow-none cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-300 hover:scale-105'}`}
             >
               {isLoading || isProcessingFile ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5 md:w-6 md:h-6 stroke-[3]" />}
             </button>
          </div>
          <div className="text-center mt-2 pb-2">
             <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Hệ thống nén ảnh thông minh - Tiết kiệm 4G/5G</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChatInterface;