import { type CriarBlock, type CriarPageSchema, type CriarProjectSchema } from "@/lib/criar/schema";

function Hero({ block }: { block: Extract<CriarBlock, { type: "hero" }> }) {
  return (
    <section className="rounded-2xl border bg-card/70 p-6">
      <h1 className="text-3xl font-semibold">{block.props.title}</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{block.props.subtitle}</p>
      <a
        href={block.props.ctaHref || "#"}
        className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        {block.props.ctaLabel}
      </a>
    </section>
  );
}

function Features({ block }: { block: Extract<CriarBlock, { type: "features" }> }) {
  return (
    <section className="rounded-2xl border bg-card/70 p-6">
      <h2 className="text-xl font-semibold">{block.props.title}</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {block.props.items.map((item, index) => (
          <li key={`${block.id}-${index}`} className="rounded-xl border bg-background/50 px-3 py-2 text-sm">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Cta({ block }: { block: Extract<CriarBlock, { type: "cta" }> }) {
  return (
    <section className="rounded-2xl border bg-card/70 p-6 text-center">
      <h2 className="text-xl font-semibold">{block.props.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{block.props.description}</p>
      <a
        href={block.props.buttonHref || "#"}
        className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        {block.props.buttonLabel}
      </a>
    </section>
  );
}

function Faq({ block }: { block: Extract<CriarBlock, { type: "faq" }> }) {
  return (
    <section className="rounded-2xl border bg-card/70 p-6">
      <h2 className="text-xl font-semibold">{block.props.title}</h2>
      <div className="mt-4 space-y-3">
        {block.props.items.map((item, index) => (
          <article key={`${block.id}-${index}`} className="rounded-xl border bg-background/50 p-3">
            <h3 className="text-sm font-semibold">{item.question}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Footer({ block }: { block: Extract<CriarBlock, { type: "footer" }> }) {
  return (
    <footer className="rounded-2xl border bg-card/70 p-4 text-center text-sm text-muted-foreground">{block.props.text}</footer>
  );
}

export function renderCriarBlock(block: CriarBlock) {
  switch (block.type) {
    case "hero":
      return <Hero block={block} />;
    case "features":
      return <Features block={block} />;
    case "cta":
      return <Cta block={block} />;
    case "faq":
      return <Faq block={block} />;
    case "footer":
      return <Footer block={block} />;
  }
}

export function getHomePage(schema: CriarProjectSchema): CriarPageSchema {
  return schema.pages[0]!;
}
