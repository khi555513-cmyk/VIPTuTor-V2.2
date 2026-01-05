
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import SavedView from './components/SavedView';
import NotificationView from './components/NotificationView';
import TestPrepSystem from './components/TestPrepSystem';
import HelpModal from './components/HelpModal';
import MiniGame from './components/MiniGame';
import UserProfileView from './components/UserProfile';
import SubscriptionExpiredModal from './components/SubscriptionExpiredModal';
import LimitReachedModal from './components/LimitReachedModal';
import ApiKeyModal from './components/ApiKeyModal';
import DocumentLibrary from './components/DocumentLibrary';
import { ChatSession, SavedKnowledgeItem, Message, Role, AppNotification, GameData, UserProfile, DailyUsage } from './types';
import { TIER_LIMITS } from './constants';
import { Menu } from 'lucide-react';
import { getApiKey } from './services/geminiService';

const App: React.FC = () => {
  // Ref to track if we are in the process of resetting data
  const isResettingRef = useRef(false);

  // --- API Key State ---
  // Initialize directly from getApiKey to avoid modal flash since we now have a default key
  const [hasApiKey, setHasApiKey] = useState<boolean>(!!getApiKey());

  // Check key on mount (safety check)
  useEffect(() => {
    const key = getApiKey();
    if (key) {
      setHasApiKey(true);
    }
  }, []);

  // --- App Data State ---
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('vip_tutor_sessions');
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return [{ id: 'default', title: 'New Session', createdAt: Date.now(), messages: [] }];
    } catch (e) {
      return [{ id: 'default', title: 'New Session', createdAt: Date.now(), messages: [] }];
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    try {
      const savedSessions = localStorage.getItem('vip_tutor_sessions');
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
             return parsed[parsed.length - 1].id; 
        }
      }
      return 'default';
    } catch (e) {
      return 'default';
    }
  });

  const [savedItems, setSavedItems] = useState<SavedKnowledgeItem[]>(() => {
    try {
      const saved = localStorage.getItem('vip_tutor_saved');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('vip_tutor_notifications');
      if (saved) return JSON.parse(saved);
      return [];
    } catch (e) {
      return [];
    }
  });

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('vip_tutor_profile');
      // Default to 'basic' if not present or new user
      const defaultProfile: UserProfile = { 
        name: 'Bạn Học Viên', 
        joinDate: Date.now(), 
        target: 'Giao tiếp cơ bản',
        accountTier: 'basic',
        subscriptionExpiry: null,
        usedCodes: [] 
      };
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch (e) {
      return { name: 'Bạn Học Viên', joinDate: Date.now(), target: 'Giao tiếp cơ bản', accountTier: 'basic', subscriptionExpiry: null, usedCodes: [] };
    }
  });

  // Daily Usage State
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>(() => {
    try {
      const saved = localStorage.getItem('vip_tutor_usage');
      const today = new Date().toISOString().split('T')[0];
      if (saved) {
        const parsed: DailyUsage = JSON.parse(saved);
        if (parsed.date === today) {
          return parsed;
        }
      }
      return { date: today, messagesCount: 0, testsGenerated: 0, gamesPlayed: 0 };
    } catch (e) {
      return { date: new Date().toISOString().split('T')[0], messagesCount: 0, testsGenerated: 0, gamesPlayed: 0 };
    }
  });

  const [currentView, setCurrentView] = useState<'chat' | 'saved' | 'notifications' | 'test-prep' | 'profile' | 'library'>('chat');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [fullScreenGameData, setFullScreenGameData] = useState<GameData | null>(null);

  // Expiry Modal State
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [expiredPackageName, setExpiredPackageName] = useState('');

  // Limit Reached Modal State
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [limitModalMessage, setLimitModalMessage] = useState('');

  // --- Effects for Persistence ---
  // We check !isResettingRef.current to prevent writing stale data back to localStorage during a reset
  useEffect(() => {
    if (!isResettingRef.current) localStorage.setItem('vip_tutor_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (!isResettingRef.current) localStorage.setItem('vip_tutor_saved', JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    if (!isResettingRef.current) localStorage.setItem('vip_tutor_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (!isResettingRef.current) localStorage.setItem('vip_tutor_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (!isResettingRef.current) localStorage.setItem('vip_tutor_usage', JSON.stringify(dailyUsage));
  }, [dailyUsage]);

  // --- NEW FEATURE NOTIFICATION CHECK ---
  useEffect(() => {
    const hasSeenUpdate = localStorage.getItem('has_seen_update_v2_2'); // Version bump key
    if (!hasSeenUpdate) {
      // 1. Add notification
      const updateNotification: AppNotification = {
        id: Date.now().toString(),
        title: 'Cập nhật Tính năng Mới! 🎉',
        message: 'Ứng dụng vừa được nâng cấp: Chế độ Tối/Sáng đã được loại bỏ để tập trung vào trải nghiệm học tập tốt nhất.',
        type: 'tip',
        timestamp: Date.now(),
        isRead: false
      };
      setNotifications(prev => [updateNotification, ...prev]);
      
      // 2. Play Sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 (Ding)
        oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (e) {
        console.warn("Audio playback failed or blocked");
      }

      localStorage.setItem('has_seen_update_v2_2', 'true');
    }
  }, []);

  // --- HANDLER: Add Notification ---
  const handleAddNotification = (note: AppNotification) => {
    setNotifications(prev => [note, ...prev]);
  };

  // --- WATCHDOG: Subscription Expiry Check ---
  // Runs immediately and then every 30s to ensure real-time downgrade
  useEffect(() => {
    const checkExpiry = () => {
      // Only check if not already basic and has an expiry date
      if (userProfile.accountTier !== 'basic' && userProfile.subscriptionExpiry) {
        if (Date.now() > userProfile.subscriptionExpiry) {
          // EXPIRED! Downgrade immediately.
          const oldTierName = userProfile.accountTier === 'vip' ? 'VIP' : 'PRO';
          
          setExpiredPackageName(oldTierName);
          setShowExpiryModal(true); // TRIGGER BUBBLE MODAL

          setUserProfile(prev => ({
            ...prev,
            accountTier: 'basic',
            subscriptionExpiry: null
          }));

          handleAddNotification({
            id: Date.now().toString(),
            title: 'Hết hạn gói cước',
            message: `Bạn đã sử dụng hết lưu lượng gói ${oldTierName}. Tài khoản đã tự động trở về gói Cơ Bản (giới hạn tính năng). Hãy đăng ký/gia hạn thêm để tiếp tục sử dụng các tính năng nâng cao.`,
            type: 'system',
            timestamp: Date.now(),
            isRead: false
          });
        }
      }
    };

    checkExpiry(); // Run once on mount/update
    const interval = setInterval(checkExpiry, 30000); // Run every 30 seconds
    return () => clearInterval(interval);
  }, [userProfile.subscriptionExpiry, userProfile.accountTier]);

  // --- Logic for Limits & Usage ---
  const checkLimit = (type: 'message' | 'test' | 'game'): boolean => {
    // 1. Double check tier expiry before allowing action
    if (userProfile.subscriptionExpiry && userProfile.accountTier !== 'basic') {
       if (Date.now() > userProfile.subscriptionExpiry) {
          // It's expired, force basic logic (state update will happen via useEffect, but block this action now)
          const basicLimits = TIER_LIMITS['basic'];
          if (type === 'message' && dailyUsage.messagesCount >= basicLimits.messages) return false;
          if (type === 'test' && dailyUsage.testsGenerated >= basicLimits.tests) return false;
          if (type === 'game' && dailyUsage.gamesPlayed >= basicLimits.games) return false;
          return true; // Technically if within basic limits, allow, but mostly it's a hard stop for premium features
       }
    }

    const tier = userProfile.accountTier;
    const limits = TIER_LIMITS[tier];

    if (type === 'message' && dailyUsage.messagesCount >= limits.messages) return false;
    if (type === 'test' && dailyUsage.testsGenerated >= limits.tests) return false;
    if (type === 'game' && dailyUsage.gamesPlayed >= limits.games) return false;

    return true;
  };

  const incrementUsage = (type: 'message' | 'test' | 'game') => {
    setDailyUsage(prev => {
      const today = new Date().toISOString().split('T')[0];
      // If date changed mid-session
      if (prev.date !== today) {
        return { 
          date: today, 
          messagesCount: type === 'message' ? 1 : 0, 
          testsGenerated: type === 'test' ? 1 : 0, 
          gamesPlayed: type === 'game' ? 1 : 0 
        };
      }
      return {
        ...prev,
        messagesCount: type === 'message' ? prev.messagesCount + 1 : prev.messagesCount,
        testsGenerated: type === 'test' ? prev.testsGenerated + 1 : prev.testsGenerated,
        gamesPlayed: type === 'game' ? prev.gamesPlayed + 1 : prev.gamesPlayed
      };
    });
  };

  // --- Handlers (Existing) ---
  const getCurrentMessages = () => {
    return sessions.find(s => s.id === currentSessionId)?.messages || [];
  };

  const setMessages = (updateFn: React.SetStateAction<Message[]>) => {
    setSessions(prevSessions => {
      const newSessions = prevSessions.map(session => {
        if (session.id === currentSessionId) {
          const newMessages = typeof updateFn === 'function' ? updateFn(session.messages) : updateFn;
          // Title update logic
          let newTitle = session.title;
          if (session.title === 'New Session' && newMessages.length > 0) {
             const firstUserMsg = newMessages.find(m => m.role === Role.USER);
             if (firstUserMsg) {
                newTitle = firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '');
             }
          }
          return { ...session, messages: newMessages, title: newTitle };
        }
        return session;
      });
      return newSessions;
    });
  };

  const handleNewSession = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: 'New Session',
      createdAt: Date.now(),
      messages: []
    };
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newId);
    setCurrentView('chat');
    setIsMobileMenuOpen(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch sử đoạn chat này không?")) return;
    const remainingSessions = sessions.filter(s => s.id !== sessionId);
    if (remainingSessions.length === 0) {
      const newId = Date.now().toString();
      const newSession = { id: newId, title: 'New Session', createdAt: Date.now(), messages: [] };
      setSessions([newSession]);
      setCurrentSessionId(newId);
    } else {
      setSessions(remainingSessions);
      if (sessionId === currentSessionId) {
         setCurrentSessionId(remainingSessions[remainingSessions.length - 1].id);
      }
    }
  };

  const handleSaveKnowledge = (item: SavedKnowledgeItem) => {
    setSavedItems(prev => [...prev, item]);
    const newNotification: AppNotification = {
      id: Date.now().toString(),
      title: 'Đã lưu kiến thức mới',
      message: `Bạn đã lưu "${item.title}" vào kho kiến thức cá nhân.`,
      type: 'system',
      timestamp: Date.now(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleDeleteKnowledge = (id: string) => {
    if(confirm("Are you sure you want to delete this?")) {
      setSavedItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- Subscription Cancellation Handler ---
  const handleCancelSubscription = () => {
     if(window.confirm("Bạn có chắc chắn muốn hủy gói cước hiện tại? Tài khoản sẽ trở về gói Basic (Miễn phí) ngay lập tức.")) {
        setUserProfile(prev => ({
           ...prev,
           accountTier: 'basic',
           subscriptionExpiry: null
        }));
        handleAddNotification({
          id: Date.now().toString(),
          title: 'Đã hủy gói cước',
          message: 'Gói cước của bạn đã được hủy thành công. Tài khoản đã trở về gói Cơ Bản.',
          type: 'system',
          timestamp: Date.now(),
          isRead: false
        });
     }
  };

  const handleResetApp = () => {
    if(window.confirm('CẢNH BÁO: Hành động này sẽ xóa toàn bộ lịch sử chat và cài đặt. Bạn có chắc chắn không?')) {
       // Flag to prevent effects from writing back stale state
       isResettingRef.current = true;
       
       // Clear storage
       localStorage.clear();
       
       // Reload to reset state
       window.location.reload();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderContent = () => {
    if (currentView === 'test-prep') {
      return (
        <TestPrepSystem 
          onBack={() => setCurrentView('chat')} 
          checkLimit={() => checkLimit('test')}
          incrementUsage={() => incrementUsage('test')}
        />
      );
    }

    if (currentView === 'library') {
      return (
        <DocumentLibrary 
          userTier={userProfile.accountTier}
          onUpgradeRequired={() => {
            setLimitModalMessage("Tài liệu này chỉ dành cho tài khoản VIP. Hãy nâng cấp ngay để tải về!");
            setIsLimitModalOpen(true);
          }}
        />
      );
    }

    if (currentView === 'chat') {
       return (
         <ChatInterface 
           currentSessionId={currentSessionId}
           onSaveKnowledge={handleSaveKnowledge}
           messages={getCurrentMessages()}
           setMessages={setMessages}
           onPlayGame={(data) => {
              if (checkLimit('game')) {
                incrementUsage('game');
                setFullScreenGameData(data);
              } else {
                setLimitModalMessage("Bạn đã hết lượt chơi game hôm nay. Vui lòng nâng cấp gói để chơi thêm!");
                setIsLimitModalOpen(true);
              }
           }}
           onAddNotification={handleAddNotification}
           checkLimit={() => checkLimit('message')}
           incrementUsage={() => incrementUsage('message')}
           onToggleSidebar={() => setIsMobileMenuOpen(true)}
           onOpenProfile={() => setCurrentView('profile')}
         />
       );
    }
    
    if (currentView === 'saved') {
      return <SavedView items={savedItems} onDelete={handleDeleteKnowledge} />;
    }
    
    if (currentView === 'notifications') {
      return (
        <NotificationView 
          notifications={notifications} 
          onMarkAllRead={handleMarkAllNotificationsRead} 
          onDelete={handleDeleteNotification} 
          onMarkRead={handleMarkNotificationRead}
          onPlayGameFromNotification={(data) => {
             // Play from notification -> Launch Full Screen Game
             if (checkLimit('game')) {
               incrementUsage('game');
               setFullScreenGameData(data);
             } else {
               setLimitModalMessage("Bạn đã hết lượt chơi game hôm nay. Vui lòng nâng cấp gói để chơi thêm!");
               setIsLimitModalOpen(true);
             }
          }}
        />
      );
    }

    if (currentView === 'profile') {
      return (
        <UserProfileView 
          profile={userProfile} 
          onUpdateProfile={setUserProfile} 
          dailyUsage={dailyUsage}
          onCancelSubscription={handleCancelSubscription}
          onResetApp={handleResetApp}
        />
      );
    }
  };

  if (!hasApiKey) {
    return <ApiKeyModal onSuccess={() => setHasApiKey(true)} />;
  }

  return (
    <div className={`flex h-[100dvh] bg-gray-100 dark:bg-slate-900 overflow-hidden relative transition-colors duration-300`}>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      <SubscriptionExpiredModal 
        isOpen={showExpiryModal} 
        onClose={() => setShowExpiryModal(false)}
        onRenew={() => {
          setShowExpiryModal(false);
          setCurrentView('profile');
        }}
        expiredPackageName={expiredPackageName}
      />

      <LimitReachedModal 
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        onUpgrade={() => {
          setIsLimitModalOpen(false);
          setCurrentView('profile');
        }}
        message={limitModalMessage}
      />

      {fullScreenGameData && (
        // Increased Z-Index to 100 to cover Sidebar (z-50)
        <div className="fixed inset-0 z-[100] bg-gray-100 dark:bg-slate-900 animate-fade-in flex flex-col">
          <MiniGame 
             data={fullScreenGameData} 
             isFullScreenMode={true} 
             onCloseFullScreen={() => setFullScreenGameData(null)}
          />
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="absolute inset-0 bg-black/50 z-[45] md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}>
        <Sidebar 
          sessions={sessions}
          currentSessionId={currentSessionId}
          onNewSession={handleNewSession}
          onSelectSession={(id) => { setCurrentSessionId(id); setIsMobileMenuOpen(false); }}
          onDeleteSession={handleDeleteSession}
          savedItems={savedItems}
          currentView={currentView}
          setCurrentView={(view) => { setCurrentView(view); setIsMobileMenuOpen(false); }}
          onOpenHelp={() => setIsHelpOpen(true)}
          unreadNotificationsCount={unreadCount}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      <div className="flex-1 flex flex-col h-full w-full min-w-0">
        {/* Only show default mobile header if NOT in chat view */}
        {currentView !== 'chat' && (
          <div className="md:hidden h-14 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center px-4 justify-between flex-shrink-0">
             <span className="font-bold text-gray-800 dark:text-white">VIP Tutor</span>
             <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 dark:text-gray-300">
               <Menu className="w-6 h-6" />
             </button>
          </div>
        )}
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
