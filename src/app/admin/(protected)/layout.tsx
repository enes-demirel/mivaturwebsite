import { AdminMobileMenu } from "@/components/admin/admin-mobile-menu";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/auth/session";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const claims = await requireAdmin();
  const email = claims.email;

  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <AdminSidebar email={email} />
      <div className="min-w-0">
        <AdminMobileMenu email={email} />
        <main id="main-content" className="min-w-0 px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
