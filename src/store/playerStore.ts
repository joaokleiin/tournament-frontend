import { create } from "zustand";
import { playerService } from "../services/player.service";
import type { Player, CreatePlayerInput } from "../types";

interface PlayerStore {
  players: Player[];
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  create: (data: CreatePlayerInput) => Promise<void>;
  update: (id: string, data: Partial<CreatePlayerInput>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  players: [],
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const players = await playerService.list();
      set({ players, isLoading: false });
    } catch {
      set({ error: "Erro ao carregar jogadores.", isLoading: false });
    }
  },

  create: async (data) => {
    const player = await playerService.create(data);
    set((s) => ({ players: [player, ...s.players] }));
  },

  update: async (id, data) => {
    const updated = await playerService.update(id, data);
    set((s) => ({ players: s.players.map((p) => (p._id === id ? updated : p)) }));
  },

  remove: async (id) => {
    await playerService.remove(id);
    set((s) => ({ players: s.players.filter((p) => p._id !== id) }));
  },
}));
