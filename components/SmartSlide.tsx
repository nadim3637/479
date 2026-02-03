
import React from 'react';
import { ArrowRight, Bot, Sparkles, Crown, Zap, Rocket, Megaphone } from 'lucide-react';
import { BannerCarousel } from './BannerCarousel';
import { SpeakButton } from './SpeakButton';
import { User, SystemSettings } from '../types';
import { ALL_APP_FEATURES } from '../constants';

interface SmartSlideProps {
    user: User;
    settings?: SystemSettings;
    onTabChange: (tab: any) => void;
    currentSlide: number;
    slides: any[];
    morningBanner: any;
    discountStatus: 'WAITING' | 'ACTIVE' | 'NONE';
    showDiscountBanner: boolean;
    discountTimer: string | null;
    challenges20: any[];
    startChallenge20: (challenge: any) => void;
    startAutoChallenge: (type: 'DAILY' | 'WEEKLY') => void;
    setShowAiModal: (show: boolean) => void;
    toggleLayoutVisibility: (id: string) => void;
    isLayoutEditing: boolean;
    setRequestData: (data: any) => void;
    setShowRequestModal: (show: boolean) => void;
}

export const SmartSlide: React.FC<SmartSlideProps> = ({
    user,
    settings,
    onTabChange,
    currentSlide,
    slides,
    morningBanner,
    discountStatus,
    showDiscountBanner,
    discountTimer,
    challenges20,
    startChallenge20,
    startAutoChallenge,
    setShowAiModal,
    toggleLayoutVisibility,
    isLayoutEditing,
    setRequestData,
    setShowRequestModal
}) => {

    const DashboardSectionWrapper = ({ id, children, label }: { id: string, children: React.ReactNode, label: string }) => {
        const isVisible = settings?.dashboardLayout?.[id]?.visible !== false;
        
        if (!isVisible && !isLayoutEditing) return null;

        return (
            <div className={`relative ${isLayoutEditing ? 'border-2 border-dashed border-yellow-400 p-2 rounded-xl mb-4 bg-yellow-50/10' : ''}`}>
                {isLayoutEditing && (
                    <div className="absolute -top-3 left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow z-50 flex items-center gap-2">
                        <span>{label}</span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); toggleLayoutVisibility(id); }}
                            className={`px-2 py-0.5 rounded text-xs ${isVisible ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                        >
                            {isVisible ? 'ON' : 'OFF'}
                        </button>
                    </div>
                )}
                <div className={!isVisible ? 'opacity-50 grayscale pointer-events-none' : ''}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4 pt-4 border-t border-slate-200">
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                <ArrowRight className="rotate-90" size={12} /> Explore More
            </p>

            {/* AI TOUR (GLOWING) */}
            <div 
                onClick={() => onTabChange('AI_CHAT')}
                className="mx-1 h-16 bg-slate-900 rounded-2xl flex items-center justify-between px-6 shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-indigo-500/50 cursor-pointer hover:scale-[1.02] transition-transform animate-pulse-slow"
            >
                <div className="flex items-center gap-3">
                    <Bot className="text-indigo-400" size={24} />
                    <div>
                        <h4 className="font-black text-white text-sm">AI Tour</h4>
                        <p className="text-[10px] text-indigo-300">Interactive App Guide</p>
                    </div>
                </div>
                <ArrowRight className="text-white" size={18} />
            </div>

            {/* SPECIAL DISCOUNT BANNER */}
            {showDiscountBanner && discountTimer && (
                <div 
                    onClick={() => onTabChange('STORE')}
                    className="mx-1 mb-4 relative p-[2px] rounded-2xl overflow-hidden cursor-pointer group"
                >
                    {/* Rotating Border Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 animate-border-rotate"></div>
                    
                    <div className="relative bg-gradient-to-r from-blue-900 to-slate-900 p-4 rounded-2xl shadow-xl overflow-hidden">
                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                        
                        <div className="flex justify-between items-center relative z-10 text-white">
                            <div>
                                <h3 className="text-lg font-black italic flex items-center gap-2">
                                    <Sparkles size={18} className="text-yellow-400 animate-pulse" />
                                    {discountStatus === 'WAITING' ? '⚡ SALE STARTING SOON' : `🔥 ${settings?.specialDiscountEvent?.eventName || 'LIMITED TIME OFFER'} IS LIVE!`}
                                </h3>
                                <p className="text-xs font-bold text-blue-200">
                                    {discountStatus === 'WAITING' ? 'Get ready for massive discounts!' : `Get ${settings?.specialDiscountEvent?.discountPercent || 50}% OFF on all premium plans!`}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">{discountStatus === 'WAITING' ? 'STARTS IN' : 'ENDS IN'}</p>
                                <p className="text-2xl font-black font-mono leading-none text-white drop-shadow-md">{discountTimer}</p>
                            </div>
                        </div>
                        
                        {/* Moving Shine Effect */}
                        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                    </div>
                </div>
            )}

            {/* BANNER CAROUSEL */}
            <BannerCarousel>
                  {/* 1. HERO SLIDER */}
                  <DashboardSectionWrapper id="hero_slider" label="Hero Slider">
                      <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl mx-1 border border-white/20" style={{ backgroundColor: 'var(--primary)' }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent"></div>
                          {slides.map((slide, index) => (
                              <div 
                                  key={slide.id}
                                  className={`absolute inset-0 flex flex-col justify-center p-6 transition-all duration-1000 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                              >
                                  <div className="text-white relative z-10">
                                      <div className="inline-block px-3 py-1 bg-black/20 rounded-full text-[10px] font-black tracking-widest mb-2 backdrop-blur-md border border-white/10 shadow-sm">
                                          ✨ FEATURED
                                      </div>
                                      <h2 className="text-3xl font-black mb-2 leading-none drop-shadow-md">{slide.title}</h2>
                                      <p className="text-sm font-medium opacity-90 mb-4 max-w-[80%]">{slide.subtitle}</p>
                                      
                                      <button onClick={() => onTabChange('STORE')} className="bg-white text-slate-900 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg hover:scale-105 transition-transform flex items-center gap-2 uppercase tracking-wider">
                                          <Zap size={14} className="text-yellow-500 fill-yellow-500" /> 
                                          {(slide as any).btnText || 'Get Access'}
                                      </button>
                                  </div>
                                  {/* Animated Background Element */}
                                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                              </div>
                          ))}
                      </div>
                  </DashboardSectionWrapper>

                  {/* 2. AI NOTES POSTER (If Enabled) */}
                  {settings?.isAiEnabled && (
                      <div 
                          onClick={() => setShowAiModal(true)}
                          className="mx-1 h-48 relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group flex flex-col justify-center"
                      >
                          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600"></div>
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                          
                          <div className="relative p-5 flex items-center justify-between">
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      <Bot className="text-yellow-300" size={20} />
                                      <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded text-white backdrop-blur-sm border border-white/20">NEW FEATURE</span>
                                  </div>
                                  <h3 className="text-xl font-black text-white italic tracking-wide">{settings?.aiName || 'AI ASSISTANT'}</h3>
                                  <p className="text-xs text-indigo-100 font-medium mt-1 max-w-[200px]">Generate custom notes on any topic instantly using AI.</p>
                              </div>
                              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
                                  <Sparkles className="text-white" size={24} />
                              </div>
                          </div>
                      </div>
                  )}

                  {/* 3. MORNING INSIGHT BANNER */}
                  {morningBanner && (
                      <div className="mx-1 h-48 bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-2xl shadow-sm border border-orange-200 overflow-y-auto">
                          <div className="flex justify-between items-start mb-2">
                              <h3 className="font-black text-orange-900 flex items-center gap-2">
                                  <Sparkles size={18} className="text-orange-600" /> {morningBanner.title || 'Morning Insight'}
                              </h3>
                              <div className="flex items-center gap-2">
                                  <SpeakButton text={`${morningBanner.title}. ${morningBanner.wisdom}. Common Trap: ${morningBanner.commonTrap}. Pro Tip: ${morningBanner.proTip}`} className="text-orange-600 hover:bg-orange-200" iconSize={16} />
                                  <span className="text-[10px] font-bold text-orange-600 bg-orange-200 px-2 py-0.5 rounded-full">{morningBanner.date}</span>
                              </div>
                          </div>
                          <p className="text-xs text-orange-800 italic mb-3">"{morningBanner.wisdom}"</p>
                          <div className="space-y-2">
                              <div className="bg-white/60 p-2 rounded-lg text-xs">
                                  <span className="font-bold text-red-600 block">⚠️ Common Trap:</span>
                                  <span className="text-slate-700">{morningBanner.commonTrap}</span>
                              </div>
                              <div className="bg-white/60 p-2 rounded-lg text-xs">
                                  <span className="font-bold text-green-600 block">💡 Pro Tip:</span>
                                  <span className="text-slate-700">{morningBanner.proTip}</span>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* 4. CUSTOM PAGE BANNER */}
                  <div 
                      onClick={() => onTabChange('CUSTOM_PAGE')}
                      className="mx-1 h-48 bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-2xl shadow-lg text-white flex flex-col justify-center cursor-pointer border border-white/20 relative overflow-hidden group"
                  >
                      <div className="relative z-10 flex justify-between items-center">
                          <div>
                              <h3 className="text-lg font-black flex items-center gap-2">
                                  <Sparkles size={18} className="text-yellow-300 animate-pulse" />
                                  What's New?
                              </h3>
                              <p className="text-xs font-medium text-orange-100">Tap to see special updates!</p>
                          </div>
                          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform relative z-10">
                              <ArrowRight size={20} className="text-white" />
                          </div>
                      </div>
                      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                  </div>

                  {/* 5. LIVE CHALLENGES & AUTO CHALLENGES */}
                  <DashboardSectionWrapper id="live_challenges" label="Live Challenges">
                      <div className="mx-1 h-48 bg-slate-900 p-4 rounded-2xl shadow-lg text-white border border-slate-700 relative overflow-hidden flex flex-col">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
                          
                          <h3 className="font-black text-white flex items-center gap-2 mb-3 relative z-10">
                              <Rocket size={18} className="text-indigo-400" /> Daily & Weekly Challenges
                          </h3>
                          
                          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide relative z-10 flex-1 items-center">
                              {/* AUTO DAILY CARD */}
                              <button onClick={() => startAutoChallenge('DAILY')} className="min-w-[140px] bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-indigo-500 transition-all text-left group">
                                  <p className="text-[10px] font-bold text-yellow-400 uppercase mb-1">Daily Challenge</p>
                                  <p className="font-bold text-sm text-white leading-tight mb-2">Mixed Practice</p>
                                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                                      <span>30 Qs</span>
                                      <span className="text-yellow-400 font-mono">15 Mins</span>
                                  </div>
                              </button>

                              {/* AUTO WEEKLY CARD (Only Show on Sundays) */}
                              {new Date().getDay() === 0 && (
                                  <button onClick={() => startAutoChallenge('WEEKLY')} className="min-w-[140px] bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-purple-500 transition-all text-left group">
                                      <p className="text-[10px] font-bold text-purple-400 uppercase mb-1">Weekly Mega Test</p>
                                      <p className="font-bold text-sm text-white leading-tight mb-2">Full Revision</p>
                                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                                          <span>100 Qs</span>
                                          <span className="text-purple-400 font-mono">60 Mins</span>
                                      </div>
                                  </button>
                              )}

                              {challenges20.map(c => {
                                  const expiry = new Date(c.expiryDate);
                                  const now = Date.now();
                                  const timeLeft = Math.max(0, Math.floor((expiry.getTime() - now) / (1000 * 60))); // Minutes
                                  const hours = Math.floor(timeLeft / 60);
                                  const mins = timeLeft % 60;

                                  return (
                                      <button 
                                          key={c.id} 
                                          onClick={() => startChallenge20(c)}
                                          className="min-w-[140px] bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-indigo-500 transition-all text-left group"
                                      >
                                          <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">
                                              {c.type === 'DAILY_CHALLENGE' ? 'Special Challenge' : 'Special Test'}
                                          </p>
                                          <p className="font-bold text-sm text-white leading-tight mb-2 truncate">{c.title}</p>
                                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                                              <span>{c.questions.length} Qs</span>
                                              <span className="text-red-400 font-mono">{hours}h {mins}m left</span>
                                          </div>
                                      </button>
                                  );
                              })}
                          </div>
                      </div>
                  </DashboardSectionWrapper>

                  {/* 6. SUBSCRIPTION PROMO BANNER (Inline with Credits) */}
                  <DashboardSectionWrapper id="promo_banner" label="Promo Banner">
                      <div onClick={() => onTabChange('STORE')} className="mx-1 h-48 bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-2xl shadow-lg flex flex-col justify-center cursor-pointer border border-slate-700 relative overflow-hidden group">
                          <div className="relative z-10 mb-4">
                              <div className="flex items-center gap-2 mb-1">
                                  <Crown size={16} className="text-yellow-400 animate-pulse" />
                                  <span className="text-xs font-black text-white tracking-widest">PRO MEMBERSHIP</span>
                              </div>
                              <p className="text-[10px] text-slate-400">Unlock All Features + Get Credits</p>
                          </div>
                          <div className="relative z-10 flex flex-col items-end">
                              <span className="text-xl font-black text-white">BASIC / ULTRA</span>
                              <span className="text-[10px] font-bold bg-yellow-400 text-black px-2 py-0.5 rounded-full">+ 5000 Credits</span>
                          </div>
                          {/* Shine Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </div>
                  </DashboardSectionWrapper>
            </BannerCarousel>

            {/* FEATURES SLIDER */}
            <DashboardSectionWrapper id="features_ticker" label="Features Ticker">
                <div className="overflow-hidden py-4 bg-slate-50 border-y border-slate-200">
                    <div className="flex gap-8 animate-marquee whitespace-nowrap">
                        {ALL_APP_FEATURES.map((feat, i) => (
                            <span key={feat.id} className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                {feat.title}
                            </span>
                        ))}
                        {/* DUPLICATE FOR SMOOTH LOOP */}
                        {ALL_APP_FEATURES.map((feat, i) => (
                            <span key={`dup-${feat.id}`} className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                {feat.title}
                            </span>
                        ))}
                    </div>
                </div>
            </DashboardSectionWrapper>

            {/* CONTENT REQUEST (DEMAND) SECTION */}
            <DashboardSectionWrapper id="request_content" label="Request Content">
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-2xl border border-pink-100 shadow-sm mt-4">
                    <h3 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
                        <Megaphone size={18} className="text-pink-600" /> Request Content
                    </h3>
                    <p className="text-xs text-slate-600 mb-4">Don't see what you need? Request it here!</p>
                    
                    <button 
                        onClick={() => {
                            setRequestData({ subject: '', topic: '', type: 'PDF' });
                            setShowRequestModal(true);
                        }}
                        className="w-full bg-white text-pink-600 font-bold py-3 rounded-xl shadow-sm border border-pink-200 hover:bg-pink-100 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                        + Make a Request
                    </button>
                </div>
            </DashboardSectionWrapper>
        </div>
    );
};
