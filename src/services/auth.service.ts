import api from "./api";
import type { User } from "../types";

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
    return data;
  },

  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>("/auth/register", { name, email, password });
    return data;
  },
};
