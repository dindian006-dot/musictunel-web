import { Play, MoreVertical } from 'lucide-react';
import { Song } from '../types';

interface MusicCardProps {
  song: Song;
  onClick: () => void;
}

export const MusicCard = ({ song, onClick }: MusicCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-brand-surface/30 hover:bg-brand-surface p-4 rounded-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-white/5"
    >
      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg shadow-lg">
        <img 
          src={song.thumbnail} 
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-brand-accent rounded-full flex items-center justify-center shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Play size={24} fill="black" className="ml-1" />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate mb-1 group-hover:text-brand-accent transition-colors">
            {song.title}
          </h3>
          <p className="text-xs text-brand-muted truncate">
            {song.artist}
          </p>
        </div>
        <button className="p-1 text-brand-muted hover:text-brand-text opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};
