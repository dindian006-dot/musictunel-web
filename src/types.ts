export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
  duration?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}
