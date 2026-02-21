import { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { X, Music } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

interface LyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  songTitle: string;
  artist: string;
}

export const LyricsModal = ({ isOpen, onClose, songTitle, artist }: LyricsModalProps) => {
  const [lyrics, setLyrics] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && songTitle) {
      fetchLyrics();
    }
  }, [isOpen, songTitle]);

  const fetchLyrics = async () => {
    setLoading(true);
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Find the lyrics for "${songTitle}" by "${artist}". If you can't find the exact lyrics, provide a summary or a poetic description of the song's meaning. Format the output nicely in Markdown.`,
      });
      setLyrics(response.text || 'Lyrics not found.');
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      setLyrics('Failed to load lyrics.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-brand-surface w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/5"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-brand-surface/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-accent/20 rounded-lg flex items-center justify-center text-brand-accent">
                  <Music size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-none">{songTitle}</h2>
                  <p className="text-sm text-brand-muted mt-1">{artist}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-brand-muted hover:text-brand-text"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                  <p className="text-brand-muted animate-pulse">Fetching lyrics...</p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none prose-p:text-brand-muted prose-headings:text-brand-text prose-strong:text-brand-accent">
                  <ReactMarkdown>{lyrics}</ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
