
import React, { useState } from 'react';
import { AppNotification, GameData } from '../types';
import { Bell, CheckCheck, Trash2, Info, Trophy, Lightbulb, ShieldAlert, Clock, X, Play } from 'lucide-react';

interface NotificationViewProps {
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  onMarkRead: (id: string) => void;
  onPlayGameFromNotification?: (data: GameData) => void;
}

const NotificationView: React.FC<NotificationViewProps> = ({ 
  notifications, 
  onMarkAllRead, 
  onDelete, 
  onMarkRead,
  onPlayGameFromNotification
}) => {
  const [selectedNote, setSelectedNote] = useState<AppNotification | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'admin': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'achievement': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'tip': return <Lightbulb className="w-5 h-5 text-indigo-500" />;
      case 'system':
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'admin': return 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800';
      case 'achievement': return 'bg-yellow-50 border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'tip': return 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800';
      case 'system':
      default: return 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  const handleClick = (item: AppNotification) => {
    if (!item.isRead) {
      onMarkRead(item.id);
    }
    setSelectedNote(item);
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 flex flex-col relative">
      <div className="h-16 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="font-bold text-xl text-gray-800 dark:text-white">Thông Báo</h1>
          <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs font-medium">
            {notifications.length}
          </span>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={onMarkAllRead}
            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {notifications.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-center">
             <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-full mb-4">
               <Bell className="w-8 h-8 text-gray-400 dark:text-gray-600" />
             </div>
             <h3 className="text-gray-800 dark:text-white font-medium mb-1">Không có thông báo nào</h3>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Bạn sẽ nhận được tin tức và cập nhật tại đây.</p>
           </div>
        ) : (
          <div className="grid gap-4 max-w-3xl mx-auto">
            {notifications.slice().sort((a, b) => b.timestamp - a.timestamp).map((item) => (
              <div 
                key={item.id} 
                className={`relative group rounded-xl p-4 border transition-all duration-200 cursor-pointer ${item.isRead ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 opacity-80 hover:opacity-100' : 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800 shadow-md transform scale-[1.01]'}`}
                onClick={() => handleClick(item)}
              >
                {!item.isRead && (
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
                
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full flex-shrink-0 ${getBgColor(item.type)}`}>
                    {getIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 pr-6">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold text-sm ${item.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                        {item.title}
                      </h3>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed line-clamp-2 ${item.isRead ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {item.message}
                    </p>
                    
                    {item.gameData && onPlayGameFromNotification && (
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           onPlayGameFromNotification(item.gameData!);
                         }}
                         className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold shadow-sm transition-transform active:scale-95"
                       >
                          <Play className="w-3 h-3 fill-current" /> Chơi ngay
                       </button>
                    )}
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="absolute bottom-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Xóa thông báo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-slate-700">
             <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getBgColor(selectedNote.type)}`}>
                         {getIcon(selectedNote.type)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedNote.title}</h2>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(selectedNote.timestamp).toLocaleString('vi-VN')}</span>
                      </div>
                   </div>
                   <button onClick={() => setSelectedNote(null)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500">
                     <X className="w-6 h-6" />
                   </button>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                   {selectedNote.message}
                </div>
                
                {selectedNote.gameData && onPlayGameFromNotification && (
                   <button 
                     onClick={() => {
                        onPlayGameFromNotification(selectedNote.gameData!);
                        setSelectedNote(null);
                     }}
                     className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md transition-all active:scale-95"
                   >
                      <Play className="w-5 h-5 fill-current" /> Bắt đầu trò chơi
                   </button>
                )}
             </div>
             <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 flex justify-end">
                <button 
                  onClick={() => setSelectedNote(null)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium active:scale-95 transition-transform"
                >
                  Đóng
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationView;
