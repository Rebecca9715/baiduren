import React, { useState } from 'react';
import { DiaryEntry, FairyTale } from '../types';
import { weaveStory } from '../services/geminiService';
import { PenLine, BookOpen, Wand2, Loader2, Plus, CheckCircle2, Circle, Share2 } from 'lucide-react';

interface DiaryProps {
  entries: DiaryEntry[];
  addEntry: (content: string) => void;
}

export const Diary: React.FC<DiaryProps> = ({ entries, addEntry }) => {
  const [mode, setMode] = useState<'list' | 'write' | 'story'>('list');
  const [newContent, setNewContent] = useState('');
  const [story, setStory] = useState<FairyTale | null>(null);
  const [weaving, setWeaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleAdd = () => {
    if (!newContent.trim()) return;
    addEntry(newContent);
    setNewContent('');
    setMode('list');
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleWeave = async () => {
    if (selectedIds.size === 0) {
        if(entries.length > 0) {
            alert("请先选择一些日记作为素材哦~");
        }
        return;
    }
    
    setWeaving(true);
    try {
      const selectedEntries = entries.filter(e => selectedIds.has(e.id)).map(e => e.content);
      const result = await weaveStory(selectedEntries);
      setStory(result);
      setMode('story');
      setSelectedIds(new Set()); // Reset selection
    } catch (e) {
      console.error(e);
    } finally {
      setWeaving(false);
    }
  };

  const handleShareStory = () => {
      alert("故事海报已生成并保存到相册！(模拟)");
  };

  if (mode === 'write') {
    return (
      <div className="pb-24 px-6 pt-8 max-w-md mx-auto min-h-screen flex flex-col">
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-extrabold text-warm-800">写日记</h1>
           <button onClick={() => setMode('list')} className="text-warm-500 font-bold">取消</button>
        </div>
        <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="今天发生了什么？有什么想说的吗？..."
            className="flex-1 w-full p-4 rounded-2xl bg-white border-2 border-warm-200 focus:border-warm-400 focus:outline-none resize-none shadow-sm mb-4 text-warm-800"
          />
        <button
          onClick={handleAdd}
          className="bg-warm-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg"
        >
          保存
        </button>
      </div>
    );
  }

  if (mode === 'story' && story) {
    return (
       <div className="pb-24 px-6 pt-8 max-w-md mx-auto min-h-screen">
         <button onClick={() => setMode('list')} className="text-warm-500 font-bold mb-4">← 返回日记</button>
         <div className="bg-white p-8 rounded-3xl shadow-lg border border-warm-200 relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-healing-blue to-healing-purple"></div>
            <h2 className="text-2xl font-bold text-warm-800 mb-4 font-serif text-center">{story.title}</h2>
            <div className="prose prose-warm text-warm-700 leading-relaxed font-serif whitespace-pre-wrap">
              {story.content}
            </div>
            <div className="mt-8 flex justify-center">
              <SparklesIcon className="text-warm-300 w-8 h-8" />
            </div>
         </div>
         
         <button 
           onClick={handleShareStory}
           className="w-full mt-6 bg-gradient-to-r from-healing-purple to-purple-400 text-white py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
         >
           <Share2 size={20} /> 分享这个故事
         </button>
       </div>
    );
  }

  return (
    <div className="pb-24 px-6 pt-8 max-w-md mx-auto min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-warm-800">日记本</h1>
        <button 
          onClick={() => setMode('write')}
          className="w-10 h-10 bg-warm-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-warm-600 transition-colors"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Story Weaver Teaser */}
      <div className="bg-gradient-to-r from-healing-blue/20 to-healing-purple/20 p-6 rounded-3xl mb-8">
        <div className="flex items-center justify-between mb-3">
            <div>
            <h3 className="font-bold text-warm-800 mb-1">魔法故事机</h3>
            <p className="text-xs text-warm-600">选中几篇日记，把心事编织成童话...</p>
            </div>
            <Wand2 className="w-8 h-8 text-purple-300" />
        </div>
        <button 
          onClick={handleWeave}
          disabled={weaving || selectedIds.size === 0}
          className="w-full bg-white py-3 rounded-xl text-warm-700 font-bold text-sm shadow-sm flex items-center justify-center gap-2 hover:bg-warm-50 disabled:opacity-50 transition-all"
        >
          {weaving ? <Loader2 className="animate-spin w-4 h-4"/> : <SparklesIcon className="w-4 h-4 text-purple-400" />}
          {weaving ? '正在编织中...' : selectedIds.size > 0 ? `编织选中的 ${selectedIds.size} 篇日记` : '请先选择日记'}
        </button>
      </div>

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-10 text-warm-400">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>日记本还是空的，写点什么吧...</p>
          </div>
        ) : (
          entries.map(entry => {
            const isSelected = selectedIds.has(entry.id);
            return (
                <div 
                    key={entry.id} 
                    onClick={() => toggleSelection(entry.id)}
                    className={`bg-white p-5 rounded-2xl shadow-sm border transition-all cursor-pointer relative ${isSelected ? 'border-purple-400 ring-1 ring-purple-100' : 'border-warm-100 hover:border-warm-200'}`}
                >
                    <div className="absolute top-4 right-4 text-warm-300">
                        {isSelected ? <CheckCircle2 className="text-purple-500 fill-purple-50" /> : <Circle size={20} />}
                    </div>
                    <div className="flex justify-between items-start mb-2 pr-8">
                        <span className="text-xs font-bold text-warm-400 bg-warm-50 px-2 py-1 rounded-md">{new Date(entry.date).toLocaleDateString()}</span>
                        {entry.content.includes('[语言重构]') && <SparklesIcon className="w-4 h-4 text-warm-300" />}
                    </div>
                    <p className="text-warm-800 text-sm whitespace-pre-wrap line-clamp-4">{entry.content}</p>
                </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const SparklesIcon = ({ className }: {className?: string}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M7 3v4"/><path d="M3 7h4"/><path d="M3 5h4"/></svg>
);