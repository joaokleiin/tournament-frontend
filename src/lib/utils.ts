import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    upcoming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    ongoing: "bg-green-500/20 text-green-400 border-green-500/30",
    finished: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return map[status] ?? "bg-muted text-muted-foreground";
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    upcoming: "Em breve",
    ongoing: "Em andamento",
    finished: "Encerrado",
  };
  return map[status] ?? status;
}

export function getFormatLabel(format: string): string {
  const map: Record<string, string> = {
    single_elimination: "Eliminação Simples",
    round_robin: "Round Robin",
  };
  return map[format] ?? format;
}
