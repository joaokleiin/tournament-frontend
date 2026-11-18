import axios from "axios";
import Cookies from "js-cookie";

const COOKIE_NAME = "tournament_token";

// ── Instância axios ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Interceptor: injeta o token do cookie em cada requisição
api.interceptors.request.use((config) => {
  const token = Cookies.get(COOKIE_NAME);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: em 401, limpa o cookie e redireciona para login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove(COOKIE_NAME);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Helpers de cookie ──────────────────────────────────────────────────────────
export const saveToken = (token: string) => {
  Cookies.set(COOKIE_NAME, token, { expires: 1, sameSite: "strict" }); // 1 dia
};

export const removeToken = () => {
  Cookies.remove(COOKIE_NAME);
};

export const getToken = () => Cookies.get(COOKIE_NAME);

export default api;
