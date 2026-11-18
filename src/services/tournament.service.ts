import api from "./api";
import type { Tournament, CreateTournamentInput } from "../types";

export const tournamentService = {
  async list(): Promise<Tournament[]> {
    const { data } = await api.get<Tournament[]>("/tournaments");
    return data;
  },

  async getById(id: string): Promise<Tournament> {
    const { data } = await api.get<Tournament>(`/tournaments/${id}`);
    return data;
  },

  async create(input: CreateTournamentInput): Promise<Tournament> {
    const { data } = await api.post<Tournament>("/tournaments", input);
    return data;
  },

  async update(id: string, input: Partial<CreateTournamentInput>): Promise<Tournament> {
    const { data } = await api.put<Tournament>(`/tournaments/${id}`, input);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/tournaments/${id}`);
  },
};
