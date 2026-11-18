// ── Auth ──────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => void;
}

// ── Tournament ────────────────────────────────────────────────────────────────
export type TournamentStatus = "upcoming" | "ongoing" | "finished";
export type TournamentFormat = "single_elimination" | "round_robin";

export interface Tournament {
  _id: string;
  name: string;
  game: string;
  format: TournamentFormat;
  status: TournamentStatus;
  startDate: string;
  prizePool?: string;
  teams: string[];
  matches: Match[];
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  teamA: string;
  teamB: string;
  winner?: string;
  scoreA?: number;
  scoreB?: number;
  playedAt?: string;
}

export interface CreateTournamentInput {
  name: string;
  game: string;
  format: TournamentFormat;
  status?: TournamentStatus;
  startDate: string;
  prizePool?: string;
}

// ── Player ────────────────────────────────────────────────────────────────────
export interface Player {
  _id: string;
  nickname: string;
  fullName: string;
  email: string;
  country: string;
  mainGame: string;
  createdAt: string;
}

export interface CreatePlayerInput {
  nickname: string;
  fullName: string;
  email: string;
  country: string;
  mainGame: string;
}

// ── Team ──────────────────────────────────────────────────────────────────────
export interface Team {
  _id: string;
  name: string;
  tag: string;
  country: string;
  game: string;
  players: string[];
  createdAt: string;
}

export interface CreateTeamInput {
  name: string;
  tag: string;
  country: string;
  game: string;
}

// ── API helpers ───────────────────────────────────────────────────────────────
export interface ApiError {
  message: string;
}
