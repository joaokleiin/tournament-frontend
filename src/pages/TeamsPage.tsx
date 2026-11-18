import { useEffect, useState } from "react";
import { Shield, Plus, Search, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useTeamStore } from "../store/teamStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { PageLoader } from "../components/ui/LoadingSpinner";
import type { CreateTeamInput } from "../types";

const EMPTY: CreateTeamInput = { name: "", tag: "", country: "", game: "" };

export function TeamsPage() {
  const { teams, isLoading, fetchAll, create, update, remove } = useTeamStore();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateTeamInput>(EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.tag.toLowerCase().includes(search.toLowerCase()) ||
    t.game.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() { setForm(EMPTY); setEditingId(null); setIsModalOpen(true); }
  function openEdit(id: string) {
    const t = teams.find((x) => x._id === id)!;
    setForm({ name: t.name, tag: t.tag, country: t.country, game: t.game });
    setEditingId(id);
    setIsModalOpen(true);
  }

  function set(field: keyof CreateTeamInput) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSave() {
    if (!form.name || !form.tag || !form.country || !form.game) {
      toast.error("Preencha todos os campos."); return;
    }
    setIsSaving(true);
    try {
      if (editingId) { await update(editingId, form); toast.success("Time atualizado!"); }
      else { await create(form); toast.success("Time criado!"); }
      setIsModalOpen(false);
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message ?? "Erro ao salvar." : "Erro inesperado.";
      toast.error(msg);
    } finally { setIsSaving(false); }
  }

  async function handleDelete(id: string) {
    try { await remove(id); toast.success("Time excluído."); setDeleteId(null); }
    catch { toast.error("Erro ao excluir time."); }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Times</h1>
          <p className="text-muted-foreground text-sm mt-1">{teams.length} time(s) cadastrado(s)</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Novo Time</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          className="flex h-10 w-full max-w-sm rounded-lg border border-border bg-secondary pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Buscar time ou jogo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? <PageLoader /> : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Shield className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm">Nenhum time encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <div key={t._id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-bold text-sm">
                    {t.tag}
                  </div>
                  <div>
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.game}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                🌍 {t.country} · {t.players.length} jogador(es)
              </p>
              <div className="flex gap-2 pt-3 border-t border-border">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => openEdit(t._id)}>
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={() => setDeleteId(t._id)}>
                  <Trash2 className="h-3.5 w-3.5" /> Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Time" : "Novo Time"}>
        <div className="space-y-4">
          <Input label="Nome do time *" placeholder="Ex: LOUD" value={form.name} onChange={set("name")} />
          <Input label="Tag *" placeholder="Ex: LOUD (máx. 5 chars)" value={form.tag} onChange={set("tag")} maxLength={5} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="País *" placeholder="Ex: Brasil" value={form.country} onChange={set("country")} />
            <Input label="Jogo *" placeholder="Ex: Valorant" value={form.game} onChange={set("game")} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button className="flex-1" isLoading={isSaving} onClick={handleSave}>{editingId ? "Salvar" : "Criar"}</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Excluir Time">
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
