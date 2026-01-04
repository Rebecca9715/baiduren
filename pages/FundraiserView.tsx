import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Sun, Heart, TrendingUp, Ship, Download, X, Share2, QrCode, Sparkles } from 'lucide-react';
import { generateSharePoster } from '../services/geminiService';

interface FundraiserViewProps {
  user: UserProfile;
  addSunshine: (message?: string) => void;
}

export const FundraiserView: React.FC<FundraiserViewProps> = ({ user, addSunshine }) => {
  const [message, setMessage] = useState('');
  const [showDailyPoster, setShowDailyPoster] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string>('');
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [ferrymanRank, setFerrymanRank] = useState(0);
  
  const progressPercent = Math.min(100, (user.sunshinePoints / user.sunshineTarget) * 100);
  const isTargetReached = user.sunshinePoints >= user.sunshineTarget;

  // Calculate weeks target
  const targetDate = new Date(user.targetReturnDate);
  const now = new Date();
  const diffTime = Math.max(0, targetDate.getTime() - now.getTime());
  const weeksLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));

  const handleFerry = async () => {
    addSunshine(message);
    setMessage('');
    
    // Simulate Ferryman Rank
    setFerrymanRank(Math.floor(Math.random() * 8000) + 1000);

    // If target reached, trigger celebration
    if (user.sunshinePoints + 5 >= user.sunshineTarget) {
       setTimeout(() => setShowCelebration(true), 500);
    } else {
       // Otherwise show daily poster
       setIsGeneratingPoster(true);
       setShowDailyPoster(true);
       const url = await generateSharePoster('daily');
       setPosterUrl(url);
       setIsGeneratingPoster(false);
    }
  };

  const handleGenerateCompletionPoster = async () => {
    setIsGeneratingPoster(true);
    const url = await generateSharePoster('completion');
    setPosterUrl(url);
    setIsGeneratingPoster(false);
  };

  // Celebration Full Screen Animation
  if (showCelebration) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 overflow-hidden flex flex-col items-center justify-center animate-fade-in">
        
        {/* Sky changing from dark to light */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-warm-900 animate-sky-change"></div>
        
        {/* The Boat Animation */}
        <div className="absolute top-1/2 left-0 w-full animate-boat-cross">
           <div className="text-white opacity-80 transform scale-x-[-1] flex justify-center">
             <Ship size={120} strokeWidth={0.5} />
           </div>
        </div>

        {/* The Shore (Appears at end) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-warm-200/20 to-transparent opacity-0 animate-shore-appear flex items-center justify-end pr-10">
           <div className="w-4 h-4 bg-yellow-200 rounded-full shadow-[0_0_50px_20px_rgba(253,230,138,0.8)]"></div>
        </div>

        {/* Celebration Modal Content */}
        <div className="z-10 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center max-w-sm mx-6 opacity-0 animate-content-appear shadow-2xl mt-48">
           <h2 className="text-3xl font-bold text-white mb-2">完成旅程</h2>
           <p className="text-white/80 mb-6">恭喜你！成功将一名孩子渡到安全的彼岸！</p>
           
           <button 
             onClick={() => { setShowCelebration(false); setShowDailyPoster(false); handleGenerateCompletionPoster(); }}
             className="w-full bg-white text-warm-600 font-bold py-3 rounded-xl shadow-lg hover:bg-warm-50 transition-colors flex items-center justify-center gap-2"
           >
             <Share2 size={18} />
             生成纪念海报
           </button>
           <button 
             onClick={() => setShowCelebration(false)}
             className="mt-4 text-white/60 text-sm hover:text-white"
           >
             关闭
           </button>
        </div>

        <style>{`
          @keyframes sky-change {
            0% { background: #0f172a; }
            100% { background: #d97706; } /* warm-600/amber */
          }
          @keyframes boat-cross {
            0% { transform: translateX(-100px) translateY(0px) rotate(2deg); }
            50% { transform: translateX(50vw) translateY(-10px) rotate(-2deg); }
            100% { transform: translateX(100vw) translateY(0px) rotate(0deg); opacity: 0; }
          }
          @keyframes shore-appear {
            0% { opacity: 0; }
            80% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes content-appear {
            0% { opacity: 0; transform: translateY(20px); }
            90% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-sky-change { animation: sky-change 4s ease-out forwards; }
          .animate-boat-cross { animation: boat-cross 4s ease-in-out forwards; }
          .animate-shore-appear { animation: shore-appear 4s ease-out forwards; }
          .animate-content-appear { animation: content-appear 4s ease-out forwards; }
        `}</style>
      </div>
    );
  }

  // Common Poster View (For Daily or Completion)
  if (posterUrl || (isGeneratingPoster && (showDailyPoster || showCelebration === false))) {
    const isCompletion = user.sunshinePoints >= user.sunshineTarget && !showDailyPoster;
    
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-6 animate-fade-in overflow-y-auto backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden relative border-4 border-white">
           
           <button onClick={() => { setPosterUrl(''); setShowDailyPoster(false); }} className="absolute top-4 right-4 z-10 bg-black/20 p-1 rounded-full text-white hover:bg-black/40 transition-colors"><X size={20} /></button>

           {isGeneratingPoster ? (
             <div className="h-96 flex flex-col items-center justify-center bg-warm-50 text-warm-800">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-warm-500 mb-4"></div>
                <p className="font-bold text-warm-600">正在绘制你的专属海报...</p>
             </div>
           ) : (
             <div className="relative">
                {/* Poster Image */}
                <div className="aspect-[3/4] bg-warm-100 relative">
                  <img src={posterUrl} alt="Poster" className="w-full h-full object-cover" />
                  
                  {/* Poster Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white text-center">
                    
                    {isCompletion ? (
                       <div className="mb-6 animate-fade-in">
                         <div className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold mb-2 uppercase tracking-wider">Mission Complete</div>
                         <h2 className="text-3xl font-extrabold mb-2 text-white drop-shadow-md">旅程圆满</h2>
                         <p className="opacity-95 leading-relaxed font-medium">
                           恭喜你！成功将 <span className="text-yellow-300">{user.name}</span> <br/>渡到了安全的彼岸！
                         </p>
                       </div>
                    ) : (
                       <div className="mb-6 animate-fade-in">
                         <p className="font-medium text-lg mb-4 leading-relaxed">
                           <span className="font-bold text-yellow-300 text-xl">亲爱的守护人</span>，<br/>
                           你是第 <span className="font-mono text-3xl font-black text-white border-b-2 border-yellow-400 px-1 mx-1">{ferrymanRank}</span> 位<br/>
                           完成守护的“数字摆渡人”。
                         </p>
                         <p className="text-sm font-bold bg-white/20 backdrop-blur-sm py-2 px-4 rounded-xl inline-block">
                           今天，你完成了一次摆渡。
                         </p>
                       </div>
                    )}
                    
                    {/* Footer with QR */}
                    <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-center gap-4">
                       <div className="bg-white p-1.5 rounded-xl shadow-lg">
                         <QrCode className="text-warm-900 w-12 h-12" />
                       </div>
                       <div className="text-left">
                         <p className="text-xs text-yellow-200 font-bold uppercase tracking-widest mb-0.5">SunnyPath</p>
                         <p className="text-sm font-bold">扫码加入摆渡计划</p>
                       </div>
                    </div>
                  </div>
                </div>
             </div>
           )}

           <div className="p-4 bg-warm-50">
             <button 
               className="w-full bg-gradient-to-r from-warm-500 to-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transform active:scale-95 transition-all"
               onClick={() => alert("海报已保存到相册 (模拟)")}
               disabled={isGeneratingPoster}
             >
               <Download size={20} />
               保存海报并分享
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 px-6 pt-16 max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Sunny Header Card */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-[2rem] text-white shadow-xl shadow-orange-200 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
           <Sun size={120} strokeWidth={1.5} />
        </div>
        <div className="absolute bottom-0 left-0 p-4 opacity-10">
           <Ship size={80} strokeWidth={1} />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-orange-100 font-bold text-xs uppercase tracking-wider mb-1">正在守护</p>
              <h1 className="text-3xl font-black tracking-tight">{user.name}</h1>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-xs font-bold">
               SunnyPath
            </div>
          </div>
          
          <p className="opacity-90 text-sm mb-8 font-medium leading-relaxed max-w-[80%]">
            "每一束光，都能照亮回归的路。谢谢你的每一次摆渡。"
          </p>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center text-warm-900 shadow-sm">
            <div>
              <p className="text-[10px] text-warm-500 font-bold uppercase tracking-wider">当前摆渡值</p>
              <p className="text-3xl font-black text-warm-600">{user.sunshinePoints}</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-warm-500 font-bold uppercase tracking-wider">距离彼岸</p>
               <p className="text-xl font-extrabold text-warm-600">{user.sunshineTarget - user.sunshinePoints} <span className="text-xs font-bold text-warm-400">点</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-warm-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-warm-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-warm-500" /> 
            重返进度
          </h3>
          <span className="text-xs bg-warm-100 text-warm-600 px-3 py-1 rounded-full font-bold">目标: {weeksLeft} 周后</span>
        </div>
        
        <div className="w-full bg-warm-100 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-orange-300 to-warm-500 h-4 rounded-full transition-all duration-1000 relative" 
            style={{ width: `${progressPercent}%` }}
          >
             <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50"></div>
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-warm-400 font-bold uppercase tracking-widest mt-2">
           <span>起点</span>
           <span>彼岸</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-warm-100 relative overflow-hidden">
         <Sparkles className="absolute -top-2 -right-2 text-warm-100 w-16 h-16 transform rotate-12" />
         <h3 className="font-bold text-warm-800 mb-3 relative z-10">大致经历</h3>
         <div className="text-warm-600 text-sm leading-relaxed bg-warm-50 p-5 rounded-2xl border border-warm-100 relative z-10">
           {user.bullyingExperience || "该用户尚未详细填写经历。"}
         </div>
      </div>

      {/* Interaction Area */}
      {!isTargetReached ? (
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-warm-100 sticky bottom-24">
           <h3 className="font-bold text-warm-800 mb-4 text-sm uppercase flex items-center gap-2">
             <div className="p-1.5 bg-warm-100 rounded-lg text-warm-500"><Ship size={18} /></div>
             为TA摆渡
           </h3>
           <textarea
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             placeholder="写一句鼓励的话吧（可选）..."
             className="w-full h-24 bg-warm-50 rounded-2xl p-4 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-warm-300 resize-none transition-all placeholder:text-warm-300 text-warm-700"
           />
           <button 
            onClick={handleFerry}
            className="w-full bg-gradient-to-r from-warm-500 to-orange-500 hover:from-warm-600 hover:to-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            <Sun className="fill-white text-white w-5 h-5 group-hover:rotate-45 transition-transform" />
            为TA摆渡 (每日打卡)
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-healing-green to-emerald-500 p-8 rounded-[2rem] shadow-lg shadow-emerald-200 text-white text-center transform hover:scale-[1.02] transition-transform">
           <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
           </div>
           <h3 className="font-black text-2xl mb-2">彼岸已达！</h3>
           <p className="text-sm opacity-90 mb-6 font-medium">你已成功帮助 {user.name} 积攒了足够的勇气能量。</p>
           <button 
             onClick={() => setShowCelebration(true)}
             className="bg-white text-emerald-600 px-8 py-3 rounded-full font-bold shadow-sm hover:bg-emerald-50 transition-colors"
           >
             重温抵达时刻
           </button>
        </div>
      )}

      <p className="text-center text-xs text-warm-400 mt-4 pb-4 font-medium">
        每当摆渡值达到 {user.sunshineTarget}，我们将联合公益机构为孩子送出一份具体的关怀。
      </p>
    </div>
  );
};