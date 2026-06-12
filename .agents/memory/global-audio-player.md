---
name: Global audio player pattern
description: How the persistent cross-page audio player is implemented in Beatpack
---

**Pattern:** Zustand store (`audioStore.ts`) holds `currentBeat` (beat metadata + audioUrl). `<BottomPlayer />` reads from the store directly and is rendered once inside `Layout` in `App.tsx`, so it persists across all page navigations.

**Why:** Mounting `<BottomPlayer />` inside individual pages caused it to unmount/remount on navigation, stopping playback. Lifting it to Layout solves this.

**How to apply:** Any page that wants to trigger playback calls `useAudioStore().setTrack(beat)`. Only one track plays at a time — calling `setTrack` with a new beat stops the previous one (same `<audio>` element, src change triggers useEffect). The player slides in from the bottom via CSS transition on the `bottom` property.

**Store location:** `artifacts/beatpack/src/store/audioStore.ts`
**Component location:** `artifacts/beatpack/src/components/BottomPlayer.tsx`
