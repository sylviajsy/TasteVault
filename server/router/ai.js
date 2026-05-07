import express from "express";
import pool from '../db/connection.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate-note', authMiddleware, async (req,res) => {
    const { score, user_acidity, user_intensity, user_sweetness, 
            user_fizziness, user_tannin, user_flavor, comment } = req.body;

    const savedFlavors = Array.isArray(user_flavor) ? user_flavor : [];
    const savedComment = comment?.trim();

    if (savedFlavors.length==0 && !savedComment) {
        return res.status(400).json({ error: "Please provide flavors or a short comment."})
    }

    const flavorContext = savedFlavors
            .map(f => `${f.group}: ${f.notes.join(', ')}`)
            .join('; ');

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const prompt = `
            You are a professional sommelier. 
            Create a concise, elegant tasting note (2-3 sentences) based on the following:
            - User rating: ${score}
            - How users think about it: ${user_acidity}, ${user_fizziness}, ${user_intensity}, ${user_sweetness}, ${user_tannin}
            - Flavors perceived: ${flavorContext}
            - User's rough thoughts: "${comment || 'No specific thoughts'}"
            
            Guidelines:
            - Focus on how flavors integrate and evolve
            - Avoid listing flavors mechanically
            - Do not start with "This wine is" or "This wine offers"
            - Avoid generic or repetitive phrases

            Output format:
            - 2–3 sentences only

            Tone:
            - Elegant, concise, and slightly personal
            - Avoid overly technical jargon
            - Avoid repetitive or generic descriptions

            Do not:
            - Start with "This wine is" or "This wine offers"
            - Repeat the same descriptor multiple times
            - Use filler phrases

            Adjust tone based on user rating:
            - High score → more expressive and positive
            - Low score → more reserved or critical

            Interpretation guide:
            - Higher acidity → brighter, fresher profile
            - Higher tannin → more structure and dryness
            - Higher sweetness → softer, rounder feel
            - Higher intensity → more concentrated flavor
        `

        const aiResult = await model.generateContent(prompt);
        const response = await aiResult.response;
        const text = response.text();

        res.json({ polishedContent: text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'AI is a bit tired...Please try later' });
    }
});

export default router;