import { describe, expect, it } from 'vitest';
import { artifactColumns, domains, flowSteps, guideCards, principles, topics } from './content';

const cards = [...principles, ...domains, ...guideCards];

function expectFilled(value: string, label: string): void {
  expect(value.trim().length, `${label} is empty`).toBeGreaterThan(0);
}

describe('Project_Management content', () => {
  it('has the 12 principles and 8 performance domains of PMBOK 7', () => {
    expect(principles).toHaveLength(12);
    expect(domains).toHaveLength(8);
  });

  it('uses the PMBOK 7 names for every principle and domain', () => {
    expect(principles.map((p) => p.label)).toEqual([
      'Stewardship',
      'Team',
      'Stakeholders',
      'Value',
      'Systems Thinking',
      'Leadership',
      'Tailoring',
      'Quality',
      'Complexity',
      'Risk',
      'Adaptability & Resiliency',
      'Change',
    ]);
    expect(domains.map((d) => d.label)).toEqual([
      'Stakeholders',
      'Team',
      'Development Approach and Life Cycle',
      'Planning',
      'Project Work',
      'Delivery',
      'Measurement',
      'Uncertainty',
    ]);
  });

  it('gives every card a unique id', () => {
    const ids = cards.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has no empty field in any topic', () => {
    for (const [id, topic] of Object.entries(topics)) {
      expectFilled(topic.title, `${id}.title`);
      expectFilled(topic.sub, `${id}.sub`);
      expectFilled(topic.lead, `${id}.lead`);
      expect(topic.items.length, id).toBeGreaterThan(0);
      topic.items.forEach((item, i) => expectFilled(item, `${id}.items[${i}]`));
    }
  });

  it('has no empty field in any card, artifact or flow step', () => {
    for (const p of principles) {
      expectFilled(p.label, p.id);
      expectFilled(p.translation, p.id);
    }
    for (const d of domains) {
      expectFilled(d.label, d.id);
      expectFilled(d.summary, d.id);
    }
    for (const g of guideCards) {
      expectFilled(g.title, g.id);
      expectFilled(g.description, g.id);
    }
    for (const column of artifactColumns) {
      expectFilled(column.title, 'artifact column');
      expect(column.items.length).toBeGreaterThan(0);
      column.items.forEach((item) => {
        expectFilled(item.icon, item.label);
        expectFilled(item.label, column.title);
      });
    }
    expect(flowSteps.length).toBeGreaterThanOrEqual(3);
    for (const step of flowSteps) {
      expectFilled(step.id, 'flow step id');
      expectFilled(step.title, step.id);
      expectFilled(step.text, step.id);
    }
  });

  it('never repeats a flow step id or an artifact label', () => {
    const stepIds = flowSteps.map((step) => step.id);
    expect(new Set(stepIds).size).toBe(stepIds.length);
    const labels = artifactColumns.flatMap((column) => column.items.map((item) => item.label));
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('describes the PMBOK 7 development approaches: predictive, adaptive and hybrid', () => {
    const text = topics.DomainLifecycle.items.join(' ');
    expect(text).toMatch(/Predictivo/);
    expect(text).toMatch(/Adaptativo/);
    expect(text).toMatch(/Híbrido/);
  });

  it('keeps the earned value formulas of the Measurement domain', () => {
    const text = topics.DomainMeasurement.items.join(' ');
    expect(text).toContain('SPI = EV / PV');
    expect(text).toContain('CPI = EV / AC');
  });

  it('keeps presentation out of the data: tones are semantic, not CSS classes', () => {
    for (const topic of Object.values(topics)) {
      expect(['info', 'accent', 'success', 'danger']).toContain(topic.tone);
    }
    for (const card of guideCards) {
      expect(card).not.toHaveProperty('cardClass');
    }
  });
});
