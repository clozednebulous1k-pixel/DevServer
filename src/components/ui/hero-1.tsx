import Image from 'next/image';
import { ArrowRightIcon, PhoneCallIcon, RocketIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoCloud } from '@/components/ui/logo-cloud-3';
import { cn } from '@/lib/utils';

export function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-20 md:pt-28">
      <div className="relative flex flex-col items-center justify-center gap-6 py-20">
        <a
          className={cn(
            'group mx-auto flex w-fit items-center gap-3 rounded-full border bg-card px-3 py-1 shadow-sm',
            'transition-all duration-300 ease-out hover:-translate-y-0.5',
          )}
          href="#"
        >
          <RocketIcon className="size-3 text-muted-foreground" />
          <span className="text-xs">Novo portfólio para times de tecnologia</span>
          <span className="block h-5 border-l" />
          <ArrowRightIcon className="size-3 duration-150 ease-out group-hover:translate-x-1" />
        </a>

        <div className="mb-2">
          <Image
            src="/devserver-logo.png"
            alt="Logo DevServer"
            width={120}
            height={120}
            className="h-24 w-24 object-contain dark:invert dark:brightness-200 md:h-28 md:w-28"
          />
        </div>

        <h1 className={cn('text-balance text-center text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl')}>
          DevServer: desenvolvimento de alto nível
          <br />
          para empresas que querem escalar
        </h1>

        <p className="mx-auto max-w-2xl text-center text-base text-foreground/80 tracking-wide sm:text-lg md:text-xl">
          Conectamos design, performance e engenharia para criar produtos digitais
          <br />
          com velocidade, qualidade e foco em resultado.
        </p>

        <div className="flex flex-row flex-wrap items-center justify-center gap-3 pt-2">
          <Button className="rounded-full" size="lg" variant="secondary">
            <PhoneCallIcon data-icon="inline-start" className="mr-2 size-4" />
            Agendar call
          </Button>
          <Button className="rounded-full" size="lg">
            Ver projetos
            <ArrowRightIcon className="ms-2 size-4" data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export function LogosSection() {
  return (
    <section className="relative space-y-4 border-t pt-6 pb-10">
      <h2 className="text-center text-lg font-medium tracking-tight text-muted-foreground md:text-xl">
        Stack usada por <span className="text-foreground">times de elite</span>
      </h2>
      <div className="relative z-10 mx-auto max-w-5xl">
        <LogoCloud logos={logos} />
      </div>
    </section>
  );
}

const logos = [
  { src: 'https://cdn.simpleicons.org/react', alt: 'React Logo' },
  { src: 'https://cdn.simpleicons.org/nextdotjs', alt: 'Next.js Logo' },
  { src: 'https://cdn.simpleicons.org/typescript', alt: 'TypeScript Logo' },
  { src: 'https://cdn.simpleicons.org/tailwindcss', alt: 'Tailwind Logo' },
  { src: 'https://cdn.simpleicons.org/nodedotjs', alt: 'Node.js Logo' },
  { src: 'https://cdn.simpleicons.org/postgresql', alt: 'PostgreSQL Logo' },
  { src: 'https://cdn.simpleicons.org/docker', alt: 'Docker Logo' },
  { src: 'https://cdn.simpleicons.org/vercel', alt: 'Vercel Logo' },
];
