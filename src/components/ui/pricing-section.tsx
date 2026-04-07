"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GlowCard } from "@/components/ui/spotlight-card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import NumberFlow from "@number-flow/react";
import { Briefcase, CheckCheck, Database, Server } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Starter",
    description: "Ideal para quem está começando e precisa estruturar seu primeiro sistema.",
    price: 12,
    yearlyPrice: 99,
    buttonText: "Quero Participar",
    buttonVariant: "outline" as const,
    features: [
      { text: "Até 10 projetos no workspace", icon: <Briefcase size={20} /> },
      { text: "Até 10GB de armazenamento", icon: <Database size={20} /> },
      { text: "Relatórios básicos", icon: <Server size={20} /> },
    ],
    includes: [
      "Inclui:",
      "Cards ilimitados",
      "Backgrounds e stickers",
      "Autenticação em 2 fatores",
    ],
  },
  {
    name: "Business",
    description: "Melhor custo-benefício para times em crescimento.",
    price: 48,
    yearlyPrice: 399,
    buttonText: "Quero Participar",
    buttonVariant: "default" as const,
    popular: true,
    features: [
      { text: "Projetos ilimitados", icon: <Briefcase size={20} /> },
      { text: "Storage avançado (250MB/arquivo)", icon: <Database size={20} /> },
      { text: "100 automações por workspace", icon: <Server size={20} /> },
    ],
    includes: [
      "Tudo do Starter, mais:",
      "Checklists avançadas",
      "Campos customizados",
      "Funções serverless",
    ],
  },
  {
    name: "Enterprise",
    description: "Plano completo para empresas que precisam de escala e segurança.",
    price: 96,
    yearlyPrice: 899,
    buttonText: "Quero Participar",
    buttonVariant: "outline" as const,
    features: [
      { text: "Projetos ilimitados", icon: <Briefcase size={20} /> },
      { text: "Armazenamento ilimitado", icon: <Database size={20} /> },
      { text: "Workspaces ilimitados", icon: <Server size={20} /> },
    ],
    includes: [
      "Tudo do Business, mais:",
      "Gestão multi-projeto",
      "Convidados avançados",
      "Permissões granulares",
    ],
  },
].slice(0, 2);

export default function PricingSection() {
  const pricingRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <div id="planos" className="relative mx-auto min-h-screen bg-transparent px-4 pt-20" ref={pricingRef}>
      <div className="relative z-10 mx-auto mb-6 max-w-3xl text-center">
        <TimelineContent
          as="h2"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="mb-4 text-3xl font-medium text-gray-900 sm:text-4xl md:text-6xl dark:text-white"
        >
          Planos que funcionam para o seu{" "}
          <TimelineContent
            as="span"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="inline-block rounded-xl border border-dashed border-blue-500 bg-blue-100 px-2 py-1 capitalize dark:bg-blue-950/40"
          >
            negócio
          </TimelineContent>
        </TimelineContent>

        <TimelineContent
          as="p"
          animationNum={2}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="mx-auto w-[80%] text-sm text-gray-600 sm:w-[70%] sm:text-base dark:text-neutral-300"
        >
          Escolha a opção ideal para seu momento e escale com confiança.
        </TimelineContent>
      </div>

      <div className="relative z-10 mx-auto grid max-w-5xl gap-4 py-6 md:grid-cols-2">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={4 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <GlowCard
              glowColor={plan.popular ? "blue" : index === 0 ? "green" : "purple"}
              customSize
              className={`h-full w-full rounded-2xl border-0 bg-card/60 p-0 backdrop-blur ${
                plan.popular ? "ring-1 ring-blue-500/40" : ""
              }`}
            >
              <Card className="relative rounded-2xl border-0 bg-transparent shadow-none">
                <CardHeader className="text-left">
                  <div className="flex justify-between">
                    <h3 className="mb-2 text-3xl font-semibold">{plan.name}</h3>
                    {plan.popular && (
                      <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-semibold">
                      $
                      <NumberFlow value={plan.price} className="text-4xl font-semibold" />
                    </span>
                    <span className="ml-1 text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <button
                    onClick={() =>
                      router.push(
                        `/pagamento?plano=${encodeURIComponent(plan.name)}&valor=${encodeURIComponent(String(plan.price))}`,
                      )
                    }
                    className={`mb-6 w-full rounded-xl p-4 text-xl ${
                      plan.popular
                        ? "border border-blue-400 bg-gradient-to-t from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500"
                        : plan.buttonVariant === "outline"
                          ? "border border-neutral-700 bg-gradient-to-t from-neutral-900 to-neutral-600 text-white shadow-lg shadow-neutral-900"
                          : ""
                    }`}
                  >
                    {plan.buttonText}
                  </button>

                  <ul className="space-y-2 py-5 font-semibold">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="mr-3 mt-0.5 grid place-content-center text-foreground">
                          {feature.icon}
                        </span>
                        <span className="text-sm text-muted-foreground">{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3 border-t border-border pt-4">
                    <h4 className="mb-3 text-base font-medium">{plan.includes[0]}</h4>
                    <ul className="space-y-2 font-semibold">
                      {plan.includes.slice(1).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <span className="mr-3 mt-0.5 grid h-6 w-6 place-content-center rounded-full border border-blue-500 bg-green-50 dark:bg-neutral-800">
                            <CheckCheck className="h-4 w-4 text-blue-500" />
                          </span>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </GlowCard>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}
