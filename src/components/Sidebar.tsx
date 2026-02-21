import React from 'react';
import { Home, Compass, Library, PlusSquare, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all duration-200 group",
      active 
        ? "bg-brand-surface text-brand-accent" 
        : "text-brand-muted hover:text-brand-text hover:bg-brand-surface/50"
    )}
  >
    <span className={cn("transition-transform duration-200 group-hover:scale-110", active && "text-brand-accent")}>
      {icon}
    </span>
    <span className="font-medium text-sm">{label}</span>
  </button>
);

interface SidebarProps {
  onHome: () => void;
  onExplore: () => void;
}

export const Sidebar = ({ onHome, onExplore }: SidebarProps) => {
  return (
    <aside className="w-64 h-full flex flex-col bg-black border-r border-white/5 p-4 gap-8">
      <div className="flex items-center gap-2 px-2">
        <h1 className="text-2xl font-black tracking-tighter text-brand-accent">musictunel</h1>
      </div>

      <nav className="flex flex-col gap-2">
        <SidebarItem icon={<Home size={22} />} label="Home" onClick={onHome} active />
        <SidebarItem icon={<Compass size={22} />} label="Explore" onClick={onExplore} />
        <SidebarItem icon={<Library size={22} />} label="Library" />
      </nav>

      <div className="flex flex-col gap-2 mt-4">
        <h2 className="px-4 text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Playlists</h2>
        <SidebarItem icon={<PlusSquare size={22} />} label="Create Playlist" />
        <SidebarItem icon={<Heart size={22} />} label="Liked Songs" />
      </div>

    </aside>
  );
};
