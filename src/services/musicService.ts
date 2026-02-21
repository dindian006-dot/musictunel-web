import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in the Secrets panel.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export const musicService = {
  async searchMusic(query: string): Promise<Song[]> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find 10 popular songs related to "${query}". Return them as a JSON array of objects with title, artist, and a likely YouTube URL (format: https://www.youtube.com/watch?v=VIDEO_ID). Also include a high-quality placeholder thumbnail URL from picsum.photos or a generic music thumbnail.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              url: { type: Type.STRING },
              thumbnail: { type: Type.STRING },
            },
            required: ["title", "artist", "url", "thumbnail"],
          },
        },
      },
    });

    try {
      const songs = JSON.parse(response.text || "[]");
      return songs.map((s: any, index: number) => ({
        ...s,
        id: `song-${index}-${Date.now()}`,
      }));
    } catch (e) {
      console.error("Failed to parse music search results", e);
      return [];
    }
  },

  async getTrending(): Promise<Song[]> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "List 12 trending global hit songs right now. Return as JSON array with title, artist, a likely YouTube URL, and a placeholder thumbnail.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              url: { type: Type.STRING },
              thumbnail: { type: Type.STRING },
            },
            required: ["title", "artist", "url", "thumbnail"],
          },
        },
      },
    });

    try {
      const songs = JSON.parse(response.text || "[]");
      return songs.map((s: any, index: number) => ({
        ...s,
        id: `trending-${index}-${Date.now()}`,
      }));
    } catch (e) {
      console.error("Failed to parse trending music", e);
      return [];
    }
  }
};
