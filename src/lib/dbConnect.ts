import mongoose from "mongoose";

/**
 * Maine ye object isliye banaya hai taaki main track rakh saku ki 
 * database pehle se connected hai ya nahi. 
 * Next.js mein baar-baar naya connection banana memory waste karta hai.
 */
type ConnectionObject = {
    isConnected?: number; 
};

const connection: ConnectionObject = {};

/**
 * Ye mera main function hai jo database connect karega.
 * Isko main apni har API route mein sabse upar call karunga.
 */
async function dbConnect(): Promise<void> {
    // Sabse pehle main check kar raha hoon: "Kya connection pehle se hai?"
    // Agar hai, toh wahin se 'return' ho jao, naya connection mat banao.
    if (connection.isConnected) {
        console.log("Already connected to DB");
        return;
    }

    try {
        // Agar connection nahi hai, toh main yahan naya connection banane ki koshish kar raha hoon.
        // MONGODB_URI meri .env file mein hai (Security ke liye).
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

        // Connection banne ke baad, main uska 'state' (0, 1, 2, 3) save kar leta hoon.
        // db.connections[0].readyState mujhe batayega ki hum successfully connect ho chuke hain.
        connection.isConnected = db.connections[0].readyState;

        console.log("Mera Database mast connect ho gaya! ✅");
        
    } catch (error) {
        // Agar kuch gadbad hui aur connect nahi ho paya toh yahan error dikhega.
        console.log("Database connection mein error aa gaya! ❌", error);
        
        // Agar DB hi nahi chala toh app bhi nahi chalni chahiye, isliye process exit kar raha hoon.
        process.exit(1);
    }
}

export default dbConnect;