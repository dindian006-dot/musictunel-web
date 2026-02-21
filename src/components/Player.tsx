import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Repeat, Shuffle, Volume2, VolumeX,
  Maximize2, ListMusic, Languages
} from 'lucide-react';
import { Song } from '../types';
import { cn } from '../lib/utils';
import { LyricsModal } from './LyricsModal';

interface PlayerProps {
  currentSong: Song | null;
  onNext?: () => void;
  onPrev?: () => void;
}

export const Player = ({ currentSong, onNext, onPrev }: PlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (currentSong) {
      setPlaying(true);
    }
  }, [currentSong]);

  if (!currentSong) return null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    playerRef.current?.seekTo(val);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/90 backdrop-blur-xl border-t border-white/5 px-6 flex items-center justify-between z-50">
      <div className="hidden" style={{ display: 'none' }}>
        <ReactPlayer
          ref={playerRef}
          url={currentSong.url}
          playing={playing}
          volume={volume}
          muted={muted}
          onProgress={(state) => setProgress(state.played)}
          onDuration={(d) => setDuration(d)}
          onEnded={onNext}
        />
      </div>

      {/* Left: Song Info */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="w-14 h-14 rounded-md overflow-hidden shadow-md border border-white/5">
          <img 
            src={currentSong.thumbnail} 
            alt={currentSong.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-sm font-bold truncate hover:underline cursor-pointer">
            {currentSong.title}
          </h4>
          <p className="text-xs text-brand-muted truncate hover:text-brand-text cursor-pointer">
            {currentSong.artist}
          </p>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center gap-2 w-1/3 max-w-md">
        <div className="flex items-center gap-6">
          <button className="text-brand-muted hover:text-brand-accent transition-colors">
            <Shuffle size={18} />
          </button>
          <button onClick={onPrev} className="text-brand-text hover:text-brand-accent transition-colors">
            <SkipBack size={22} fill="currentColor" />
          </button>
          <button 
            onClick={() => setPlaying(!playing)}
            className="w-10 h-10 bg-brand-text rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {playing ? (
              <Pause size={20} fill="black" className="text-black" />
            ) : (
              <Play size={20} fill="black" className="text-black ml-1" />
            )}
          </button>
          <button onClick={onNext} className="text-brand-text hover:text-brand-accent transition-colors">
            <SkipForward size={22} fill="currentColor" />
          </button>
          <button className="text-brand-muted hover:text-brand-accent transition-colors">
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full">
          <span className="text-[10px] text-brand-muted font-mono w-8 text-right">
            {formatTime(progress * duration)}
          </span>
          <div className="relative flex-1 group h-1 flex items-center">
            <input
              type="range"
              min={0}
              max={1}
              step="any"
              value={progress}
              onChange={handleSeek}
              className="absolute w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-accent group-hover:h-1.5 transition-all"
            />
            <div 
              className="h-full bg-brand-accent rounded-full pointer-events-none" 
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-brand-muted font-mono w-8">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: Volume & Extra */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        <button 
          onClick={() => setShowLyrics(true)}
          className="text-brand-muted hover:text-brand-accent transition-colors flex items-center gap-1.5"
          title="View Lyrics"
        >
          <Languages size={18} />
          <span className="text-[10px] font-bold uppercase tracking-wider hidden xl:inline">Lyrics</span>
        </button>
        <button className="text-brand-muted hover:text-brand-text transition-colors">
          <ListMusic size={18} />
        </button>
        <div className="flex items-center gap-2 group">
          <button 
            onClick={() => setMuted(!muted)}
            className="text-brand-muted hover:text-brand-text transition-colors"
          >
            {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-accent"
          />
        </div>
        <button className="text-brand-muted hover:text-brand-text transition-colors">
          <Maximize2 size={16} />
        </button>
      </div>

      <LyricsModal 
        isOpen={showLyrics} 
        onClose={() => setShowLyrics(false)} 
        songTitle={currentSong.title} 
        artist={currentSong.artist} 
      />
    </div>
  );
};
