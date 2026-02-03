import admin from 'firebase-admin';

// Prevent multiple initializations
if (!admin.apps.length) {
    try {
        const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (serviceAccountStr) {
            const serviceAccount = JSON.parse(serviceAccountStr);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || "https://dec2025-96ecd-default-rtdb.asia-southeast1.firebasedatabase.app"
            });
            console.log("Firebase Admin Initialized successfully.");
        } else {
            console.warn("FIREBASE_SERVICE_ACCOUNT not found. Admin SDK not initialized.");
            // If running in a trusted environment (like Cloud Functions), might work without explicit creds:
            // admin.initializeApp();
        }
    } catch (error) {
        console.error("Firebase Admin Init Error:", error);
    }
}

export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminRtdb = admin.apps.length ? admin.database() : null;
export default admin;
