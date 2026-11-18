import { create } from "zustand";
import { teamService } from "../services/team.service";
import type { Team, CreateTeamInput } from "../types";

interface TeamStore {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  create: (data: CreateTeamInput) => Promise<void>;
  update: (id: string, data: Partial<CreateTeamInput>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const teams = await teamService.list();
      set({ teams, isLoading: false });
    } catch {
      set({ error: "Erro ao carregar times.", isLoading: false });
    }
  },

  create: async (data) => {
    const team = await teamService.create(data);
    set((s) => ({ teams: [team, ...s.teams] }));
  },

  update: async (id, data) => {
    const updated = await teamService.update(id, data);
    set((s) => ({ teams: s.teams.map((t) => (t._id === id ? updated : t)) }));
  },

  remove: async (id) => {
    await teamService.remove(id);
    set((s) => ({ teams: s.teams.filter((t) => t._id !== id) }));
  },
}));
