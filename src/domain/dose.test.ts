import { describe, expect, it } from 'vitest';
import {
  calculateDose,
  parseDecimalInput,
  validateDoseInput,
  type DoseInput
} from './dose';

describe('parseDecimalInput', () => {
  it('accepts comma decimals used in pt-BR', () => {
    expect(parseDecimalInput('2,5')).toBe(2.5);
    expect(parseDecimalInput('0,083')).toBe(0.083);
  });

  it('rejects empty, negative and mixed text values', () => {
    expect(parseDecimalInput('')).toBeNull();
    expect(parseDecimalInput('-2')).toBeNull();
    expect(parseDecimalInput('2 mg')).toBeNull();
  });
});

describe('calculateDose', () => {
  it('calculates 2.5 mg from a 15 mg / 0.5 mL vial', () => {
    const input: DoseInput = {
      desiredDoseMg: 2.5,
      vialStrengthMg: 15,
      solutionVolumeMl: 0.5,
      syringeId: 'u100-100'
    };

    const result = calculateDose(input);

    expect(result.concentrationMgPerMl).toBeCloseTo(30);
    expect(result.volumeMl).toBeCloseTo(0.083333, 5);
    expect(result.unitsUi).toBeCloseTo(8.3333, 4);
    expect(result.overCapacity).toBe(false);
  });

  it('uses the selected syringe capacity for visual ratio', () => {
    const input: DoseInput = {
      desiredDoseMg: 15,
      vialStrengthMg: 15,
      solutionVolumeMl: 0.5,
      syringeId: 'u100-50'
    };

    const result = calculateDose(input);

    expect(result.volumeMl).toBeCloseTo(0.5);
    expect(result.unitsUi).toBeCloseTo(50);
    expect(result.fillRatio).toBe(1);
    expect(result.overCapacity).toBe(false);
  });
});

describe('validateDoseInput', () => {
  it('rejects zero values', () => {
    const validation = validateDoseInput({
      desiredDoseMg: '0',
      vialStrengthMg: '15',
      solutionVolumeMl: '0,5',
      syringeId: 'u100-100'
    });

    expect(validation.result).toBeNull();
    expect(validation.fieldErrors.desiredDoseMg).toBe('Use um valor maior que zero.');
  });

  it('warns when desired dose is greater than vial strength', () => {
    const validation = validateDoseInput({
      desiredDoseMg: '20',
      vialStrengthMg: '15',
      solutionVolumeMl: '0,5',
      syringeId: 'u100-100'
    });

    expect(validation.warnings).toContain('A dose desejada e maior que a dose informada no rotulo.');
  });

  it('flags syringe capacity overflow', () => {
    const validation = validateDoseInput({
      desiredDoseMg: '20',
      vialStrengthMg: '15',
      solutionVolumeMl: '1',
      syringeId: 'u100-100'
    });

    expect(validation.result?.overCapacity).toBe(true);
    expect(validation.fieldErrors.syringeId).toBe('O volume calculado ultrapassa a seringa selecionada.');
  });
});
