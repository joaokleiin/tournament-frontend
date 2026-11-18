import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { AppRouter } from "./router";
import { useAuthStore } from "./store/authStore";

export function App() {
  const { restoreSession } = useAuthStore();

  // Restaura sessão do cookie ao carregar a aplicação
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "hsl(224 71% 7%)",
            color: "hsl(213 31% 91%)",
            border: "1px solid hsl(216 34% 17%)",
            borderRadius: "0.75rem",
          },
          success: { iconTheme: { primary: "hsl(263 70% 60%)", secondary: "white" } },
          error: { iconTheme: { primary: "hsl(0 63% 50%)", secondary: "white" } },
        }}
      />
    </>
  );
}

export default App;
