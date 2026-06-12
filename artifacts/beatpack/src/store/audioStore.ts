import { create } from "zustand";

export interface PlayerBeat {
  id: string;
  title: string;
  artistName?: string | null;
  coverUrl?: string | null;
  audioUrl: string;
}

interface AudioState {
  currentBeat: PlayerBeat | null;
  setTrack: (beat: PlayerBeat) => void;
  close: () => void;
}

export const useAudioStore = create<AudioState>()((set) => ({
  currentBeat: null,
  setTrack: (beat) => set({ currentBeat: beat }),
  close: () => set({ currentBeat: null }),
}));
