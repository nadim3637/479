
import React, { useState } from 'react';
import { 
    Menu, X, History, BrainCircuit, BarChart3, FileText, 
    Trophy, Award, Gift, Gamepad2, CreditCard, Crown, Mail, Layout 
} from 'lucide-react';
import { User, SystemSettings } from '../types';
import { SpeakButton } from './SpeakButton';
import { speak } from '../utils/voice';

interface PowerUserZoneProps {
    user: User;
    settings?: SystemSettings;
    onTabChange: (tab: any) => void;
    setShowInbox: (show: boolean) => void;
    setShowMonthlyReport: (show: boolean) => void;
    handleSwitchToAdmin: () => void;
    isImpersonating?: boolean;
    toggleLayoutVisibility: (id: string) => void;
    isLayoutEditing: boolean;
    unreadCount: number;
}

export const PowerUserZone: React.FC<PowerUserZoneProps> = ({
    user,
    settings,
    onTabChange,
    setShowInbox,
    setShowMonthlyReport,
    handleSwitchToAdmin,
    isImpersonating,
    toggleLayoutVisibility,
    isLayoutEditing,
    unreadCount
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const isGameEnabled = settings?.isGameEnabled ?? true;

    const DashboardTileWrapper = ({ id, children, label }: { id: string, children: React.ReactNode, label: string }) => {
        const isVisible = settings?.dashboardLayout?.[id]?.visible !== false;
        
        if (!isVisible && !isLayoutEditing) return null;
  
        const handleAudioGuide = () => {
            if (settings?.voiceGuides?.[label]) {
                speak(settings.voiceGuides[label]);
            }
        };
  
        return (
            <div onClickCapture={handleAudioGuide} className={`relative h-full ${isLayoutEditing ? 'border-2 border-dashed border-yellow-400 rounded-xl bg-yellow-50/10' : ''}`}>
                {isLayoutEditing && (
                    <div className="absolute -top-2 -right-2 z-50">
                        <button 
                            onClick={(e) => { e.stopPropagation(); toggleLayoutVisibility(id); }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${isVisible ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                        >
                            {isVisible ? '✓' : '✕'}
                        </button>
                    </div>
                )}
                <div className={`${!isVisible ? 'opacity-50 grayscale pointer-events-none' : ''} h-full`}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* FAB Button */}
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 bg-slate-900 text-white p-4 rounded-full shadow-2xl border-2 border-slate-700 hover:scale-110 transition-transform z-40"
            >
                <Menu size={24} />
            </button>

            {/* Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsOpen(false)}>
                    <div 
                        className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-800">Power Menu</h2>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                <X size={24} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Learning Data */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Learning Data</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <DashboardTileWrapper id="tile_history" label="History">
                                        <button onClick={() => { onTabChange('HISTORY'); setIsOpen(false); }} className="h-20 w-full bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:shadow-md transition-all">
                                            <History size={20} className="text-blue-600" />
                                            <span className="text-[10px] font-bold text-slate-600">History</span>
                                        </button>
                                    </DashboardTileWrapper>
                                    <DashboardTileWrapper id="tile_ai_history" label="AI History">
                                        <button onClick={() => { onTabChange('AI_HISTORY'); setIsOpen(false); }} className="h-20 w-full bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:shadow-md transition-all">
                                            <BrainCircuit size={20} className="text-purple-600" />
                                            <span className="text-[10px] font-bold text-slate-600">AI History</span>
                                        </button>
                                    </DashboardTileWrapper>
                                    <DashboardTileWrapper id="tile_analytics" label="Analytics">
                                        <button onClick={() => { onTabChange('ANALYTICS'); setIsOpen(false); }} className="h-20 w-full bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:shadow-md transition-all">
                                            <BarChart3 size={20} className="text-green-600" />
                                            <span className="text-[10px] font-bold text-slate-600">Analytics</span>
                                        </button>
                                    </DashboardTileWrapper>
                                    <DashboardTileWrapper id="tile_marksheet" label="Marksheet">
                                        <button onClick={() => { setShowMonthlyReport(true); setIsOpen(false); }} className="h-20 w-full bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:shadow-md transition-all">
                                            <FileText size={20} className="text-orange-600" />
                                            <span className="text-[10px] font-bold text-slate-600">Marksheet</span>
                                        </button>
                                    </DashboardTileWrapper>
                                </div>
                            </div>

                            {/* Gamification */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Gamification</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <DashboardTileWrapper id="tile_leaderboard" label="Ranks">
                                        <button onClick={() => { onTabChange('LEADERBOARD'); setIsOpen(false); }} className="h-20 w-full bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:shadow-md transition-all">
                                            <Trophy size={20} className="text-yellow-500" />
                                            <span className="text-[10px] font-bold text-slate-600">Ranks</span>
                                        </button>
                                    </DashboardTileWrapper>
                                    <DashboardTileWrapper id="tile_prizes" label="Prizes">
                                        <button onClick={() => { onTabChange('PRIZES'); setIsOpen(false); }} className="h-20 w-full bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:shadow-md transition-all">
                                            <Award size={20} className="text-pink-500" />
                                            <span className="text-[10px] font-bold text-slate-600">Prizes</span>
                                        </button>
                                    </DashboardTileWrapper>
                                    <DashboardTileWrapper id="tile_redeem" label="Redeem">
                                        <button onClick={() => { onTabChange('REDEEM'); setIsOpen(false); }} className="h-20 w-full bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:shadow-md transition-all">
                                            <Gift size={20} className="text-red-500" />
                                            <span className="text-[10px] font-bold text-slate-600">Redeem</span>
                                        </button>
                                    </DashboardTileWrapper>
                                    {isGameEnabled && (
                                        <DashboardTileWrapper id="tile_game" label="Game">
                                            <button onClick={() => { onTabChange('GAME'); setIsOpen(false); }} className="h-20 w-full bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:shadow-md transition-all">
                                                <Gamepad2 size={20} className="text-indigo-500" />
                                                <span className="text-[10px] font-bold text-slate-600">Game</span>
                                            </button>
                                        </DashboardTileWrapper>
                                    )}
                                </div>
                            </div>

                            {/* System */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">System</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <DashboardTileWrapper id="tile_my_plan" label="My Plan">
                                        <button onClick={() => { onTabChange('SUB_HISTORY'); setIsOpen(false); }} className="h-20 w-full bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:shadow-md transition-all">
                                            <CreditCard size={20} className="text-slate-600" />
                                            <span className="text-[10px] font-bold text-slate-600">My Plan</span>
                                        </button>
                                    </DashboardTileWrapper>
                                    <DashboardTileWrapper id="tile_premium" label="Store">
                                        <button onClick={() => { onTabChange('STORE'); setIsOpen(false); }} className="h-20 w-full bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:shadow-md transition-all">
                                            <Crown size={20} className="text-yellow-600" />
                                            <span className="text-[10px] font-bold text-slate-600">Store</span>
                                        </button>
                                    </DashboardTileWrapper>
                                    <DashboardTileWrapper id="tile_inbox" label="Inbox">
                                        <button onClick={() => { setShowInbox(true); setIsOpen(false); }} className="h-20 w-full bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:shadow-md transition-all relative">
                                            <Mail size={20} className="text-blue-500" />
                                            <span className="text-[10px] font-bold text-slate-600">Inbox</span>
                                            {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">{unreadCount}</span>}
                                        </button>
                                    </DashboardTileWrapper>
                                </div>
                            </div>

                            {/* Admin Link */}
                            {(user.role === 'ADMIN' || isImpersonating) && (
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Admin</h3>
                                    <div className="grid grid-cols-1">
                                        <DashboardTileWrapper id="tile_admin" label="Admin App">
                                            <button onClick={() => { handleSwitchToAdmin(); setIsOpen(false); }} className="h-16 w-full bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                                                <Layout size={18} className="text-yellow-400" />
                                                <span className="text-xs font-bold text-white uppercase tracking-wider">Open Admin Panel</span>
                                            </button>
                                        </DashboardTileWrapper>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
