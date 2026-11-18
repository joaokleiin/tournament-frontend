import api from "./api";
import type { Team, CreateTeamInput } from "../types";

export const teamService = {
  async list(): Promise<Team[]> {
    const { data } = await api.get<Team[]>("/teams");
    return data;
  },

  async getById(id: string): Promise<Team> {
    const { data } = await api.get<Team>(`/teams/${id}`);
    return data;
  },

  async create(input: CreateTeamInput): Promise<Team> {
    const { data } = await api.post<Team>("/teams", input);
    return data;
  },

  async update(id: string, input: Partial<CreateTeamInput>): Promise<Team> {
    const { data } = await api.put<Team>(`/teams/${id}`, input);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/teams/${id}`);
  },
};
