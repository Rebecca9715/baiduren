import React, { useState } from 'react';
import { UserProfile } from '../types';
import { generateHealingLetter } from '../services/geminiService';
import { ArrowRight, Heart, Ticket, MailOpen, Loader2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [weeks, setWeeks] = useState(4);
  const [offlineCode, setOfflineCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [healingLetter, setHealingLetter] = useState<string>('');

  const handleNextStep3 = async () => {
    if (offlineCode.trim()) {
       // If code exists, generate letter and go to step 4
       setIsGenerating(true);
       try {
         const letter = await generateHealingLetter(name, experience);
         setHealingLetter(letter);
         setStep(4);
       } catch (e) {
         console.error(e);
         // Fallback if fails, just proceed to dashboard
         handleFinish();
       } finally {
         setIsGenerating(false);
       }
    } else {
      // No code, finish immediately
      handleFinish();
    }
  };

  const handleFinish = () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (weeks * 7));
    
    onComplete({
      name: name || '小太阳',
      age: 15,
      bullyingExperience: experience,
      targetReturnDate: targetDate.toISOString(),
      sunshinePoints: 0,
      sunshineTarget: 100, // Target to unlock charity action
      supporterCount: 0,
      receivedMessages: [],
      offlineCode: offlineCode,
      healingLetter: healingLetter
    });
  };

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center p-6 text-warm-900">
      <div className="w-full max-w-md">
        
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-center mb-8">
               <div className="w-20 h-20 bg-warm-200 rounded-full flex items-center justify-center">
                 <Heart className="text-warm-500 w-10 h-10" fill="currentColor" />
               </div>
            </div>
            <h1 className="text-3xl font-extrabold text-center text-warm-800">欢迎来到 SunnyPath</h1>
            <p className="text-center text-warm-600">这里是你的安全角落。我们一起慢慢找回那个发光的自己。</p>
            
            <div className="pt-8">
              <label className="block text-sm font-bold text-warm-700 mb-2">你想让我们怎么称呼你？</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="给自己起个温暖的名字吧"
                className="w-full p-4 rounded-xl bg-white border-2 border-warm-200 focus:border-warm-400 focus:outline-none transition-colors"
              />
            </div>
            <button 
              onClick={() => setStep(2)}
              disabled={!name}
              className="w-full mt-6 bg-warm-500 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-warm-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              下一步 <ArrowRight size={20}/>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-warm-800">你的故事...</h2>
            <p className="text-warm-600">如果愿意，可以简单告诉我之前发生了什么。（这会保密，只用于帮助你）</p>
            
            <textarea 
              value={experience} 
              onChange={(e) => setExperience(e.target.value)}
              placeholder="例如：在学校里..."
              className="w-full h-32 p-4 rounded-xl bg-white border-2 border-warm-200 focus:border-warm-400 focus:outline-none resize-none"
            />

            <button 
              onClick={() => setStep(3)}
              className="w-full mt-6 bg-warm-500 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-warm-600 transition-all"
            >
              继续
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-warm-800">设定目标与惊喜</h2>
            
            <div className="space-y-6">
               <div>
                  <p className="text-warm-700 font-bold mb-2">重返校园小目标</p>
                  <div className="bg-white p-6 rounded-2xl border-2 border-warm-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-warm-500 font-bold text-xl">{weeks} 周</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="24" 
                      value={weeks} 
                      onChange={(e) => setWeeks(Number(e.target.value))}
                      className="w-full h-2 bg-warm-200 rounded-lg appearance-none cursor-pointer accent-warm-500"
                    />
                  </div>
               </div>

               <div>
                  <p className="text-warm-700 font-bold mb-2 flex items-center gap-2">
                    <Ticket size={16} /> 
                    线下活动编码 (选填)
                  </p>
                  <input 
                    type="text" 
                    value={offlineCode} 
                    onChange={(e) => setOfflineCode(e.target.value)}
                    placeholder="参加过线下活动请输入"
                    className="w-full p-4 rounded-xl bg-white border-2 border-warm-200 focus:border-warm-400 focus:outline-none"
                  />
                  <p className="text-xs text-warm-500 mt-2">输入编码，AI 将为你生成一封专属疗愈信件。</p>
               </div>
            </div>

            <button 
              onClick={handleNextStep3}
              disabled={isGenerating}
              className="w-full mt-6 bg-gradient-to-r from-warm-400 to-warm-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : (offlineCode ? '生成专属信件' : '开启旅程')}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in space-y-6 flex flex-col h-[80vh]">
            <h2 className="text-2xl font-bold text-warm-800 text-center">来自远方的信</h2>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-warm-100 relative overflow-y-auto flex-1 custom-scrollbar">
               {/* Letter Decor */}
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-healing-blue to-healing-green"></div>
               <MailOpen className="text-warm-300 w-12 h-12 mb-4 mx-auto" />
               
               <div className="prose prose-warm text-warm-800 leading-loose whitespace-pre-wrap font-serif">
                 {healingLetter}
               </div>

               <div className="mt-8 text-right text-warm-500 font-serif italic text-sm">
                 —— 懂你的 SunnyPath
               </div>
            </div>

            <button 
              onClick={handleFinish}
              className="w-full mt-4 bg-warm-500 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-warm-600 transition-all"
            >
              收藏并进入小屋
            </button>
          </div>
        )}

      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fed7aa; border-radius: 4px; }
      `}</style>
    </div>
  );
};