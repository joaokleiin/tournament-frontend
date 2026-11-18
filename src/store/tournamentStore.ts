import { create } from "zustand";
import { tournamentService } from "../services/tournament.service";
import type { Tournament, CreateTournamentInput } from "../types";

interface TournamentStore {
  tournaments: Tournament[];
  current: Tournament | null;
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  create: (data: CreateTournamentInput) => Promise<void>;
  update: (id: string, data: Partial<CreateTournamentInput>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearCurrent: () => void;
}

export const useTournamentStore = create<TournamentStore>((set) => ({
  tournaments: [],
  current: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const tournaments = await tournamentService.list();
      set({ tournaments, isLoading: false });
    } catch {
      set({ error: "Erro ao carregar torneios.", isLoading: false });
    }
  },

  fetchById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const current = await tournamentService.getById(id);
      set({ current, isLoading: false });
    } catch {
      set({ error: "Torneio não encontrado.", isLoading: false });
    }
  },

  create: async (data) => {
    const tournament = await tournamentService.create(data);
    set((s) => ({ tournaments: [tournament, ...s.tournaments] }));
  },

  update: async (id, data) => {
    const updated = await tournamentService.update(id, data);
    set((s) => ({
      tournaments: s.tournaments.map((t) => (t._id === id ? updated : t)),
      current: s.current?._id === id ? updated : s.current,
    }));
  },

  remove: async (id) => {
    await tournamentService.remove(id);
    set((s) => ({ tournaments: s.tournaments.filter((t) => t._id !== id) }));
  },

  clearCurrent: () => set({ current: null }),
}));
