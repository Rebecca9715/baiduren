import React, { useState } from 'react';
import { reframeLanguage } from '../services/geminiService';
import { ReframeResult } from '../types';
import { Sparkles, ArrowRight, Save, Loader2, Volume2 } from 'lucide-react';

interface ReframerProps {
  onSaveToDiary: (content: string, imageUrl?: string) => void;
}

export const Reframer: React.FC<ReframerProps> = ({ onSaveToDiary }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReframeResult | null>(null);

  const handleReframe = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await reframeLanguage(input);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      const entryContent = `
        [语言重构]
        原话：${result.originalText}
        解读：${result.warmExplanation}
        行动：${result.solution}
      `;
      onSaveToDiary(entryContent, result.imageUrl);
      alert("已保存到日记本！");
    }
  };

  return (
    <div className="pb-24 px-6 pt-8 max-w-md mx-auto min-h-screen flex flex-col">
      <h1 className="text-2xl font-extrabold text-warm-800 mb-2">语言魔法屋 <Sparkles className="inline w-6 h-6 text-warm-400"/></h1>
      <p className="text-warm-600 text-sm mb-6">输入那些让你难过的话（或者是你对自己的否定），让我们一起给它施个魔法。</p>

      {!result && (
        <div className="flex-1 flex flex-col gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例如：“你真笨，什么都做不好”..."
            className="w-full h-40 p-4 rounded-2xl bg-white border-2 border-warm-200 focus:border-warm-400 focus:outline-none resize-none shadow-sm"
          />
          
          <div className="flex gap-2 flex-wrap">
             <span className="text-xs bg-white px-3 py-1 rounded-full text-warm-500 border border-warm-100 cursor-pointer" onClick={() => setInput("大家都不喜欢我")}>大家都不喜欢我</span>
             <span className="text-xs bg-white px-3 py-1 rounded-full text-warm-500 border border-warm-100 cursor-pointer" onClick={() => setInput("我真的很没用")}>我真的很没用</span>
             <span className="text-xs bg-white px-3 py-1 rounded-full text-warm-500 border border-warm-100 cursor-pointer" onClick={() => setInput("别回来上学了")}>别回来上学了</span>
          </div>

          <button
            onClick={handleReframe}
            disabled={loading || !input}
            className="mt-auto mb-6 bg-gradient-to-r from-warm-400 to-warm-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>施展魔法 <Sparkles size={18} /></>}
          </button>
        </div>
      )}

      {result && (
        <div className="flex-1 animate-fade-in space-y-6">
          {/* Generated Image Card */}
          <div className="bg-white p-3 rounded-3xl shadow-sm border border-warm-100">
             <div className="relative aspect-square rounded-2xl overflow-hidden bg-warm-50">
               {result.imageUrl ? (
                 <img src={result.imageUrl} alt="Healing art" className="w-full h-full object-cover" />
               ) : (
                 <div className="flex items-center justify-center h-full text-warm-300">Image Loading...</div>
               )}
               <button className="absolute bottom-3 right-3 bg-white/80 p-2 rounded-full backdrop-blur-sm text-warm-700 hover:bg-white">
                 <Save size={20} onClick={() => alert('图片已保存到相册 (模拟)')} />
               </button>
             </div>
          </div>

          {/* Analysis Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-warm-100 space-y-4">
             <div>
               <h3 className="text-warm-400 font-bold text-xs uppercase tracking-wider mb-1">温暖解读</h3>
               <p className="text-warm-800 font-medium leading-relaxed">{result.warmExplanation}</p>
             </div>
             
             <div className="bg-warm-50 p-4 rounded-xl">
               <h3 className="text-warm-400 font-bold text-xs uppercase tracking-wider mb-1">心理悄悄话</h3>
               <p className="text-warm-700 text-sm leading-relaxed">{result.psychAnalysis}</p>
             </div>

             <div>
               <h3 className="text-healing-green font-bold text-xs uppercase tracking-wider mb-2">小小行动</h3>
               <div className="flex items-start gap-3 bg-healing-green/10 p-3 rounded-xl text-emerald-800 text-sm">
                 <ArrowRight className="shrink-0 mt-0.5 w-4 h-4" />
                 {result.solution}
               </div>
             </div>
          </div>

          <div className="flex gap-3 pb-6">
            <button 
              onClick={() => setResult(null)}
              className="flex-1 py-3 rounded-xl border-2 border-warm-200 text-warm-600 font-bold"
            >
              再试一次
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-warm-500 text-white font-bold shadow-md"
            >
              收入日记本
            </button>
          </div>
        </div>
      )}
    </div>
  );
};