import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { devices } from './devices';
import { mechanismFamilies } from './families';
import { intro } from './intro';
import { loadLegacyData } from './legacy';
import { MECHANISM_ICON, patternNames, patterns } from './patterns';
import { cutaneousSensations, isCutaneous, kinestheticSensations } from './sensations';

const legacy = loadLegacyData();
const legacyDevices = legacy.devices.filter((device) => !device.isIntro);

describe('extraction from the original index.html', () => {
  it('keeps every record', () => {
    expect(legacyDevices).toHaveLength(92);
    expect(devices).toHaveLength(legacyDevices.length);
    expect(patterns).toHaveLength(legacy.canonicalPatterns.length);
    expect(mechanismFamilies).toHaveLength(legacy.mechanismFamilies.length);
    expect(Object.keys(legacy.hapticAuditData)).toHaveLength(devices.length);
    expect(Object.keys(legacy.deviceMechanismPatterns)).toHaveLength(devices.length);
  });

  it('keeps every device field, in the original order', () => {
    legacyDevices.forEach((original, index) => {
      const { audit, mechanism, ...fields } = devices[index];
      const { mechanism: _legacyMechanism, ...originalFields } = original;
      expect(fields).toEqual(originalFields);
      expect(mechanism.length).toBeGreaterThanOrEqual(70);
      expect(mechanism.length).toBeLessThanOrEqual(120);
      expect(audit).toEqual(legacy.hapticAuditData[original.name]);
    });
  });

  it('keeps each device in its mechanism pattern', () => {
    for (const device of devices) expect(device.category).toBe(legacy.deviceMechanismPatterns[device.name]);
  });

  it('keeps patterns, icons and families', () => {
    expect(patternNames).toEqual(legacy.canonicalPatterns);
    for (const pattern of patterns) expect(pattern.icon).toBe(legacy.patternIcons[pattern.name]);
    expect(mechanismFamilies).toEqual(legacy.mechanismFamilies);
  });

  it('keeps the modality split of every coded sensation', () => {
    for (const device of devices) {
      for (const sensation of [...device.submodalities, ...device.audit.sensations]) {
        expect(isCutaneous(sensation)).toBe(legacy.cutaneousSubmodalities.includes(sensation));
        expect(legacy.kinestheticSubmodalities.includes(sensation)).toBe(!isCutaneous(sensation));
      }
    }
    expect(cutaneousSensations.length + kinestheticSensations.length).toBe(10);
  });

  it('shows the same mechanism icon the original lookup produced', () => {
    for (const device of devices) {
      const mapped = legacy.categoryMap[device.category] ?? device.category;
      expect(legacy.categoryIconSymbols[mapped] ?? legacy.categoryIconSymbols.Unknown).toBe(MECHANISM_ICON);
    }
  });

  it('keeps the intro heading', () => {
    const original = legacy.devices.find((device) => device.isIntro);
    expect(original).toMatchObject(intro);
  });

  it('spot-checks known records', () => {
    expect(devices[0]).toMatchObject({
      name: 'LeverForce',
      category: 'Solid mass shifting',
      doi: '10.1145/3861188.3861231',
      year: '2026',
    });
    expect(devices[0].media[0].src).toBe('img/leverforce.png');
    expect(devices.find((device) => device.name === 'Drag:on')?.audit).toMatchObject({
      score: 3,
      sensations: ['Resistance', 'Weight magnitude', 'Shape'],
    });
  });
});

describe('data integrity', () => {
  it('has unique device names', () => {
    expect(new Set(devices.map((device) => device.name)).size).toBe(devices.length);
  });

  it('puts every pattern in exactly one family', () => {
    const grouped = mechanismFamilies.flatMap((family) => family.patterns);
    expect([...grouped].sort()).toEqual([...patternNames].sort());
  });

  it('follows the folder README media rules: local img/ files that exist, or YouTube videos', () => {
    for (const device of devices) {
      expect(device.media.length).toBeGreaterThan(0);
      for (const media of device.media) {
        if (media.type === 'video')
          expect(media.src).toMatch(/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//);
        else expect(existsSync(new URL(`../../${media.src}`, import.meta.url)), media.src).toBe(true);
      }
    }
  });

  it('keeps ticks_str in step with the audit score', () => {
    for (const device of devices) expect(device.audit.ticks_str).toBe(String(device.audit.score));
  });
});
