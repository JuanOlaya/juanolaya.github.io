import { standardColors } from './verben-data.ts';

/** One physical JSON folder of a level (`A1_1`, `A1_2`…): how many groups it holds and their file numbers. */
export interface LevelLayer {
  key: string;
  count: number;
  fileNumbers: number[];
}

/** Physical folders of every macro level (`A1`, `A2`…), in reading order. */
export type PhysicalLevelMap = Record<string, LevelLayer[]>;

export interface LevelSummary {
  groupCount: number;
  displayName: string;
}

/** Folder, position inside it and file number of the `globalIndex`-th group of `macroLevel`, or null. */
export function physicalGroupData(map: PhysicalLevelMap, macroLevel: string, globalIndex: number) {
  const layers = map[macroLevel] || [];
  let offset = 0;
  for (const layer of layers) {
    if (globalIndex < offset + layer.count) {
      const localIndex = globalIndex - offset;
      const fileNumber = Array.isArray(layer.fileNumbers) ? layer.fileNumbers[localIndex] : globalIndex + 1;
      return { physicalKey: layer.key, localIndex, fileNumber };
    }
    offset += layer.count;
  }
  return null;
}

/** 0-based index across the whole macro level of group `localGroupNumber` (1-based) of layer `levelStr` (`A1.2`). */
export function globalGroupIndex(map: PhysicalLevelMap, levelStr: string, localGroupNumber: unknown): number {
  if (!levelStr || localGroupNumber === undefined || localGroupNumber === null) return 0;
  const macroLevel = levelStr.split('.')[0];
  const physicalKey = levelStr.includes('.') ? levelStr.replace('.', '_') : levelStr;
  const layers = map[macroLevel] || [];
  let index = Number(localGroupNumber) - 1;
  for (const layer of layers) {
    if (layer.key === physicalKey) break;
    index += layer.count;
  }
  return Math.max(0, index);
}

/** Theme colour of the group a verb belongs to; steel blue when the verb has no level or group. */
export function themeColorForVerb(
  map: PhysicalLevelMap,
  verbData: { level?: string; group?: unknown } | null,
) {
  if (!verbData || !verbData.level || !verbData.group) {
    return '#4682B4';
  }
  const index = globalGroupIndex(map, verbData.level, verbData.group);
  return standardColors[((index % standardColors.length) + standardColors.length) % standardColors.length];
}

function fileNumbersFor(count: number, previousLayer: LevelLayer | undefined): number[] {
  if (!previousLayer || !Array.isArray(previousLayer.fileNumbers)) {
    return Array.from({ length: count }, (_, index) => index + 1);
  }
  const previous = previousLayer.fileNumbers;
  if (count <= previous.length) return previous.slice(0, count);
  const lastNum = previous.length > 0 ? previous[previous.length - 1] : 0;
  const extension = Array.from({ length: count - previous.length }, (_, index) => lastNum + index + 1);
  return [...previous, ...extension];
}

/**
 * Level layout derived from the groups index. Known layers keep their file numbers (extended or trimmed to
 * the new count); new layers number their files from 1. Null when there are no groups, so the caller keeps
 * its current layout.
 */
export function levelsFromGroups(
  groupsArray: unknown,
  previousMap: PhysicalLevelMap,
): { physicalLevelMap: PhysicalLevelMap; levelConfig: Record<string, LevelSummary> } | null {
  if (!Array.isArray(groupsArray) || groupsArray.length === 0) return null;
  const physicalLevelMap: PhysicalLevelMap = {};
  const levelConfig: Record<string, LevelSummary> = {};
  for (const group of groupsArray as { level?: unknown }[]) {
    if (!group || !group.level) continue;
    const macroLevel = String(group.level).split('.')[0];
    const physicalKey = String(group.level).replace('.', '_');
    physicalLevelMap[macroLevel] ??= [];
    levelConfig[macroLevel] ??= { groupCount: 0, displayName: macroLevel };
    levelConfig[macroLevel].groupCount++;
    let layer = physicalLevelMap[macroLevel].find((l) => l.key === physicalKey);
    if (!layer) {
      layer = { key: physicalKey, count: 0, fileNumbers: [] };
      physicalLevelMap[macroLevel].push(layer);
    }
    layer.count++;
  }
  for (const layers of Object.values(physicalLevelMap)) {
    for (const layer of layers) {
      const macroLevel = layer.key.split('_')[0];
      const previousLayer = (previousMap[macroLevel] || []).find((item) => item.key === layer.key);
      layer.fileNumbers = fileNumbersFor(layer.count, previousLayer);
    }
  }
  return { physicalLevelMap, levelConfig };
}

/** Width one compact card takes in the carousel: 350px card plus its 10px side margins (`styles.css`). */
const CARD_SLOT_WIDTH = 370;
const MAX_CARDS_PER_PAGE = 4;

/**
 * Cards per page of the compact carousel for a viewport `width`, and the device class it implies. Only as
 * many cards as fit side by side: a wider row is clipped by the container, which cut the first card at 640px.
 */
export function pageSizeForWidth(width: number) {
  const pageSize = Math.min(MAX_CARDS_PER_PAGE, Math.max(1, Math.floor(width / CARD_SLOT_WIDTH)));
  if (width < 768) return { pageSize, isPhone: true, isTablet: false, isDesktop: false };
  if (width <= 1024) return { pageSize, isPhone: false, isTablet: true, isDesktop: false };
  return { pageSize, isPhone: false, isTablet: false, isDesktop: true };
}
