import { GoogleGenAI, Chat } from "@google/genai";
import { UserData, ChatMessage } from "../types";

const SYSTEM_INSTRUCTION = `
You are 'GymPal Coach', a specialized fitness expert for a specific user.
USER PROFILE:
- Male, 40 years old, 5'9", 170 lbs.
- GOALS: Calisthenics mastery (Human Flag, Muscle Up), Splits flexibility, Abs, Strength (maintain 160lbs+).
- CONSTRAINTS: History of L4/L5 lower back issues (CRITICAL: Protect the spine), Weak legs, Extremely inflexible.
- CURRENT STATS: 20 pushups, 0 situps, 0 pullups.
- EQUIPMENT: Gym Monster (cable machine), NordicTrack Elliptical, Rower.

YOUR ROLE:
1. PHASE 1 FOCUS: Connective Tissue & Tendon Strength. Do NOT suggest heavy weights yet. Prioritize volume and time under tension.
2. Provide safe, back-friendly alternatives immediately if asked (e.g., Dead Bugs instead of Situps).
3. Explain 'How-To' for his specific equipment.
4. Keep responses concise, motivating, and actionable.
5. If he mentions pain, suggest stopping and doing a specific mobility drill (like Cat-Cow).
`;

export const geminiService = {
  createChatSession: (): Chat | null => {
    if (!process.env.VITE_GOOGLE_GENAI_API_KEY) return null;

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.VITE_GOOGLE_GENAI_API_KEY,
      });
      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
      return chat;
    } catch (e) {
      console.error("Failed to create chat session", e);
      return null;
    }
  },

  analyzeProgress: async (data: UserData): Promise<string> => {
    if (!process.env.VITE_GOOGLE_GENAI_API_KEY) {
      return "AI Analysis unavailable: No API Key provided in environment.";
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.VITE_GOOGLE_GENAI_API_KEY,
      });

      const prompt = `
        Analyze this weekly workout data for a 40yo male with L4/L5 back issues aiming for calisthenics:
        
        - Week: ${data.weekCount}
        - Weight: ${data.bodyStats.weight} lbs
        - Consistency: ${data.completed.length} sessions
        - Logs: ${JSON.stringify(data.actuals)}
        - Nutrition: ${JSON.stringify(data.nutrition)}
        
        Give 3 bullet points:
        1. What went well?
        2. What needs attention (form/volume)?
        3. A specific challenge for next week (e.g., "Add 5 sec to Dead Hang").
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return response.text || "Could not generate analysis.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "AI Analysis failed to load. Please check your connection.";
    }
  },

  generateChatSummary: async (
    chatMessages: ChatMessage[],
    weekNum: number
  ): Promise<string> => {
    if (!process.env.VITE_GOOGLE_GENAI_API_KEY) {
      return "Chat summary unavailable: No API Key provided.";
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.VITE_GOOGLE_GENAI_API_KEY,
      });

      const conversationText = chatMessages
        .map((msg) => `${msg.role === "user" ? "User" : "Coach"}: ${msg.text}`)
        .join("\n\n");

      const prompt = `
You are analyzing a week of conversation between a fitness coach and a 40-year-old athlete with L4/L5 back issues pursuing calisthenics goals.

Here's the conversation from Week ${weekNum}:

${conversationText}

Please provide a concise summary (3-4 sentences) covering:
1. Key concerns or pain points mentioned
2. Progress indicators or wins discussed
3. Main advice given or strategies discussed
4. Recommended focus for next week

Keep it actionable and motivating.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return response.text || "Could not generate chat summary.";
    } catch (error) {
      console.error("Gemini Chat Summary Error:", error);
      return "Failed to generate chat summary.";
    }
  },
};