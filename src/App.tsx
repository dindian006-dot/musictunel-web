import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { SearchHeader } from './components/SearchHeader';
import { MusicCard } from './components/MusicCard';
import { Player } from './components/Player';
import { musicService } from './services/musicService';
import { Song } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Music2 } from 'lucide-react';

export default function App() {
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [searchResults, setSearchResults] = useState<Song[] | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const trending = await musicService.getTrending();
        setTrendingSongs(trending);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleSearch = async (query: string) => {
    setSearching(true);
    try {
      const results = await musicService.searchMusic(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const handlePlayNext = () => {
    const list = searchResults || trendingSongs;
    if (!currentSong || list.length === 0) return;
    const currentIndex = list.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % list.length;
    setCurrentSong(list[nextIndex]);
  };

  const handlePlayPrev = () => {
    const list = searchResults || trendingSongs;
    if (!currentSong || list.length === 0) return;
    const currentIndex = list.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    setCurrentSong(list[prevIndex]);
  };

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden">
      <Sidebar 
        onHome={() => setSearchResults(null)} 
        onExplore={() => handleSearch("surprise me with something new and trending")} 
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <SearchHeader onSearch={handleSearch} />
        
        <div className="flex-1 overflow-y-auto pb-32">
          <div className="p-8">
            <AnimatePresence mode="wait">
              {searching ? (
                <motion.div 
                  key="searching"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 gap-4"
                >
                  <Loader2 className="animate-spin text-brand-accent" size={40} />
                  <p className="text-brand-muted font-medium">Finding the best music for you...</p>
                </motion.div>
              ) : searchResults ? (
                <motion.section
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Search Results</h2>
                    <button 
                      onClick={() => setSearchResults(null)}
                      className="text-xs font-bold text-brand-muted hover:text-brand-text uppercase tracking-widest"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {searchResults.map((song) => (
                      <MusicCard 
                        key={song.id} 
                        song={song} 
                        onClick={() => setCurrentSong(song)} 
                      />
                    ))}
                  </div>
                </motion.section>
              ) : loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="bg-brand-surface/20 aspect-square rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <motion.section
                  key="trending"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  {/* Hero Section */}
                  <div className="relative h-64 rounded-2xl overflow-hidden group">
                    <img 
                      src="https://picsum.photos/seed/music/1200/400" 
                      alt="Hero" 
                      className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end gap-2">
                      <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-accent">Featured Playlist</span>
                      <h1 className="text-5xl font-black tracking-tighter">Global Top Hits</h1>
                      <p className="text-brand-muted max-w-md text-sm">The most played tracks around the world right now.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Music2 className="text-brand-accent" size={24} />
                      <h2 className="text-2xl font-bold tracking-tight">Trending Now</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {trendingSongs.map((song) => (
                        <MusicCard 
                          key={song.id} 
                          song={song} 
                          onClick={() => setCurrentSong(song)} 
                        />
                      ))}
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Player 
          currentSong={currentSong} 
          onNext={handlePlayNext}
          onPrev={handlePlayPrev}
        />
      </main>
    </div>
  );
}
