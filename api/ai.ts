import { callAI } from "../utils/aiOrchestrator";

// Default to Node.js Runtime (Required for firebase-admin)

export default async function handler(req: any, res: any) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { messages, feature, model } = req.body;
        
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Missing messages array" });
        }

        // Call the Orchestrator
        const result = await callAI(messages, feature || 'general', model);

        return res.status(200).json({ result });

    } catch (err: any) {
        console.error("AI API Error:", err);
        return res.status(500).json({ error: "Internal Server Error", detail: err.message });
    }
}
