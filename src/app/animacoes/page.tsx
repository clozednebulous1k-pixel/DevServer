import { SiteNav } from "@/components/site-nav";
import { PageTransitionLab } from "@/components/animacoes/page-transition-lab";

export default function AnimacoesPage() {
  return (
    <div className="relative min-h-screen">
      <SiteNav />
      <main className="relative z-10 pb-12">
        <PageTransitionLab />
      </main>
    </div>
  );
}

