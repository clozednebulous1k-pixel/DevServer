import { CRIAR_SCHEMA_VERSION, type CriarBlock, type CriarProjectSchema } from "@/lib/criar/schema";

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function makeBlock(type: CriarBlock["type"]): CriarBlock {
  switch (type) {
    case "hero":
      return {
        id: uid("hero"),
        type: "hero",
        props: {
          title: "Landing para converter mais",
          subtitle: "Monte sua página em blocos, publique rápido e foque no que importa.",
          ctaLabel: "Começar agora",
          ctaHref: "#",
        },
        styles: { align: "left" },
      };
    case "features":
      return {
        id: uid("features"),
        type: "features",
        props: {
          title: "Recursos principais",
          items: ["Editor visual por blocos", "Salvar em JSON portável", "Publicação simplificada"],
        },
      };
    case "cta":
      return {
        id: uid("cta"),
        type: "cta",
        props: {
          title: "Pronto para publicar?",
          description: "Finalize o conteúdo e publique sua página.",
          buttonLabel: "Publicar projeto",
          buttonHref: "#",
        },
      };
    case "faq":
      return {
        id: uid("faq"),
        type: "faq",
        props: {
          title: "Perguntas frequentes",
          items: [
            { question: "Preciso saber código?", answer: "Não para o básico. O editor cuida da estrutura." },
            { question: "Posso exportar?", answer: "Sim, você pode exportar o schema em JSON." },
          ],
        },
      };
    case "footer":
      return {
        id: uid("footer"),
        type: "footer",
        props: { text: "© DevServer - Todos os direitos reservados." },
      };
  }
}

export function makeDefaultSchema(): CriarProjectSchema {
  return {
    meta: { version: CRIAR_SCHEMA_VERSION },
    theme: {
      primary: "#5bf68b",
      background: "#09090b",
      text: "#f5f5f5",
    },
    pages: [
      {
        slug: "home",
        title: "Home",
        blocks: [makeBlock("hero"), makeBlock("features"), makeBlock("cta"), makeBlock("faq"), makeBlock("footer")],
      },
    ],
  };
}
