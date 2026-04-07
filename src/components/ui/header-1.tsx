'use client';

import Image from 'next/image';
import React from 'react';
import { createPortal } from 'react-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { cn } from '@/lib/utils';

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  const links = [
    { label: 'Serviços', href: '#' },
    { label: 'Cases', href: '#' },
    { label: 'Contato', href: '#' },
  ];

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn('sticky top-0 z-50 w-full border-b border-transparent', {
        'bg-background/95 supports-[backdrop-filter]:bg-background/70 border-border backdrop-blur-lg': scrolled,
      })}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3 rounded-md p-1">
          <Image
            src="/devserver-logo.png"
            alt="DevServer"
            width={40}
            height={40}
            priority
            className="h-10 w-10 object-contain dark:invert dark:brightness-200"
          />
          <span className="text-lg font-semibold tracking-tight">DevServer</span>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <a key={link.label} className={buttonVariants({ variant: 'ghost' })} href={link.href}>
              {link.label}
            </a>
          ))}
          <Button variant="outline">Entrar</Button>
          <Button>Quero meu projeto</Button>
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Abrir menu"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>
      <MobileMenu open={open} className="flex flex-col justify-between gap-2">
        <div className="grid gap-y-2">
          {links.map((link) => (
            <a
              key={link.label}
              className={buttonVariants({
                variant: 'ghost',
                className: 'justify-start',
              })}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full bg-transparent">
            Entrar
          </Button>
          <Button className="w-full">Quero meu projeto</Button>
        </div>
      </MobileMenu>
    </header>
  );
}

type MobileMenuProps = React.ComponentProps<'div'> & {
  open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === 'undefined') return null;

  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        'bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg',
        'fixed top-16 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden',
      )}
    >
      <div
        data-slot={open ? 'open' : 'closed'}
        className={cn('data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out size-full p-4', className)}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
