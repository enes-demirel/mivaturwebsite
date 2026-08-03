"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  loginAction,
  type LoginActionState,
} from "@/app/admin/giris/actions";

export function LoginForm({ initialMessage }: { initialMessage: string | null }) {
  const initialState: LoginActionState = { message: initialMessage };
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-7 space-y-5">
      <div>
        <label htmlFor="admin-email" className="mb-2 block text-sm font-bold text-text">
          E-posta
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="min-h-12 w-full rounded-md border border-border bg-background px-4 text-sm text-text outline-none placeholder:text-muted/70 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/15"
          placeholder="ornek@mivatur.com"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-bold text-text">
          Şifre
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="min-h-12 w-full rounded-md border border-border bg-background px-4 text-sm text-text outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/15"
        />
      </div>

      <div className="min-h-6 text-sm leading-6 text-brand" aria-live="polite">
        {state.message && <p>{state.message}</p>}
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-brand bg-brand px-5 text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-wait disabled:opacity-65"
    >
      {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
    </button>
  );
}
