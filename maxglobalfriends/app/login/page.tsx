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
    <main className="flex min-h-screen items-center justify-center bg-mgf-blue2 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs rounded border border-white/15 bg-mgf-blue p-8 text-center"
      >
        <h1 className="font-serif text-xl font-semibold tracking-wide text-white">
          Maxglobalfriends
        </h1>
        <p className="mt-1 text-xs tracking-widest text-white/60">
          PRIVATE ACCESS
        </p>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="mt-6 w-full rounded border border-white/20 bg-white/5 px-4 py-3 text-center text-lg tracking-[0.4em] text-white outline-none focus:border-white/50"
        />
        {error && (
          <p className="mt-3 text-xs text-red-200">비밀번호가 올바르지 않습니다.</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded bg-white py-3 text-sm font-medium tracking-widest text-mgf-blue2 transition hover:bg-white/90 disabled:opacity-50"
        >
          {loading ? "확인 중..." : "입장"}
        </button>
      </form>
    </main>
  );
}
