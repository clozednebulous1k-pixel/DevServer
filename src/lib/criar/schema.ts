export const CRIAR_SCHEMA_VERSION = 1;

export type CriarTheme = {
  primary: string;
  background: string;
  text: string;
};

export type HeroBlock = {
  id: string;
  type: "hero";
  props: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
  };
  styles?: {
    align?: "left" | "center";
  };
};

export type FeaturesBlock = {
  id: string;
  type: "features";
  props: {
    title: string;
    items: string[];
  };
};

export type CtaBlock = {
  id: string;
  type: "cta";
  props: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };
};

export type FaqBlock = {
  id: string;
  type: "faq";
  props: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
};

export type FooterBlock = {
  id: string;
  type: "footer";
  props: {
    text: string;
  };
};

export type CriarBlock = HeroBlock | FeaturesBlock | CtaBlock | FaqBlock | FooterBlock;

export type CriarPageSchema = {
  slug: string;
  title: string;
  blocks: CriarBlock[];
};

export type CriarProjectSchema = {
  meta: {
    version: number;
  };
  theme: CriarTheme;
  pages: CriarPageSchema[];
};

export type CriarProjectRecord = {
  id: string;
  name: string;
  ownerUid: string;
  status: "draft" | "published";
  schema: CriarProjectSchema;
  createdAt?: string;
  updatedAt?: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function validateCriarSchema(input: unknown): { ok: true; value: CriarProjectSchema } | { ok: false; error: string } {
  const root = asRecord(input);
  if (!root) return { ok: false, error: "Schema invalido (root)." };

  const meta = asRecord(root.meta);
  if (!meta || typeof meta.version !== "number") {
    return { ok: false, error: "Schema invalido (meta.version)." };
  }

  const theme = asRecord(root.theme);
  if (!theme || !isString(theme.primary) || !isString(theme.background) || !isString(theme.text)) {
    return { ok: false, error: "Schema invalido (theme)." };
  }

  if (!Array.isArray(root.pages) || root.pages.length === 0) {
    return { ok: false, error: "Schema invalido (pages)." };
  }

  for (const page of root.pages) {
    const pageRecord = asRecord(page);
    if (!pageRecord || !isString(pageRecord.slug) || !isString(pageRecord.title) || !Array.isArray(pageRecord.blocks)) {
      return { ok: false, error: "Schema invalido (page)." };
    }

    for (const block of pageRecord.blocks) {
      const blockRecord = asRecord(block);
      if (!blockRecord || !isString(blockRecord.id) || !isString(blockRecord.type)) {
        return { ok: false, error: "Schema invalido (block base)." };
      }

      const props = asRecord(blockRecord.props);
      if (!props) return { ok: false, error: "Schema invalido (block props)." };

      switch (blockRecord.type) {
        case "hero":
          if (!isString(props.title) || !isString(props.subtitle) || !isString(props.ctaLabel) || !isString(props.ctaHref)) {
            return { ok: false, error: "Schema invalido (hero)." };
          }
          break;
        case "features":
          if (!isString(props.title) || !Array.isArray(props.items) || props.items.some((item) => !isString(item))) {
            return { ok: false, error: "Schema invalido (features)." };
          }
          break;
        case "cta":
          if (!isString(props.title) || !isString(props.description) || !isString(props.buttonLabel) || !isString(props.buttonHref)) {
            return { ok: false, error: "Schema invalido (cta)." };
          }
          break;
        case "faq":
          if (!isString(props.title) || !Array.isArray(props.items)) {
            return { ok: false, error: "Schema invalido (faq)." };
          }
          for (const item of props.items) {
            const faqItem = asRecord(item);
            if (!faqItem || !isString(faqItem.question) || !isString(faqItem.answer)) {
              return { ok: false, error: "Schema invalido (faq item)." };
            }
          }
          break;
        case "footer":
          if (!isString(props.text)) return { ok: false, error: "Schema invalido (footer)." };
          break;
        default:
          return { ok: false, error: `Tipo de bloco nao suportado: ${blockRecord.type}` };
      }
    }
  }

  return { ok: true, value: root as CriarProjectSchema };
}
