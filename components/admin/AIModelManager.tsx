import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, doc, onSnapshot, query, orderBy, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
import { AIModel } from '../../types';
import { Trash2, Edit3, Plus, X, Activity, Shield, Key } from 'lucide-react';

const PROVIDERS = ['Groq', 'Gemini', 'Claude', 'OpenAI', 'DeepSeek', 'Mistral', 'Together', 'Fireworks', 'Cohere', 'Perplexity', 'OpenRouter', 'HuggingFace', 'Ollama', 'vLLM', 'Qwen', 'Yi', 'Baichuan', 'Zhipu', 'Meta LLaMA'];

export const AIModelManager: React.FC = () => {
    const [models, setModels] = useState<AIModel[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentModel, setCurrentModel] = useState<Partial<AIModel>>({});
    const [keysInput, setKeysInput] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'ai_models'), orderBy('priority', 'asc'));
        const unsub = onSnapshot(q, (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as AIModel));
            setModels(list);
        });
        return () => unsub();
    }, []);

    const handleSave = async () => {
        if (!currentModel.id || !currentModel.provider) return alert("Model ID and Provider are required");
        
        const keys = keysInput.split(',').map(k => k.trim()).filter(Boolean);
        const dataToSave = {
            ...currentModel,
            apiKeys: keys,
            enabled: currentModel.enabled ?? true,
            priority: currentModel.priority ?? 99,
            dailyLimit: currentModel.dailyLimit ?? 5000,
            usedToday: currentModel.usedToday ?? 0,
            status: currentModel.status ?? 'green',
            currentKeyIndex: currentModel.currentKeyIndex ?? 0
        };

        try {
            await setDoc(doc(db, 'ai_models', currentModel.id), dataToSave, { merge: true });
            
            setIsEditing(false);
            setCurrentModel({});
            setKeysInput('');
        } catch (e: any) {
            console.error(e);
            alert("Error saving: " + e.message);
        }
    };

    const handleDelete = async (id: string) => {
        if(!confirm("Delete this model?")) return;
        await deleteDoc(doc(db, 'ai_models', id));
    };

    const openEdit = (m: AIModel) => {
        setCurrentModel(m);
        setKeysInput(m.apiKeys?.join(', ') || '');
        setIsEditing(true);
    };

    const openNew = () => {
        setCurrentModel({ 
            id: '', 
            provider: 'Groq', 
            priority: 10, 
            dailyLimit: 1000, 
            enabled: true,
            status: 'green' 
        });
        setKeysInput('');
        setIsEditing(true);
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-in slide-in-from-right">
             <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <Activity className="text-blue-600"/> AI Model Manager
                    </h2>
                    <p className="text-slate-500 text-sm">Orchestrate your AI Infrastructure. Manage keys, rotation, and limits.</p>
                </div>
                <button onClick={openNew} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700">
                    <Plus size={18} /> Add Model
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="p-3">Priority</th>
                            <th className="p-3">Model ID</th>
                            <th className="p-3">Provider</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Keys</th>
                            <th className="p-3">Usage</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {models.map(m => (
                            <tr key={m.id} className={`hover:bg-slate-50 ${!m.enabled ? 'opacity-50 grayscale' : ''}`}>
                                <td className="p-3 font-bold text-slate-400">#{m.priority}</td>
                                <td className="p-3 font-bold text-slate-800">{m.id}</td>
                                <td className="p-3"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{m.provider}</span></td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${m.status === 'green' ? 'bg-green-500' : m.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                        <span className="text-xs font-bold uppercase">{m.enabled ? 'ACTIVE' : 'DISABLED'}</span>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center gap-1 text-xs font-mono bg-slate-100 px-2 py-1 rounded w-fit">
                                        <Key size={12}/> {m.apiKeys?.length || 0} Keys
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-600 h-full" style={{ width: `${Math.min(((m.usedToday || 0) / (m.dailyLimit || 1)) * 100, 100)}%` }}></div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1">{m.usedToday} / {m.dailyLimit}</p>
                                </td>
                                <td className="p-3 text-right flex justify-end gap-2">
                                    <button onClick={() => updateDoc(doc(db, 'ai_models', m.id), { enabled: !m.enabled })} className={`p-2 rounded-lg ${m.enabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        <Shield size={16}/>
                                    </button>
                                    <button onClick={() => openEdit(m)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit3 size={16}/></button>
                                    <button onClick={() => handleDelete(m.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* EDIT/ADD MODAL */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-800">{currentModel.id ? 'Edit Model' : 'Add New Model'}</h3>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24}/></button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Provider</label>
                                    <select 
                                        value={currentModel.provider} 
                                        onChange={e => setCurrentModel({...currentModel, provider: e.target.value as any})}
                                        className="w-full p-2 border rounded-lg bg-white"
                                    >
                                        {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Model ID</label>
                                    <input 
                                        type="text" 
                                        value={currentModel.id} 
                                        onChange={e => setCurrentModel({...currentModel, id: e.target.value})}
                                        placeholder="e.g. groq-llama3"
                                        className="w-full p-2 border rounded-lg"
                                        disabled={!!(models.find(m => m.id === currentModel.id) && currentModel.id !== '')}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">API Keys (Comma Separated)</label>
                                <textarea 
                                    value={keysInput} 
                                    onChange={e => setKeysInput(e.target.value)}
                                    className="w-full h-24 p-2 border rounded-lg font-mono text-xs"
                                    placeholder="sk-..., sk-..."
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Enter multiple keys for rotation. Rotation is handled by the AI Orchestrator.</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Priority (1-99)</label>
                                    <input 
                                        type="number" 
                                        value={currentModel.priority} 
                                        onChange={e => setCurrentModel({...currentModel, priority: Number(e.target.value)})}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Daily Limit</label>
                                    <input 
                                        type="number" 
                                        value={currentModel.dailyLimit} 
                                        onChange={e => setCurrentModel({...currentModel, dailyLimit: Number(e.target.value)})}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Used Today</label>
                                    <input 
                                        type="number" 
                                        value={currentModel.usedToday} 
                                        onChange={e => setCurrentModel({...currentModel, usedToday: Number(e.target.value)})}
                                        className="w-full p-2 border rounded-lg bg-slate-100"
                                        disabled
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={currentModel.enabled} 
                                        onChange={e => setCurrentModel({...currentModel, enabled: e.target.checked})}
                                        className="w-5 h-5"
                                    />
                                    <span className="font-bold text-slate-700">Enabled</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500 font-bold">Cancel</button>
                                <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700">Save Model</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
