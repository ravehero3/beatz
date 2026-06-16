import { create } from "zustand";

export interface PlayerBeat {
  id: string;
  title: string;
  artistName?: string | null;
  coverUrl?: string | null;
  audioUrl: string;
}

/** Shared ref so the store's toggle() can imperatively control the audio element */
export const globalAudioRef = { current: null as HTMLAudioElement | null };

interface AudioState {
  currentBeat: PlayerBeat | null;
  isPlaying: boolean;
  setTrack: (beat: PlayerBeat) => void;
  close: () => void;
  setIsPlaying: (v: boolean) => void;
  toggle: () => void;
}

export const useAudioStore = create<AudioState>()((set) => ({
  currentBeat: null,
  isPlaying: false,
  setTrack: (beat) => set({ currentBeat: beat }),
  close: () => set({ currentBeat: null, isPlaying: false }),
  setIsPlaying: (v) => set({ isPlaying: v }),
  toggle: () => {
    const audio = globalAudioRef.current;
    if (!audio) return;
    if (audio.paused) { audio.play(); } else { audio.pause(); }
  },
}));
