import api from "./api";
import type { Player, CreatePlayerInput } from "../types";

export const playerService = {
  async list(): Promise<Player[]> {
    const { data } = await api.get<Player[]>("/players");
    return data;
  },

  async getById(id: string): Promise<Player> {
    const { data } = await api.get<Player>(`/players/${id}`);
    return data;
  },

  async create(input: CreatePlayerInput): Promise<Player> {
    const { data } = await api.post<Player>("/players", input);
    return data;
  },

  async update(id: string, input: Partial<CreatePlayerInput>): Promise<Player> {
    const { data } = await api.put<Player>(`/players/${id}`, input);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/players/${id}`);
  },
};
