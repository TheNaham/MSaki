"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.replace(params.get("next") || "/");
      router.refresh();
    } else {
      setError(true);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-se-charcoal px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs rounded border border-se-line bg-se-panel p-8 text-center"
      >
        <h1 className="font-serif text-xl font-semibold tracking-wide text-se-ink">
          Saki Global Engine
        </h1>
        <p className="mt-1 text-xs tracking-widest text-se-muted">
          PRIVATE ACCESS
        </p>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="mt-6 w-full rounded border border-se-line bg-black/20 px-4 py-3 text-center text-lg tracking-[0.4em] text-se-ink outline-none focus:border-se-gold"
        />
        {error && (
          <p className="mt-3 text-xs text-se-risky">
            비밀번호가 올바르지 않습니다.
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded bg-se-gold py-3 text-sm font-medium tracking-widest text-se-charcoal transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "확인 중..." : "입장"}
        </button>
      </form>
    </main>
  );
}
