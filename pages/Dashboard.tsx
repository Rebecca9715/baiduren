import React, { useState } from 'react';
import { UserProfile, DailyLog } from '../types';
import { Sun, Calendar, CheckCircle2, CloudRain, CloudSun, Smile, Users, MessageCircleHeart, Mail, X, HandHeart } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [mood, setMood] = useState<string>('');
  const [showLetter, setShowLetter] = useState(false);
  
  // Calculate progress
  const targetDate = new Date(user.targetReturnDate);
  const now = new Date();
  const diffTime = Math.max(0, targetDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const progressPercent = Math.min(100, (user.sunshinePoints / user.sunshineTarget) * 100);

  // Determine Feedback Action based on progress milestones
  const getFeedbackAction = () => {
    if (progressPercent >= 75) return "尝试参加一次社区的兴趣小组活动，并在日记里记录下来。";
    if (progressPercent >= 50) return "试着和公益机构的志愿者通一次电话，聊聊最近的心情。";
    if (progressPercent >= 25) return "去附近的公园走走，拍一张你觉得好看的照片。";
    return null;
  };
  const feedbackAction = getFeedbackAction();

  const handleLog = () => {
    if (!mood) return;
    setTodayLog({
      date: new Date().toISOString(),
      mood: mood as any,
      action: "今天也很棒！"
    });
  };

  return (
    <div className="pb-24 px-6 pt-16 max-w-md mx-auto space-y-6 relative animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-warm-800">早安, {user.name}</h1>
          <p className="text-warm-600 text-sm mt-1">今天也要好好爱自己。</p>
        </div>
        
        <div className="flex items-center gap-2">
           {user.healingLetter && (
             <button 
               onClick={() => setShowLetter(true)}
               className="bg-white p-2 rounded-full shadow-sm border border-warm-100 text-healing-blue hover:text-blue-500 transition-colors"
               title="查看来信"
             >
               <Mail size={16} />
             </button>
           )}
           <div className="bg-white px-3 py-1 rounded-full shadow-sm border border-warm-100 flex items-center gap-1">
             <Sun className="text-warm-500 w-4 h-4 fill-current" />
             <span className="font-bold text-warm-700">{user.sunshinePoints}</span>
           </div>
        </div>
      </header>

      {/* Healing Letter Modal */}
      {showLetter && user.healingLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm animate-fade-in">
           <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full relative max-h-[80vh] overflow-y-auto">
              <button 
                onClick={() => setShowLetter(false)}
                className="absolute top-4 right-4 text-warm-400 hover:text-warm-600"
              >
                <X size={24} />
              </button>
              
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-healing-blue to-healing-green"></div>
              <h3 className="text-xl font-bold text-warm-800 mb-6 flex items-center gap-2">
                <Mail className="text-warm-400" size={20}/> 
                给 {user.name} 的信
              </h3>
              
              <div className="prose prose-warm text-warm-700 leading-relaxed whitespace-pre-wrap font-serif">
                {user.healingLetter}
              </div>

              <div className="mt-8 text-right text-xs text-warm-400 uppercase tracking-widest">
                 SunnyPath
              </div>
           </div>
        </div>
      )}

      {/* Sunshine Goal & Feedback Card */}
      <div className="bg-gradient-to-br from-warm-100 to-white p-6 rounded-3xl shadow-sm border border-warm-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-warm-800">能量收集站</h3>
          <span className="text-xs font-bold text-warm-500">{user.sunshinePoints}/{user.sunshineTarget}</span>
        </div>
        <div className="w-full bg-warm-200 rounded-full h-4 mb-4 overflow-hidden">
          <div 
            className="bg-warm-500 h-4 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        
        {/* Milestone Feedback Logic */}
        {user.sunshinePoints >= user.sunshineTarget ? (
           <div className="bg-healing-green/20 p-4 rounded-xl flex items-start gap-3 text-emerald-800">
             <CheckCircle2 className="shrink-0" />
             <div>
               <p className="font-bold text-sm">光芒汇聚完成！</p>
               <p className="text-xs mt-1">公益机构已收到你的能量，正在为你准备一份特殊的开学礼物。</p>
             </div>
           </div>
        ) : feedbackAction ? (
           <div className="bg-white p-4 rounded-xl border border-warm-100 flex items-start gap-3 shadow-sm">
             <div className="bg-healing-blue/20 p-2 rounded-full text-blue-600 shrink-0">
                <HandHeart size={16} />
             </div>
             <div>
               <p className="font-bold text-warm-800 text-sm mb-1">小挑战 ({Math.floor(progressPercent)}%)</p>
               <p className="text-xs text-warm-600 leading-relaxed">{feedbackAction}</p>
             </div>
           </div>
        ) : (
          <p className="text-xs text-warm-600">还有 {user.sunshineTarget - user.sunshinePoints} 点阳光(摆渡值)就能解锁来自公益伙伴的特别反馈哦！</p>
        )}
      </div>

      {/* Companion Traces (New Section) */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-warm-100">
        <h3 className="font-bold text-warm-800 mb-4 flex items-center gap-2">
           <MessageCircleHeart className="text-pink-400 w-5 h-5" /> 
           温暖痕迹
        </h3>
        
        <div className="flex items-center gap-4 mb-6">
           <div className="flex-1 bg-warm-50 p-3 rounded-2xl flex items-center gap-3">
             <div className="bg-white p-2 rounded-full shadow-sm text-warm-500">
               <Users size={20} />
             </div>
             <div>
               <p className="text-xl font-extrabold text-warm-800">{user.supporterCount}</p>
               <p className="text-[10px] text-warm-500 font-bold uppercase">守护人</p>
             </div>
           </div>
           <div className="flex-1 bg-warm-50 p-3 rounded-2xl flex items-center gap-3">
             <div className="bg-white p-2 rounded-full shadow-sm text-warm-500">
               <Sun size={20} />
             </div>
             <div>
               <p className="text-xl font-extrabold text-warm-800">{user.sunshinePoints}</p>
               <p className="text-[10px] text-warm-500 font-bold uppercase">收到阳光</p>
             </div>
           </div>
        </div>

        {user.receivedMessages && user.receivedMessages.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs font-bold text-warm-400 uppercase tracking-wider">最近的寄语</p>
            {user.receivedMessages.slice(0, 3).map((msg) => (
              <div key={msg.id} className="bg-gradient-to-r from-warm-50 to-white border border-warm-100 p-3 rounded-xl">
                 <p className="text-sm text-warm-800 font-medium mb-1">"{msg.content}"</p>
                 <div className="flex justify-between items-center text-[10px] text-warm-400">
                    <span>From: {msg.from}</span>
                    <span>{new Date(msg.date).toLocaleDateString()}</span>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-warm-400 text-sm bg-warm-50 rounded-xl">
            还没有收到寄语，但光正在赶来的路上...
          </div>
        )}
      </div>

      {/* Countdown Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-warm-100 flex items-center justify-between">
         <div>
           <p className="text-warm-500 font-bold text-xs uppercase tracking-wider">重返校园倒计时</p>
           <h3 className="text-4xl font-extrabold text-warm-800 mt-1">{diffDays} <span className="text-lg font-normal">天</span></h3>
         </div>
         <Calendar className="text-warm-200 w-12 h-12" />
      </div>

      {/* Daily Check-in */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-warm-100">
        <h3 className="font-bold text-warm-800 mb-4">今日心情打卡</h3>
        {!todayLog ? (
          <div className="space-y-4">
            <div className="flex justify-between px-2">
              {[
                { icon: CloudRain, label: '低落', val: 'sad', color: 'text-blue-400' },
                { icon: CloudSun, label: '平静', val: 'neutral', color: 'text-gray-400' },
                { icon: Sun, label: '开心', val: 'happy', color: 'text-warm-500' },
              ].map((m) => (
                <button 
                  key={m.val}
                  onClick={() => setMood(m.val)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${mood === m.val ? 'bg-warm-50 ring-2 ring-warm-200' : 'hover:bg-gray-50'}`}
                >
                  <m.icon className={`w-8 h-8 ${m.color}`} fill={mood === m.val ? 'currentColor' : 'none'} />
                  <span className="text-xs text-warm-600">{m.label}</span>
                </button>
              ))}
            </div>
            <button 
              disabled={!mood}
              onClick={handleLog}
              className="w-full bg-warm-500 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              记录今天
            </button>
          </div>
        ) : (
          <div className="text-center py-4 animate-fade-in">
             <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-3">
               <Smile className="text-warm-500 w-8 h-8" />
             </div>
             <p className="text-warm-800 font-bold">打卡成功！</p>
             <p className="text-warm-600 text-sm">每一个情绪都值得被接纳。</p>
          </div>
        )}
      </div>
    </div>
  );
};