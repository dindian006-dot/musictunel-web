import React, { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';

interface SearchHeaderProps {
  onSearch: (query: string) => void;
}

export const SearchHeader = ({ onSearch }: SearchHeaderProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-brand-bg/80 backdrop-blur-md sticky top-0 z-10">
      <form onSubmit={handleSubmit} className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs, artists, or albums..."
          className="w-full bg-brand-surface border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent/50 transition-colors"
        />
      </form>

      <div className="flex items-center gap-4">
        <button className="p-2 text-brand-muted hover:text-brand-text transition-colors">
          <Bell size={20} />
        </button>
        <button className="flex items-center gap-2 p-1 pr-3 bg-brand-surface border border-white/5 rounded-full hover:bg-white/5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent to-pink-700 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-xs font-medium">Guest</span>
        </button>
      </div>
    </header>
  );
};
