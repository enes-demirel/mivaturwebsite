import { redirect } from "next/navigation";

import { LoginForm } from "@/app/admin/giris/login-form";
import { Logo } from "@/components/layout/logo";
import { getAdmin } from "@/lib/auth/session";

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  if (await getAdmin()) redirect("/admin");

  const query = await searchParams;
  const unauthorized =
    query.error === "yetkisiz" ||
    (Array.isArray(query.error) && query.error.includes("yetkisiz"));
  const initialMessage = unauthorized ? "Bu hesabın yönetim paneli yetkisi bulunmuyor." : null;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5 py-10">
      <section aria-labelledby="admin-login-title" className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-card sm:p-8">
        <Logo priority className="mx-auto" />
        <div className="mt-7 text-center">
          <p className="text-xs font-extrabold tracking-[0.16em] text-brand uppercase">
            Yönetim Paneli
          </p>
          <h1 id="admin-login-title" className="mt-3 text-3xl font-extrabold tracking-tight text-text">
            Admin girişi
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Yönetim paneline erişmek için yetkili hesabınızla giriş yapın.
          </p>
        </div>
        <LoginForm initialMessage={initialMessage} />
      </section>
    </main>
  );
}
