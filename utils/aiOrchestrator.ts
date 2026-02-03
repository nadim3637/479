import { adminDb } from "./firebaseAdmin";
import { callProvider } from "./aiProviders";
import { AIModel, AILog } from "../types";

// Helper to get models
const getModels = async (feature?: string): Promise<AIModel[]> => {
    if (!adminDb) return [];
    
    // 1. Get all enabled models
    const snapshot = await adminDb.collection('ai_models')
        .where('enabled', '==', true)
        .orderBy('priority', 'asc')
        .get();
        
    const models = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AIModel));
    
    // 2. Filter by feature map if needed
    if (feature) {
        const mapSnap = await adminDb.collection('ai_config').doc('feature_map').get();
        if (mapSnap.exists) {
            const map = mapSnap.data();
            const allowedModels = map?.[feature]; // string[]
            if (Array.isArray(allowedModels) && allowedModels.length > 0) {
                return models.filter(m => allowedModels.includes(m.id));
            }
        }
    }
    
    return models;
};

// Key Rotation Logic
const pickKey = (model: AIModel): { key: string, index: number } | null => {
    if (!model.apiKeys || model.apiKeys.length === 0) {
         // Local/Ollama might not need keys
         if (model.provider === 'Ollama' || model.provider === 'Local') return { key: 'LOCAL', index: 0 };
         return null;
    }
    
    const index = (model.currentKeyIndex || 0) % model.apiKeys.length;
    return { key: model.apiKeys[index], index };
};

const rotateKeyIndex = async (model: AIModel) => {
    if (!adminDb) return;
    const currentIdx = model.currentKeyIndex || 0;
    const len = model.apiKeys?.length || 1;
    const nextIndex = (currentIdx + 1) % len;
    
    await adminDb.collection('ai_models').doc(model.id).update({
        currentKeyIndex: nextIndex,
        usedToday: (model.usedToday || 0) + 1
    });
};

const logResult = async (log: AILog) => {
    if (!adminDb) return;
    try {
        await adminDb.collection('ai_logs').add(log);
    } catch (e) {
        console.error("Failed to write log", e);
    }
};

export const callAI = async (messages: any[], feature: string = 'general', preferredModel?: string) => {
    if (!adminDb) {
        // Fallback for development/sandbox where adminDb might fail init
        // We can throw error or try to use a default provider if configured locally (not safe for prod)
        console.warn("Database not connected (Admin SDK). Checking for ENV keys as fallback...");
        // If we have process.env.GROQ_API_KEYS, use simple fallback
        if (process.env.GROQ_API_KEYS) {
             const { callProvider } = await import("./aiProviders");
             const keys = process.env.GROQ_API_KEYS.split(',');
             const key = keys[Math.floor(Math.random() * keys.length)];
             return callProvider({ provider: 'Groq', id: 'fallback' } as any, key, messages);
        }
        throw new Error("AI Orchestrator Engine Offline (DB Connection Failed)");
    }

    let models = await getModels(feature);
    
    // If preferred model is requested and exists in the list, move it to top
    if (preferredModel) {
        const idx = models.findIndex(m => m.id === preferredModel);
        if (idx > -1) {
            const [p] = models.splice(idx, 1);
            models.unshift(p);
        }
    }

    if (models.length === 0) {
        // If no models found in DB, check if we should populate defaults or fallback
        // For now, throw error
        throw new Error(`No active models found for feature: ${feature}`);
    }

    let lastError: any = null;

    for (const model of models) {
        try {
            const keyData = pickKey(model);
            if (!keyData) {
                console.warn(`Model ${model.id} has no keys. Skipping.`);
                continue;
            }

            const startTime = Date.now();
            const result = await callProvider(model, keyData.key, messages);
            const duration = Date.now() - startTime;

            // Success!
            await rotateKeyIndex(model); // Rotate for next user
            await logResult({
                model: model.id,
                keyIndex: keyData.index,
                success: true,
                time: new Date().toISOString(),
                feature,
                duration
            });

            return result;

        } catch (error: any) {
            console.error(`Model ${model.id} failed:`, error.message);
            lastError = error;
            
            await logResult({
                model: model.id,
                keyIndex: model.currentKeyIndex,
                success: false,
                error: error.message,
                time: new Date().toISOString(),
                feature
            });
            
            // Continue to next model (Failover)
        }
    }

    throw new Error(`All AI models failed. Last error: ${lastError?.message}`);
};
