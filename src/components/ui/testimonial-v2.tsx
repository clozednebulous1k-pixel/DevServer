"use client";

import React from "react";
import { motion } from "framer-motion";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    text: "Fechamos o site em poucos dias e já começou a gerar contato.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Ana Paula",
    role: "Empreendedora",
  },
  {
    text: "Atendimento rápido e proposta clara. Recomendo demais.",
    image: "https://api.dicebear.com/9.x/adventurer/png?seed=LucasSouza&size=150",
    name: "Lucas Souza",
    role: "Dono de e-commerce",
  },
  {
    text: "Meu projeto ficou profissional e com visual de alto nível.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Carla Menezes",
    role: "Consultora",
  },
  {
    text: "Consegui lançar minha página e validar oferta no mesmo mês.",
    image: "https://api.dicebear.com/9.x/adventurer/png?seed=RafaelOliveira&size=150",
    name: "Rafael Oliveira",
    role: "Infoprodutor",
  },
  {
    text: "Design bonito, site rápido e comunicação excelente.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Fernanda Lima",
    role: "Gestora comercial",
  },
  {
    text: "A entrega veio exatamente como combinamos, sem dor de cabeça.",
    image: "https://api.dicebear.com/9.x/adventurer/png?seed=MarianaRocha&size=150",
    name: "Mariana Rocha",
    role: "Arquiteta",
  },
  {
    text: "Agora meu negócio passa muito mais confiança online.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Gustavo Nunes",
    role: "Prestador de serviços",
  },
  {
    text: "Ficou simples para o cliente entender e chamar no WhatsApp.",
    image: "https://api.dicebear.com/9.x/adventurer/png?seed=JulianaMartins&size=150",
    name: "Juliana Martins",
    role: "Clínica estética",
  },
  {
    text: "Processo direto: briefing, execução e resultado.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Diego Ferreira",
    role: "Agência local",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="m-0 flex list-none flex-col gap-6 bg-transparent p-0 pb-6 transition-colors duration-300"
      >
        {new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <motion.li
                key={`${index}-${i}`}
                aria-hidden={index === 1 ? "true" : "false"}
                tabIndex={index === 1 ? -1 : 0}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                  transition: { type: "spring", stiffness: 400, damping: 17 },
                }}
                whileFocus={{
                  scale: 1.03,
                  y: -8,
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                  transition: { type: "spring", stiffness: 400, damping: 17 },
                }}
                className="group w-full max-w-xs cursor-default select-none rounded-3xl border border-neutral-200 bg-white p-10 shadow-lg shadow-black/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <blockquote className="m-0 p-0">
                  <p className="m-0 leading-relaxed font-normal text-neutral-600 transition-colors duration-300 dark:text-neutral-400">
                    {text}
                  </p>
                  <footer className="mt-6 flex items-center gap-3">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={`Avatar of ${name}`}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-neutral-100 transition-all duration-300 ease-in-out group-hover:ring-primary/30 dark:ring-neutral-800"
                    />
                    <div className="flex flex-col">
                      <cite className="not-italic leading-5 font-semibold tracking-tight text-neutral-900 transition-colors duration-300 dark:text-white">
                        {name}
                      </cite>
                      <span className="mt-0.5 text-sm leading-5 tracking-tight text-neutral-500 transition-colors duration-300 dark:text-neutral-500">
                        {role}
                      </span>
                    </div>
                  </footer>
                </blockquote>
              </motion.li>
            ))}
          </React.Fragment>
        ))}
      </motion.ul>
    </div>
  );
};

export default function TestimonialsSection() {
  return (
    <section aria-labelledby="testimonials-heading" className="relative overflow-hidden bg-transparent py-14">
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 0.8 },
        }}
        className="container mx-auto z-10 px-4"
      >
        <div className="mx-auto mb-10 flex max-w-[540px] flex-col items-center justify-center">
          <div className="flex justify-center">
            <div className="rounded-full border border-neutral-300 bg-neutral-100/50 px-4 py-1 text-xs leading-5 font-semibold tracking-wide text-neutral-600 uppercase transition-colors dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400">
              Depoimentos
            </div>
          </div>

          <h2 id="testimonials-heading" className="mt-6 text-center text-4xl font-extrabold tracking-tight text-neutral-900 transition-colors md:text-5xl dark:text-white">
            O que nossos clientes dizem
          </h2>
          <p className="mt-5 max-w-sm text-center text-lg leading-relaxed text-neutral-500 transition-colors dark:text-neutral-400">
            Descubra como empresas estão acelerando resultados com a plataforma da DevServer.
          </p>
        </div>

        <div
          className="mt-6 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
          role="region"
          aria-label="Depoimentos em rolagem"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </motion.div>
    </section>
  );
}
