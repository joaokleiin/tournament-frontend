import { useEffect, useState } from "react";
import { Users, Plus, Search, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { usePlayerStore } from "../store/playerStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { PageLoader } from "../components/ui/LoadingSpinner";
import type { CreatePlayerInput } from "../types";

const EMPTY: CreatePlayerInput = { nickname: "", fullName: "", email: "", country: "", mainGame: "" };

export function PlayersPage() {
  const { players, isLoading, fetchAll, create, update, remove } = usePlayerStore();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreatePlayerInput>(EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = players.filter((p) =>
    p.nickname.toLowerCase().includes(search.toLowerCase()) ||
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.mainGame.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() { setForm(EMPTY); setEditingId(null); setIsModalOpen(true); }
  function openEdit(id: string) {
    const p = players.find((x) => x._id === id)!;
    setForm({ nickname: p.nickname, fullName: p.fullName, email: p.email, country: p.country, mainGame: p.mainGame });
    setEditingId(id);
    setIsModalOpen(true);
  }

  function set(field: keyof CreatePlayerInput) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSave() {
    if (!form.nickname || !form.fullName || !form.email || !form.country || !form.mainGame) {
      toast.error("Preencha todos os campos."); return;
    }
    setIsSaving(true);
    try {
      if (editingId) { await update(editingId, form); toast.success("Jogador atualizado!"); }
      else { await create(form); toast.success("Jogador cadastrado!"); }
      setIsModalOpen(false);
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message ?? "Erro ao salvar." : "Erro inesperado.";
      toast.error(msg);
    } finally { setIsSaving(false); }
  }

  async function handleDelete(id: string) {
    try { await remove(id); toast.success("Jogador excluído."); setDeleteId(null); }
    catch { toast.error("Erro ao excluir jogador."); }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jogadores</h1>
          <p className="text-muted-foreground text-sm mt-1">{players.length} jogador(es) cadastrado(s)</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Novo Jogador</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          className="flex h-10 w-full max-w-sm rounded-lg border border-border bg-secondary pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Buscar jogador ou jogo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? <PageLoader /> : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Users className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm">Nenhum jogador encontrado.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                {["Nickname", "Nome", "Jogo", "País", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{p.nickname}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.fullName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.mainGame}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.country}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p._id)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(p._id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Jogador" : "Novo Jogador"}>
        <div className="space-y-4">
          <Input label="Nickname *" placeholder="Ex: s1mple" value={form.nickname} onChange={set("nickname")} />
          <Input label="Nome completo *" placeholder="Ex: Oleksandr Kostyliev" value={form.fullName} onChange={set("fullName")} />
          <Input label="E-mail *" type="email" placeholder="jogador@email.com" value={form.email} onChange={set("email")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="País *" placeholder="Ex: Brasil" value={form.country} onChange={set("country")} />
            <Input label="Jogo principal *" placeholder="Ex: CS2" value={form.mainGame} onChange={set("mainGame")} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button className="flex-1" isLoading={isSaving} onClick={handleSave}>{editingId ? "Salvar" : "Cadastrar"}</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Excluir Jogador">
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
