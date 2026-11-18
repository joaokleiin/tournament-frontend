import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Trophy, Pencil, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useTournamentStore } from "../store/tournamentStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { PageLoader } from "../components/ui/LoadingSpinner";
import { getStatusColor, getStatusLabel, getFormatLabel, formatDate } from "../lib/utils";
import type { CreateTournamentInput, TournamentStatus } from "../types";

const EMPTY_FORM: CreateTournamentInput = {
  name: "", game: "", format: "single_elimination", status: "upcoming", startDate: "", prizePool: "",
};

export function TournamentsPage() {
  const { tournaments, isLoading, fetchAll, create, update, remove } = useTournamentStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TournamentStatus | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateTournamentInput>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = tournaments.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.game.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsModalOpen(true);
  }

  function openEdit(id: string) {
    const t = tournaments.find((x) => x._id === id)!;
    setForm({
      name: t.name, game: t.game, format: t.format,
      status: t.status, startDate: t.startDate.split("T")[0], prizePool: t.prizePool ?? "",
    });
    setEditingId(id);
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.game || !form.startDate) {
      toast.error("Preencha os campos obrigatórios."); return;
    }
    setIsSaving(true);
    try {
      if (editingId) {
        await update(editingId, form);
        toast.success("Torneio atualizado!");
      } else {
        await create(form);
        toast.success("Torneio criado!");
      }
      setIsModalOpen(false);
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message ?? "Erro ao salvar." : "Erro inesperado.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await remove(id);
      toast.success("Torneio excluído.");
      setDeleteId(null);
    } catch {
      toast.error("Erro ao excluir torneio.");
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Torneios</h1>
          <p className="text-muted-foreground text-sm mt-1">{tournaments.length} torneio(s) cadastrado(s)</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Novo Torneio</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="flex h-10 w-full rounded-lg border border-border bg-secondary pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Buscar por nome ou jogo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TournamentStatus | "all")}
        >
          <option value="all">Todos os status</option>
          <option value="upcoming">Em breve</option>
          <option value="ongoing">Em andamento</option>
          <option value="finished">Encerrado</option>
        </select>
      </div>

      {/* Content */}
      {isLoading ? <PageLoader /> : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Trophy className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm">Nenhum torneio encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <div key={t._id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <Badge className={getStatusColor(t.status)} variant="outline">{getStatusLabel(t.status)}</Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{t.name}</h3>
              <p className="text-xs text-muted-foreground mb-1">{t.game}</p>
              <p className="text-xs text-muted-foreground mb-3">{getFormatLabel(t.format)} · {formatDate(t.startDate)}</p>
              {t.prizePool && (
                <p className="text-xs font-medium text-yellow-400 mb-3">🏆 {t.prizePool}</p>
              )}
              <div className="flex gap-2 pt-3 border-t border-border">
                <Link to={`/tournaments/${t._id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full"><Eye className="h-3 w-3" /> Ver</Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => openEdit(t._id)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(t._id)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal criar/editar */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Torneio" : "Novo Torneio"}>
        <div className="space-y-4">
          <Input label="Nome *" placeholder="Ex: Copa Brasil 2025" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input label="Jogo *" placeholder="Ex: League of Legends" value={form.game} onChange={(e) => setForm((f) => ({ ...f, game: e.target.value }))} />
          <Select label="Formato *" value={form.format} onChange={(e) => setForm((f) => ({ ...f, format: e.target.value as "single_elimination" | "round_robin" }))}>
            <option value="single_elimination">Eliminação Simples</option>
            <option value="round_robin">Round Robin</option>
          </Select>
          <Select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TournamentStatus }))}>
            <option value="upcoming">Em breve</option>
            <option value="ongoing">Em andamento</option>
            <option value="finished">Encerrado</option>
          </Select>
          <Input label="Data de início *" type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
          <Input label="Premiação" placeholder="Ex: R$ 10.000" value={form.prizePool ?? ""} onChange={(e) => setForm((f) => ({ ...f, prizePool: e.target.value }))} />
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button className="flex-1" isLoading={isSaving} onClick={handleSave}>
              {editingId ? "Salvar" : "Criar"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmar exclusão */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Excluir Torneio">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Tem certeza? Esta ação não pode ser desfeita.</p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="destructive" className="flex-1" onClick={() => deleteId && handleDelete(deleteId)}>Excluir</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
