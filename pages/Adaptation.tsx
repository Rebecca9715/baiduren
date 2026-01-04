import React, { useState } from 'react';
import { getAdaptationAdvice } from '../services/geminiService';
import { AdaptationResult } from '../types';
import { Compass, ArrowRight, Loader2, Footprints } from 'lucide-react';

interface AdaptationProps {
  onSaveToDiary: (content: string) => void;
}

export const Adaptation: React.FC<AdaptationProps> = ({ onSaveToDiary }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdaptationResult | null>(null);

  const handleConsult = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await getAdaptationAdvice(input);
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
        [重返向导]
        我的担心：${result.scenario}
        向导建议：${result.warmAdvice}
        小小一步：${result.actionStep}
      `;
      onSaveToDiary(entryContent);
      alert("已记录到日记本，加油！");
    }
  };

  return (
    <div className="pb-24 px-6 pt-8 max-w-md mx-auto min-h-screen flex flex-col">
      <h1 className="text-2xl font-extrabold text-warm-800 mb-2">重返向导 <Compass className="inline w-6 h-6 text-warm-400"/></h1>
      <p className="text-warm-600 text-sm mb-6">面对新环境或即将到来的场景，如果感到担心，告诉我，我们一起准备。</p>

      {!result && (
        <div className="flex-1 flex flex-col gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例如：“害怕自我介绍的时候脸红”、“担心中午一个人吃饭”..."
            className="w-full h-40 p-4 rounded-2xl bg-white border-2 border-warm-200 focus:border-warm-400 focus:outline-none resize-none shadow-sm"
          />
          
          <div className="flex gap-2 flex-wrap">
             <span className="text-xs bg-white px-3 py-1 rounded-full text-warm-500 border border-warm-100 cursor-pointer" onClick={() => setInput("要是同学问起我为什么休学怎么办？")}>同学问起休学</span>
             <span className="text-xs bg-white px-3 py-1 rounded-full text-warm-500 border border-warm-100 cursor-pointer" onClick={() => setInput("不敢看老师的眼睛")}>不敢看老师</span>
             <span className="text-xs bg-white px-3 py-1 rounded-full text-warm-500 border border-warm-100 cursor-pointer" onClick={() => setInput("不知道下课该去哪里")}>下课去哪里</span>
          </div>

          <button
            onClick={handleConsult}
            disabled={loading || !input}
            className="mt-auto mb-6 bg-gradient-to-r from-healing-green to-emerald-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>获取锦囊 <Compass size={18} /></>}
          </button>
        </div>
      )}

      {result && (
        <div className="flex-1 animate-fade-in space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-warm-100 space-y-6 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-healing-green to-emerald-300"></div>
             
             <div>
               <h3 className="text-warm-400 font-bold text-xs uppercase tracking-wider mb-2">温暖回应</h3>
               <p className="text-warm-800 font-medium leading-relaxed whitespace-pre-wrap">{result.warmAdvice}</p>
             </div>
             
             <div className="bg-healing-green/20 p-5 rounded-2xl">
               <h3 className="text-emerald-600 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                 <Footprints size={14} /> 试着这样做
               </h3>
               <div className="text-emerald-900 font-bold text-lg">
                 {result.actionStep}
               </div>
             </div>
          </div>

          <div className="flex gap-3 pb-6">
            <button 
              onClick={() => setResult(null)}
              className="flex-1 py-3 rounded-xl border-2 border-warm-200 text-warm-600 font-bold"
            >
              问问别的
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-warm-500 text-white font-bold shadow-md"
            >
              记下来
            </button>
          </div>
        </div>
      )}
    </div>
  );
};