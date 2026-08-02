import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="mb-3 text-sm font-bold tracking-[0.2em] text-brand">404</p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Aradığınız sayfa bulunamadı
      </h1>
      <p className="mt-4 max-w-lg text-muted">
        Sayfa taşınmış, kaldırılmış veya adresi hatalı yazılmış olabilir.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Ana sayfaya dön</Link>
      </Button>
    </Container>
  );
}
