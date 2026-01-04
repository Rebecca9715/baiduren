import React from 'react';
import { AppView } from '../types';
import { Home, BookHeart, Sparkles, HeartHandshake, Compass } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isFundraiser: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isFundraiser }) => {
  const btnClass = (view: AppView) => 
    `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
      currentView === view ? 'text-warm-700' : 'text-warm-400 hover:text-warm-600'
    }`;

  if (isFundraiser) {
    return (
      <nav className="fixed bottom-0 w-full h-16 bg-white border-t border-warm-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="flex h-full max-w-md mx-auto">
          <button className={btnClass(AppView.FUNDRAISER_DASHBOARD)} onClick={() => setView(AppView.FUNDRAISER_DASHBOARD)}>
             <HeartHandshake size={24} />
             <span className="text-xs font-bold">守护</span>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 w-full h-20 bg-white border-t border-warm-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 rounded-t-3xl">
      <div className="grid grid-cols-4 h-full max-w-md mx-auto px-2">
        <button className={btnClass(AppView.DASHBOARD)} onClick={() => setView(AppView.DASHBOARD)}>
          <Home size={24} strokeWidth={currentView === AppView.DASHBOARD ? 2.5 : 2} />
          <span className="text-[10px] font-bold">小窝</span>
        </button>
        
        <button className={btnClass(AppView.REFRAMER)} onClick={() => setView(AppView.REFRAMER)}>
          <Sparkles size={24} strokeWidth={currentView === AppView.REFRAMER ? 2.5 : 2} />
          <span className="text-[10px] font-bold">语言魔法</span>
        </button>

        <button className={btnClass(AppView.ADAPTATION)} onClick={() => setView(AppView.ADAPTATION)}>
          <Compass size={24} strokeWidth={currentView === AppView.ADAPTATION ? 2.5 : 2} />
          <span className="text-[10px] font-bold">重返向导</span>
        </button>

        <button className={btnClass(AppView.DIARY)} onClick={() => setView(AppView.DIARY)}>
          <BookHeart size={24} strokeWidth={currentView === AppView.DIARY ? 2.5 : 2} />
          <span className="text-[10px] font-bold">心语</span>
        </button>
      </div>
    </nav>
  );
};