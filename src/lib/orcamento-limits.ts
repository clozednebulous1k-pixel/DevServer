/** Limites alinhados ao RLS em `supabase/schema.sql` (policy orcamentos_insert_public). */
export const ORCAMENTO_FIELD_MAX = {
  full_name: 200,
  email: 254,
  whatsapp: 40,
  company: 200,
  project_type: 120,
  budget_range: 80,
  desired_deadline: 80,
  start_date: 40,
  project_goal: 4000,
  desired_features: 8000,
  references_url: 2000,
  additional_notes: 4000,
} as const;

export type OrcamentoFieldKey = keyof typeof ORCAMENTO_FIELD_MAX;

export function clampOrcamentoField(key: OrcamentoFieldKey, value: string): string {
  const max = ORCAMENTO_FIELD_MAX[key];
  return String(value ?? "")
    .trim()
    .slice(0, max);
}
