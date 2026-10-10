import { z } from 'zod';

export type SyringeId = 'u100-100' | 'u100-50';

export interface SyringeOption {
  id: SyringeId;
  label: string;
  shortLabel: string;
  capacityMl: number;
  capacityUi: number;
}

export interface DoseInput {
  desiredDoseMg: number;
  vialStrengthMg: number;
  solutionVolumeMl: number;
  syringeId: SyringeId;
}

export interface DoseResult {
  concentrationMgPerMl: number;
  volumeMl: number;
  unitsUi: number;
  syringe: SyringeOption;
  fillRatio: number;
  overCapacity: boolean;
}

export interface RawDoseInput {
  desiredDoseMg: string;
  vialStrengthMg: string;
  solutionVolumeMl: string;
  syringeId: SyringeId;
}

export interface ValidationResult {
  values: DoseInput | null;
  result: DoseResult | null;
  fieldErrors: Partial<Record<keyof RawDoseInput, string>>;
  warnings: string[];
}

export const DOSE_PRESETS_MG = [2.5, 5, 7.5, 10, 12.5, 15] as const;

export const VIAL_STRENGTH_PRESETS_MG = [2.5, 5, 7.5, 10, 12.5, 15] as const;

export const SYRINGES: SyringeOption[] = [
  {
    id: 'u100-100',
    label: '1 mL / 100 UI',
    shortLabel: '1 mL (100 UI)',
    capacityMl: 1,
    capacityUi: 100
  },
  {
    id: 'u100-50',
    label: '0,5 mL / 50 UI',
    shortLabel: '0,5 mL (50 UI)',
    capacityMl: 0.5,
    capacityUi: 50
  }
];

// Esquema Zod para validação numérica flexível (aceita , ou .)
const numericString = (emptyMessage: string) => z
  .string()
  .trim()
  .min(1, emptyMessage)
  .transform((val) => val.replace(',', '.'))
  .refine((val) => !isNaN(Number(val)), { message: 'Use apenas números.' })
  .transform((val) => Number(val))
  .refine((val) => val > 0, { message: 'Use um valor maior que zero.' });

const DoseSchema = z.object({
  desiredDoseMg: numericString('Informe a dose desejada.'),
  vialStrengthMg: numericString('Informe a dose no rótulo.'),
  solutionVolumeMl: numericString('Informe o volume da solução.'),
  syringeId: z.enum(['u100-100', 'u100-50'])
});

export function parseDecimalInput(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getSyringe(syringeId: SyringeId): SyringeOption {
  return SYRINGES.find((syringe) => syringe.id === syringeId) ?? SYRINGES[0];
}

export function calculateDose(input: DoseInput): DoseResult {
  const syringe = getSyringe(input.syringeId);
  const concentrationMgPerMl = input.vialStrengthMg / input.solutionVolumeMl;
  const volumeMl = input.desiredDoseMg / concentrationMgPerMl;
  const unitsUi = volumeMl * 100;
  const fillRatio = Math.min(Math.max(volumeMl / syringe.capacityMl, 0), 1);

  return {
    concentrationMgPerMl,
    volumeMl,
    unitsUi,
    syringe,
    fillRatio,
    overCapacity: volumeMl > syringe.capacityMl
  };
}

export function validateDoseInput(input: RawDoseInput): ValidationResult {
  const result = DoseSchema.safeParse(input);

  if (!result.success) {
    const fieldErrors: Partial<Record<keyof RawDoseInput, string>> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path[0] as keyof RawDoseInput;
      if (!fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    });
    return { values: null, result: null, fieldErrors, warnings: [] };
  }

  const values = result.data;
  const doseResult = calculateDose(values);
  const warnings: string[] = [];
  const fieldErrors: Partial<Record<keyof RawDoseInput, string>> = {};

  if (values.desiredDoseMg > values.vialStrengthMg) {
    warnings.push('A dose desejada é maior que a dose informada no rótulo.');
  }

  if (doseResult.overCapacity) {
    fieldErrors.syringeId = 'O volume calculado ultrapassa a seringa selecionada.';
  }

  return {
    values,
    result: doseResult,
    fieldErrors,
    warnings
  };
}

export function formatPtNumber(value: number, maximumFractionDigits = 3): string {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits,
    minimumFractionDigits: 0
  }).format(value);
}

export function toInputValue(value: number): string {
  return String(value).replace('.', ',');
}
