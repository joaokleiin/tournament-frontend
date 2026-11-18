import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Trophy, Users, Calendar, Award } from "lucide-react";
import { useTournamentStore } from "../store/tournamentStore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { PageLoader } from "../components/ui/LoadingSpinner";
import { getStatusColor, getStatusLabel, getFormatLabel, formatDate } from "../lib/utils";

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { current, isLoading, fetchById, clearCurrent } = useTournamentStore();

  useEffect(() => {
    if (id) fetchById(id);
    return () => clearCurrent();
  }, [id, fetchById, clearCurrent]);

  if (isLoading) return <PageLoader />;
  if (!current) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground">Torneio não encontrado.</p>
      <Link to="/tournaments"><Button variant="outline" className="mt-4">Voltar</Button></Link>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back */}
      <Link to="/tournaments" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Todos os torneios
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <Trophy className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{current.name}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{current.game}</p>
          </div>
        </div>
        <Badge className={`text-sm px-3 py-1 ${getStatusColor(current.status)}`} variant="outline">
          {getStatusLabel(current.status)}
        </Badge>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Trophy, label: "Formato", value: getFormatLabel(current.format) },
          { icon: Calendar, label: "Data de Início", value: formatDate(current.startDate) },
          { icon: Users, label: "Times", value: `${current.teams.length} inscrito(s)` },
          { icon: Award, label: "Premiação", value: current.prizePool ?? "—" },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-semibold mt-0.5">{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Partidas ({current.matches.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {current.matches.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhuma partida registrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {current.matches.map((m, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="text-sm">
                    <span className="font-medium">Time A</span>
                    <span className="text-muted-foreground mx-3">vs</span>
                    <span className="font-medium">Time B</span>
                  </div>
                  {m.scoreA != null && m.scoreB != null && (
                    <span className="text-sm font-bold text-primary">{m.scoreA} – {m.scoreB}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
