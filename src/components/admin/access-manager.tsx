"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

type AccessUser = {
  id: string;
  email: string;
  role: "admin" | "user";
  libraryAccess: boolean;
  createdAt: string;
  lastSignInAt: string | null;
};

export function AccessManager({ initialUsers }: { initialUsers: AccessUser[] }) {
  const [users, setUsers] = useState<AccessUser[]>(initialUsers);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [libraryAccess, setLibraryAccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadUsers() {
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Falha ao carregar usuarios.");
      return;
    }
    setUsers(data.users ?? []);
  }

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        libraryAccess,
      }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Nao foi possivel criar usuario.");
      return;
    }

    setMessage("Usuario criado com sucesso.");
    setEmail("");
    setPassword("");
    setLibraryAccess(true);
    await loadUsers();
  }

  async function toggleLibraryAccess(user: AccessUser) {
    setMessage(null);
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, libraryAccess: !user.libraryAccess }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Nao foi possivel atualizar acesso.");
      return;
    }
    await loadUsers();
  }

  return (
    <section className="mt-10 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Acessos da Biblioteca</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie usuarios manualmente apos confirmar pagamento via WhatsApp.
        </p>
      </div>

      <form onSubmit={handleCreateUser} className="grid gap-3 rounded-2xl border bg-card/70 p-4 md:grid-cols-4">
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">E-mail do cliente</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="cliente@email.com"
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Senha inicial</span>
          <input
            required
            minLength={8}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="min. 8 caracteres"
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
          />
        </label>
        <div className="flex items-end gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={libraryAccess}
              onChange={(event) => setLibraryAccess(event.target.checked)}
            />
            Liberar biblioteca
          </label>
        </div>
        <div className="md:col-span-4">
          <Button type="submit" disabled={loading} className="rounded-full">
            {loading ? "Criando..." : "Criar usuario"}
          </Button>
        </div>
      </form>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

      <div className="overflow-x-auto rounded-2xl border bg-card/70">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Biblioteca</th>
              <th className="px-4 py-3">Criado em</th>
              <th className="px-4 py-3">Ultimo login</th>
              <th className="px-4 py-3">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 uppercase">{user.role}</td>
                <td className="px-4 py-3">{user.libraryAccess ? "Ativo" : "Bloqueado"}</td>
                <td className="px-4 py-3">{new Date(user.createdAt).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3">
                  {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString("pt-BR") : "-"}
                </td>
                <td className="px-4 py-3">
                  {user.role === "admin" ? (
                    <span className="text-xs text-muted-foreground">Administrador</span>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant={user.libraryAccess ? "outline" : "default"}
                      className="rounded-full"
                      onClick={() => void toggleLibraryAccess(user)}
                    >
                      {user.libraryAccess ? "Bloquear" : "Liberar"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-muted-foreground" colSpan={6}>
                  Nenhum usuario encontrado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
