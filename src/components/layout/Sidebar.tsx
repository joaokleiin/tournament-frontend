import { NavLink } from "react-router-dom";
import { Trophy, Users, Shield, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/tournaments", label: "Torneios", icon: Trophy },
  { to: "/teams", label: "Times", icon: Shield },
  { to: "/players", label: "Jogadores", icon: Users },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const initials = user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <aside
      className="flex h-screen w-56 flex-col shrink-0"
      style={{ backgroundColor: "var(--surface)", borderRight: "1px solid var(--border-subtle)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div
          className="flex h-7 w-7 items-center justify-center rounded"
          style={{ backgroundColor: "var(--gold)" }}
        >
          <Trophy className="h-3.5 w-3.5" style={{ color: "var(--obsidian)" }} />
        </div>
        <span className="font-700 text-sm tracking-tight" style={{ color: "var(--snow)", fontWeight: 700 }}>
          TournamentHub
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded px-3 py-2 text-sm transition-all duration-150",
                isActive
                  ? "font-semibold"
                  : "font-normal hover:bg-white/5"
              )
            }
            style={({ isActive }) =>
              isActive
                ? { color: "var(--gold)", backgroundColor: "var(--gold-muted)" }
                : { color: "var(--steel)" }
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1 rounded">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0"
            style={{ backgroundColor: "var(--surface-high)", color: "var(--snow)" }}
          >
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold truncate" style={{ color: "var(--snow)" }}>
              {user?.name}
            </span>
            <span className="text-xs truncate" style={{ color: "var(--steel)" }}>
              {user?.email}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm transition-all duration-150 hover:bg-red-500/10"
          style={{ color: "var(--steel)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--steel)")}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}
