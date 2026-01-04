import React, { useState } from 'react';
import { Ship, ArrowRight, CloudRain } from 'lucide-react';

interface FundraiserIntroProps {
  onStartFerry: () => void;
}

export const FundraiserIntro: React.FC<FundraiserIntroProps> = ({ onStartFerry }) => {
  const [isHovering, setIsHovering] = useState(false);

  // Simulated hurtful words forming the river
  const hurtfulWords = [
    "你真笨", "没人喜欢你", "滚出去", "怪胎", "不仅丑还作怪", 
    "别来上学了", "多余的人", "无论怎么做都是错的", "失败者", 
    "爱哭鬼", "你没救了", "都是你的错", "累赘", "消失吧"
  ];

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* Background Ambience (Rain) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute bg-slate-400 w-[1px] h-10 animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDuration: `${0.5 + Math.random()}s`,
                animationDelay: `${Math.random()}s`
              }}
            />
         ))}
      </div>

      {/* Content Container */}
      <div className="z-10 text-center space-y-8 relative">
        <h2 className="text-slate-400 text-sm tracking-widest uppercase mb-12 animate-pulse">
          等待摆渡的灵魂...
        </h2>

        {/* The Boat Interaction */}
        <div 
          className="relative group cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={onStartFerry}
        >
          {/* Action Prompt */}
          <div className={`absolute -top-16 left-1/2 -translate-x-1/2 transition-all duration-500 ${isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-white/10 backdrop-blur-md text-white px-6 py-2 rounded-full border border-white/20 flex items-center gap-2 whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <span>开始摆渡</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Boat Icon */}
          <div className={`transition-transform duration-700 ease-in-out ${isHovering ? 'scale-110 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-slate-500'}`}>
            <Ship size={80} strokeWidth={1} />
          </div>
          
          {/* Reflection */}
          <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 blur-sm transform scale-y-[-0.5] opacity-30 transition-colors duration-700 ${isHovering ? 'text-white' : 'text-slate-600'}`}>
            <Ship size={80} strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* The River of Hurtful Words */}
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none flex flex-col justify-end pb-10 overflow-hidden">
         {/* Layer 1 */}
         <div className="flex whitespace-nowrap animate-flow-slow opacity-20 text-slate-500 text-xl font-serif">
            {hurtfulWords.map((word, i) => <span key={i} className="mx-8">{word}</span>)}
            {hurtfulWords.map((word, i) => <span key={`dup-${i}`} className="mx-8">{word}</span>)}
         </div>
         {/* Layer 2 */}
         <div className="flex whitespace-nowrap animate-flow-fast opacity-30 text-slate-600 text-lg mt-4 font-serif">
            {hurtfulWords.reverse().map((word, i) => <span key={i} className="mx-12">{word}</span>)}
            {hurtfulWords.map((word, i) => <span key={`dup-2-${i}`} className="mx-12">{word}</span>)}
         </div>
         {/* Layer 3 */}
         <div className="flex whitespace-nowrap animate-flow-medium opacity-10 text-slate-700 text-2xl mt-4 font-serif">
            {hurtfulWords.map((word, i) => <span key={i} className="mx-6">{word}</span>)}
            {hurtfulWords.map((word, i) => <span key={`dup-3-${i}`} className="mx-6">{word}</span>)}
         </div>
      </div>

      <style>{`
        @keyframes flow-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes flow-fast {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes flow-medium {
          0% { transform: translateX(-20%); }
          100% { transform: translateX(-70%); }
        }
        @keyframes rain {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(200px); opacity: 0; }
        }
        .animate-flow-slow { animation: flow-slow 20s linear infinite; }
        .animate-flow-fast { animation: flow-fast 15s linear infinite; }
        .animate-flow-medium { animation: flow-medium 25s linear infinite; }
        .animate-rain { animation: rain 1s linear infinite; }
      `}</style>
    </div>
  );
};