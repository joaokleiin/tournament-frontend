import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Users, Shield, TrendingUp, ArrowRight, Calendar } from "lucide-react";
import { useTournamentStore } from "../store/tournamentStore";
import { usePlayerStore } from "../store/playerStore";
import { useTeamStore } from "../store/teamStore";
import { useAuthStore } from "../store/authStore";
import { Badge } from "../components/ui/Badge";
import { getStatusColor, getStatusLabel, formatDate } from "../lib/utils";

export function DashboardPage() {
  const { user } = useAuthStore();
  const { tournaments, fetchAll: fetchTournaments } = useTournamentStore();
  const { players, fetchAll: fetchPlayers } = usePlayerStore();
  const { teams, fetchAll: fetchTeams } = useTeamStore();

  useEffect(() => {
    fetchTournaments();
    fetchPlayers();
    fetchTeams();
  }, [fetchTournaments, fetchPlayers, fetchTeams]);

  const ongoing = tournaments.filter((t) => t.status === "ongoing");
  const upcoming = tournaments.filter((t) => t.status === "upcoming");
  const recent = [...tournaments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="animate-fade-in" style={{ maxWidth: "900px" }}>

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold mb-1" style={{ color: "var(--steel)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Bem-vindo de volta
        </p>
        <h1 className="text-2xl font-bold" style={{ color: "var(--snow)", letterSpacing: "-0.01em" }}>
          {user?.name?.split(" ")[0]}
        </h1>
      </div>

      {/* Stats — número principal + apoio */}
      <div className="grid grid-cols-4 gap-3 mb-10">
        {/* Stat principal: torneios em andamento — recebe o dourado */}
        <div
          className="col-span-2 rounded-md p-6 flex flex-col justify-between"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-subtle)", minHeight: "130px" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: "var(--steel)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Em andamento
            </span>
            <TrendingUp className="h-4 w-4" style={{ color: "var(--gold)" }} />
          </div>
          <div>
            <span
              className="block font-extrabold leading-none"
              style={{ fontSize: "3.5rem", letterSpacing: "-0.03em", color: "var(--gold)" }}
            >
              {ongoing.length}
            </span>
            <span className="text-xs mt-1 block" style={{ color: "var(--steel)" }}>
              {ongoing.length === 1 ? "torneio ativo" : "torneios ativos"}
            </span>
          </div>
        </div>

        {/* Stats de apoio — monocromáticos */}
        <div className="col-span-2 grid grid-rows-3 gap-3">
          {[
            { label: "Torneios", value: tournaments.length, icon: Trophy },
            { label: "Times", value: teams.length, icon: Shield },
            { label: "Jogadores", value: players.length, icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-md px-4 flex items-center justify-between"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-3.5 w-3.5" style={{ color: "var(--steel)" }} />
                <span className="text-xs" style={{ color: "var(--steel)" }}>{label}</span>
              </div>
              <span className="text-lg font-bold" style={{ color: "var(--snow)", fontVariantNumeric: "tabular-nums" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Listas */}
      <div className="grid grid-cols-2 gap-5">

        {/* Torneios recentes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold" style={{ color: "var(--steel)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Recentes
            </span>
            <Link
              to="/tournaments"
              className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
              style={{ color: "var(--steel)" }}
            >
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div
            className="rounded-md overflow-hidden"
            style={{ border: "1px solid var(--border-subtle)" }}
          >
            {recent.length === 0 ? (
              <p className="text-xs text-center py-8" style={{ color: "var(--steel)" }}>
                Nenhum torneio cadastrado.
              </p>
            ) : (
              recent.map((t, i) => (
                <Link
                  key={t._id}
                  to={`/tournaments/${t._id}`}
                  className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-white/5 group"
                  style={{
                    borderTop: i > 0 ? "1px solid var(--border-subtle)" : "none",
                  }}
                >
                  <div>
                    <p className="text-sm font-medium transition-colors group-hover:text-white" style={{ color: "var(--snow)" }}>
                      {t.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--steel)" }}>
                      {t.game} · {formatDate(t.startDate)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(t.status)} variant="outline">
                    {getStatusLabel(t.status)}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Próximos torneios */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold" style={{ color: "var(--steel)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Próximos
            </span>
          </div>
          <div
            className="rounded-md overflow-hidden"
            style={{ border: "1px solid var(--border-subtle)" }}
          >
            {upcoming.length === 0 ? (
              <p className="text-xs text-center py-8" style={{ color: "var(--steel)" }}>
                Nenhum torneio agendado.
              </p>
            ) : (
              upcoming.slice(0, 5).map((t, i) => (
                <div
                  key={t._id}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderTop: i > 0 ? "1px solid var(--border-subtle)" : "none" }}
                >
                  <Calendar className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--steel)" }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--snow)" }}>{t.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--steel)" }}>
                      Início: {formatDate(t.startDate)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
