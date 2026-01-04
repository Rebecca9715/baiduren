import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Reframer } from './pages/Reframer';
import { Adaptation } from './pages/Adaptation';
import { Diary } from './pages/Diary';
import { FundraiserView } from './pages/FundraiserView';
import { FundraiserIntro } from './pages/FundraiserIntro';
import { AppView, UserProfile, DiaryEntry, UserRole } from './types';
import { ChevronLeft, LogOut } from 'lucide-react';

// Initial Mock User with more data
const MOCK_USER: UserProfile = {
  name: "安安",
  age: 14,
  bullyingExperience: "因为戴牙套和喜欢画画，被班上的同学排挤，还在课桌上乱涂乱画。他们总是嘲笑我的发音，把我的作业本扔到垃圾桶里。",
  targetReturnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  sunshinePoints: 95, // Set close to 100 for easier testing of celebration
  sunshineTarget: 100,
  supporterCount: 12,
  receivedMessages: [
    { id: '1', content: "你的画很美，不要放弃！", date: new Date(Date.now() - 86400000).toISOString(), from: "守护人223" },
    { id: '2', content: "世界因为你的独特而精彩。", date: new Date(Date.now() - 172800000).toISOString(), from: "守护人889" }
  ]
};

export default function App() {
  const [view, setView] = useState<AppView>(AppView.ONBOARDING);
  const [role, setRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  // Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('sunny_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      if (!role) setRole(UserRole.TEEN); 
      setView(AppView.DASHBOARD);
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('sunny_user', JSON.stringify(profile));
    setView(AppView.DASHBOARD);
    setRole(UserRole.TEEN);
  };

  const handleAddToDiary = (content: string, imageUrl?: string) => {
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      content,
      date: new Date().toISOString(),
      mood: 'neutral',
      isFavorite: false
    };
    setDiaryEntries([newEntry, ...diaryEntries]);
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === UserRole.FUNDRAISER) {
      if (!user) setUser(MOCK_USER);
      setView(AppView.FUNDRAISER_INTRO);
    } else {
      if (user) setView(AppView.DASHBOARD);
      else setView(AppView.ONBOARDING);
    }
  };

  const handleBack = () => {
    // Logic for global back button
    if (role === UserRole.FUNDRAISER) {
      if (view === AppView.FUNDRAISER_DASHBOARD) {
        setView(AppView.FUNDRAISER_INTRO); // Go back to intro
      } else if (view === AppView.FUNDRAISER_INTRO) {
        setRole(null); // Logout
        setUser(null);
      } else {
        setView(AppView.FUNDRAISER_DASHBOARD);
      }
    } else if (role === UserRole.TEEN) {
      if (view === AppView.DASHBOARD) {
        // If at dashboard, allow logout/reset
        setRole(null);
        setView(AppView.ONBOARDING);
      } else {
        // If at sub-page, go to dashboard
        setView(AppView.DASHBOARD);
      }
    }
  };

  const addSunshine = (message?: string) => {
    if (user) {
      const updatedMessages = message 
        ? [{ id: Date.now().toString(), content: message, date: new Date().toISOString(), from: "新守护人" }, ...user.receivedMessages] 
        : user.receivedMessages;

      const updated = { 
        ...user, 
        sunshinePoints: user.sunshinePoints + 5,
        receivedMessages: updatedMessages,
        supporterCount: user.supporterCount + 1
      };
      
      setUser(updated);
      localStorage.setItem('sunny_user', JSON.stringify(updated));
    }
  };

  // Role Selection Screen
  if (!role) {
    return (
      <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center p-6 space-y-8 relative">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-warm-300 to-warm-500"></div>
        <h1 className="text-4xl font-extrabold text-warm-800">SunnyPath</h1>
        <div className="space-y-4 w-full max-w-xs">
          <button 
            onClick={() => handleRoleSelect(UserRole.TEEN)}
            className="w-full py-5 bg-white border-2 border-warm-200 rounded-2xl shadow-sm text-warm-700 font-bold text-lg hover:border-warm-400 transition-all"
          >
            我是学生
          </button>
          <button 
            onClick={() => handleRoleSelect(UserRole.FUNDRAISER)}
            className="w-full py-5 bg-warm-500 text-white rounded-2xl shadow-md font-bold text-lg hover:bg-warm-600 transition-all"
          >
            我是守护人
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 font-sans text-warm-900">
      {/* Global Top Navigation */}
      <div className="fixed top-0 left-0 w-full flex justify-between items-center p-4 z-50 pointer-events-none">
        {/* Back Button */}
        {(view !== AppView.ONBOARDING) && (
          <button 
            onClick={handleBack}
            className="pointer-events-auto w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-warm-600 hover:text-warm-800 border border-warm-100 transition-colors"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
        )}

        {/* Reset Button (Moved from main logic to ensure it's always accessible for demo purposes) */}
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="pointer-events-auto p-2 bg-white/50 rounded-full text-warm-400 hover:text-warm-800 backdrop-blur-sm"
          title="Reset Demo"
        >
          <LogOut size={16} />
        </button>
      </div>

      <main className="pt-2"> {/* Add padding top if needed, but pages generally handle it */}
        {view === AppView.ONBOARDING && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        
        {view === AppView.DASHBOARD && user && (
          <Dashboard user={user} />
        )}

        {view === AppView.REFRAMER && (
          <Reframer onSaveToDiary={handleAddToDiary} />
        )}

        {view === AppView.ADAPTATION && (
          <Adaptation onSaveToDiary={handleAddToDiary} />
        )}

        {view === AppView.DIARY && (
          <Diary entries={diaryEntries} addEntry={handleAddToDiary} />
        )}

        {view === AppView.FUNDRAISER_INTRO && (
          <FundraiserIntro onStartFerry={() => setView(AppView.FUNDRAISER_DASHBOARD)} />
        )}

        {view === AppView.FUNDRAISER_DASHBOARD && user && (
          <FundraiserView user={user} addSunshine={addSunshine} />
        )}
      </main>

      {/* Bottom Navigation */}
      {role === UserRole.TEEN && view !== AppView.ONBOARDING && (
        <Navigation 
          currentView={view} 
          setView={setView} 
          isFundraiser={false} 
        />
      )}
      
      {role === UserRole.FUNDRAISER && view === AppView.FUNDRAISER_DASHBOARD && (
         <Navigation 
          currentView={view} 
          setView={setView} 
          isFundraiser={true} 
        />
      )}
    </div>
  );
}