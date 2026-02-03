
export const getVoices = (): SpeechSynthesisVoice[] => {
    return window.speechSynthesis.getVoices();
};

export const speak = (text: string, lang: string = 'en-US', voiceName?: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    if (voiceName) {
        const voices = getVoices();
        const voice = voices.find(v => v.name === voiceName);
        if (voice) utterance.voice = voice;
    } else {
        // Auto-select best voice
        const voices = getVoices();
        if (lang.includes('hi')) {
             const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india'));
             if (hindiVoice) utterance.voice = hindiVoice;
        } else {
             const indianEnglishVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('India'));
             if (indianEnglishVoice) utterance.voice = indianEnglishVoice;
        }
    }
    
    window.speechSynthesis.speak(utterance);
};

export const cancel = () => {
    window.speechSynthesis.cancel();
};
