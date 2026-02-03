
import React from 'react';
import { Timer, Play, Sparkles, Zap, BrainCircuit, RotateCcw } from 'lucide-react';
import { User, SystemSettings } from '../types';

interface HeroDashboardProps {
    user: User;
    settings?: SystemSettings;
    dailyStudySeconds: number;
    dailyTargetSeconds: number;
    setDailyTargetSeconds: (seconds: number) => void;
    onTabChange: (tab: any) => void;
    startAutoChallenge: (type: 'DAILY' | 'WEEKLY') => void;
    formatTime: (seconds: number) => string;
    setShowAiModal: (show: boolean) => void;
    setEditMode: (mode: boolean) => void;
}

export const HeroDashboard: React.FC<HeroDashboardProps> = ({
    user,
    settings,
    dailyStudySeconds,
    dailyTargetSeconds,
    setDailyTargetSeconds,
    onTabChange,
    startAutoChallenge,
    formatTime,
    setShowAiModal,
    setEditMode
}) => {
    const targetPct = Math.min((dailyStudySeconds / dailyTargetSeconds) * 100, 100);

    return (
        <div className="space-y-4">
            {/* 1. STUDY TIMER & GOAL */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Timer className="text-indigo-400" size={20} /> Today's Goal
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">{formatTime(dailyStudySeconds)} / {formatTime(dailyTargetSeconds)}</p>
                        </div>
                        <div className="text-right">
                            <button 
                                onClick={() => setEditMode(true)}
                                className="text-[10px] font-bold bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
                            >
                                Edit Goal
                            </button>
                        </div>
                    </div>

                    {/* LIVE PROGRESS RING VISUAL */}
                    <div className="flex items-center gap-6">
                        <div className="relative w-20 h-20 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset={226 - (226 * targetPct) / 100} className="text-indigo-500 transition-all duration-1000 ease-out" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-black text-sm">
                                {Math.round(targetPct)}%
                            </div>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                            <div className="flex gap-2">
                                {[1800, 3600, 7200].map(s => (
                                    <button 
                                        key={s}
                                        onClick={() => setDailyTargetSeconds(s)}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${dailyTargetSeconds === s ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                                    >
                                        {s / 60}m
                                    </button>
                                ))}
                            </div>
                            <button className="w-full py-2 bg-green-500 text-white rounded-xl text-xs font-black shadow-lg shadow-green-500/20 uppercase tracking-widest hover:bg-green-400 transition-colors flex items-center justify-center gap-2">
                                <Play size={12} fill="currentColor" /> Start Focus Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. AI PERSONAL TUTOR (HERO CARD) */}
            <div 
                onClick={() => setShowAiModal(true)}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 rounded-3xl shadow-xl relative overflow-hidden cursor-pointer group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10 flex justify-between items-end">
                    <div>
                        <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white mb-2 border border-white/20">
                            <Sparkles size={10} className="text-yellow-300" /> AI TUTOR
                        </div>
                        <h3 className="text-2xl font-black text-white leading-none mb-1">Ask Anything.</h3>
                        <p className="text-white/80 text-sm font-medium max-w-[200px]">Instant answers, detailed notes & doubts solved.</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <BrainCircuit className="text-fuchsia-600" size={24} />
                    </div>
                </div>
            </div>

            {/* 3. CONTINUE & CHALLENGE */}
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => onTabChange('COURSES')}
                    className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 text-left hover:scale-[1.02] transition-transform"
                >
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3">
                        <Play size={20} fill="currentColor" />
                    </div>
                    <p className="font-black text-slate-800 text-sm">Continue</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Last Lesson</p>
                </button>

                <button 
                    onClick={() => startAutoChallenge('DAILY')}
                    className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 text-left hover:scale-[1.02] transition-transform relative overflow-hidden"
                >
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-3 relative z-10">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <p className="font-black text-slate-800 text-sm relative z-10">Daily Challenge</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase relative z-10">Win Rewards</p>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-orange-50 rounded-full blur-xl"></div>
                </button>
            </div>
        </div>
    );
};
