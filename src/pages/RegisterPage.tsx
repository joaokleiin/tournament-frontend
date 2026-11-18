import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import axios from "axios";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Nome obrigatório";
    if (!email) e.email = "E-mail obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "E-mail inválido";
    if (!password) e.password = "Senha obrigatória";
    else if (password.length < 6) e.password = "Mínimo de 6 caracteres";
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      await register(name, email, password);
      toast.success("Conta criada! Faça login para continuar.");
      navigate("/login");
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Erro ao criar conta."
        : "Erro inesperado.";
      toast.error(msg);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--obsidian)" }}
    >
      <div className="w-full max-w-sm animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div
            className="flex h-10 w-10 items-center justify-center rounded"
            style={{ backgroundColor: "var(--gold)" }}
          >
            <Trophy className="h-5 w-5" style={{ color: "var(--obsidian)" }} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold" style={{ color: "var(--snow)", letterSpacing: "-0.01em" }}>
              TournamentHub
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--steel)" }}>
              Crie sua conta gratuitamente
            </p>
          </div>
        </div>

        {/* Form */}
        <div
          className="rounded-md p-6"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-subtle)" }}
        >
          <h2 className="text-sm font-semibold mb-5" style={{ color: "var(--snow)" }}>
            Criar conta
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              id="name"
              label="Nome"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              autoComplete="name"
            />
            <Input
              id="email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              id="password"
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="new-password"
            />
            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Criar conta
            </Button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "var(--steel)" }}>
          Já tem conta?{" "}
          <Link
            to="/login"
            className="font-medium hover:opacity-70 transition-opacity"
            style={{ color: "var(--gold)" }}
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
