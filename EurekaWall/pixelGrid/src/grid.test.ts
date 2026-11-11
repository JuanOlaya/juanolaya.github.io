import { describe, expect, it } from 'vitest';
import {
  BACKGROUND_COLOR,
  CELL_PX,
  GAP_PX,
  POP_MS,
  SHAPE_COUNT,
  cellCenter,
  cellIndexAt,
  clearCell,
  clearGrid,
  colorHex,
  createGrid,
  cycleShape,
  eraseLeftOf,
  layoutGrid,
  nextBackground,
  nextShape,
  paintCell,
  popScale,
  resizeGrid,
  strokeCycle,
  strokePaint,
  type Grid,
} from './grid.ts';
import { BACKGROUNDS, PAINT_COLORS, PALETTES, getPalette, nextPalette } from './palette.ts';

const alwaysPaint = () => 0.99;
const alwaysBackground = () => 0;

function blankGrid(width = 400, height = 300): Grid {
  return createGrid(layoutGrid(width, height), alwaysBackground);
}

describe('layoutGrid', () => {
  it('keeps every cell at least 44 CSS px wide and inside the canvas', () => {
    const layout = layoutGrid(320, 480);
    expect(layout.cellSize).toBeGreaterThanOrEqual(44);
    expect(layout.cols).toBeGreaterThan(0);
    const last = cellCenter(layout, layout.cols * layout.rows - 1);
    expect(last.x + layout.cellSize / 2).toBeLessThanOrEqual(320);
    expect(last.y + layout.cellSize / 2).toBeLessThanOrEqual(480);
    expect(cellCenter(layout, 0).x - layout.cellSize / 2).toBeGreaterThanOrEqual(0);
  });

  it('leaves room for the eraser strip on the left', () => {
    const layout = layoutGrid(400, 300, 28);
    expect(cellCenter(layout, 0).x - layout.cellSize / 2).toBeGreaterThanOrEqual(28);
  });

  it.each([
    [0, 0],
    [10, 10],
    [-5, 300],
    [Number.NaN, 300],
    [Number.POSITIVE_INFINITY, 300],
  ])('has no cells on a %sx%s canvas', (width, height) => {
    const layout = layoutGrid(width, height);
    expect(layout.cols).toBe(0);
    expect(layout.rows).toBe(0);
    expect(createGrid(layout, alwaysPaint).cells).toEqual([]);
  });

  it('centres the grid horizontally', () => {
    const layout = layoutGrid(400, 300);
    const first = cellCenter(layout, 0);
    const last = cellCenter(layout, layout.cols - 1);
    expect(first.x - layout.cellSize / 2).toBeCloseTo(400 - (last.x + layout.cellSize / 2), 5);
  });
});

describe('createGrid', () => {
  it('starts every cell as a circle, about 40% blank and the rest in a paint colour', () => {
    let seed = 0;
    const random = () => ((seed += 0.37) % 1);
    const grid = createGrid(layoutGrid(800, 600), random);
    expect(grid.cells.length).toBe(grid.layout.cols * grid.layout.rows);
    for (const cell of grid.cells) {
      expect(cell.shape).toBe(1);
      expect(cell.color).toBeGreaterThanOrEqual(0);
      expect(cell.color).toBeLessThanOrEqual(BACKGROUND_COLOR);
    }
    const blank = grid.cells.filter((cell) => cell.color === BACKGROUND_COLOR).length;
    expect(blank / grid.cells.length).toBeGreaterThan(0.2);
    expect(blank / grid.cells.length).toBeLessThan(0.6);
  });
});

describe('cellIndexAt', () => {
  it('finds the cell under a point and its neighbour across the gap', () => {
    const { layout } = blankGrid();
    const first = cellCenter(layout, 0);
    expect(cellIndexAt(layout, first.x, first.y)).toBe(0);
    expect(cellIndexAt(layout, first.x + CELL_PX + GAP_PX, first.y)).toBe(1);
    expect(cellIndexAt(layout, first.x, first.y + CELL_PX + GAP_PX)).toBe(layout.cols);
  });

  it('returns -1 outside the grid, in the margins and for non-finite points', () => {
    const { layout } = blankGrid();
    expect(cellIndexAt(layout, -100, -100)).toBe(-1);
    expect(cellIndexAt(layout, 10_000, 10)).toBe(-1);
    expect(cellIndexAt(layout, Number.NaN, 10)).toBe(-1);
    expect(cellIndexAt(layoutGrid(0, 0), 0, 0)).toBe(-1);
  });
});

describe('paintCell', () => {
  it('sets shape and colour of a cell', () => {
    const grid = blankGrid();
    expect(paintCell(grid, 3, 7, 2)).toBe(true);
    expect(grid.cells[3]).toEqual({ shape: 7, color: 2 });
  });

  it.each([-1, 10_000, 1.5, Number.NaN])('ignores the out-of-range cell %s', (index) => {
    const grid = blankGrid();
    const before = structuredClone(grid.cells);
    expect(paintCell(grid, index, 1, 0)).toBe(false);
    expect(grid.cells).toEqual(before);
  });

  it.each([-1, 11, 2.5, Number.NaN])('rejects the invalid colour %s without changing the cell', (color) => {
    const grid = blankGrid();
    expect(paintCell(grid, 0, 2, color)).toBe(false);
    expect(grid.cells[0]).toEqual({ shape: 1, color: BACKGROUND_COLOR });
  });

  it.each([0, 13, Number.NaN])('rejects the invalid shape %s', (shape) => {
    const grid = blankGrid();
    expect(paintCell(grid, 0, shape, 0)).toBe(false);
    expect(grid.cells[0].shape).toBe(1);
  });
});

describe('shape cycling', () => {
  it('walks the twelve shapes and wraps to the first', () => {
    let shape = 1;
    const seen = new Set<number>();
    for (let step = 0; step < SHAPE_COUNT; step += 1) {
      seen.add(shape);
      shape = nextShape(shape);
    }
    expect(seen.size).toBe(SHAPE_COUNT);
    expect(shape).toBe(1);
    expect(nextShape(SHAPE_COUNT)).toBe(1);
  });

  it('cycleShape advances one cell and ignores bad indices', () => {
    const grid = blankGrid();
    expect(cycleShape(grid, 0)).toBe(true);
    expect(grid.cells[0].shape).toBe(2);
    expect(cycleShape(grid, -1)).toBe(false);
  });
});

describe('eraser', () => {
  it('clearCell restores the blank circle', () => {
    const grid = blankGrid();
    paintCell(grid, 0, 5, 1);
    expect(clearCell(grid, 0)).toBe(true);
    expect(grid.cells[0]).toEqual({ shape: 1, color: BACKGROUND_COLOR });
    expect(clearCell(grid, 99_999)).toBe(false);
  });

  it('clearGrid blanks every cell and copes with an empty grid', () => {
    const grid = createGrid(layoutGrid(400, 300), alwaysPaint);
    clearGrid(grid);
    expect(grid.cells.every((cell) => cell.color === BACKGROUND_COLOR && cell.shape === 1)).toBe(true);
    expect(() => clearGrid(createGrid(layoutGrid(0, 0), alwaysPaint))).not.toThrow();
  });

  it('eraseLeftOf wipes only the cells whose centre is left of x', () => {
    const grid = createGrid(layoutGrid(400, 300), alwaysPaint);
    const second = cellCenter(grid.layout, 1);
    const wiped = eraseLeftOf(grid, second.x - 1);
    expect(wiped).toBe(grid.layout.rows);
    expect(grid.cells[0].color).toBe(BACKGROUND_COLOR);
    expect(grid.cells[1].color).not.toBe(BACKGROUND_COLOR);
    expect(eraseLeftOf(grid, Number.NaN)).toBe(0);
  });
});

describe('strokes', () => {
  it('paints a cell once per visit so holding still does not repaint it', () => {
    const grid = blankGrid();
    const stroke = { lastCell: -1 };
    const { x, y } = cellCenter(grid.layout, 0);
    expect(strokePaint(grid, stroke, x, y, 2, 1)).toBe(true);
    expect(strokePaint(grid, stroke, x + 1, y, 3, 2)).toBe(false);
    expect(grid.cells[0]).toEqual({ shape: 2, color: 1 });
    const next = cellCenter(grid.layout, 1);
    expect(strokePaint(grid, stroke, next.x, next.y, 3, 2)).toBe(true);
    expect(strokePaint(grid, stroke, x, y, 3, 2)).toBe(true);
  });

  it('misses between cells without disturbing the stroke', () => {
    const grid = blankGrid();
    const stroke = { lastCell: 0 };
    expect(strokePaint(grid, stroke, -50, -50, 2, 1)).toBe(false);
    expect(stroke.lastCell).toBe(-1);
  });

  it('cycles a cell only when both pinch points are inside it, once per pinch', () => {
    const grid = blankGrid();
    const stroke = { lastCell: -1 };
    const c = cellCenter(grid.layout, 0);
    const inside = { x: c.x + 5, y: c.y - 5 };
    expect(strokeCycle(grid, stroke, c, inside)).toBe(true);
    expect(grid.cells[0].shape).toBe(2);
    expect(strokeCycle(grid, stroke, c, inside)).toBe(false);
    const far = cellCenter(grid.layout, 1);
    expect(strokeCycle(grid, stroke, c, far)).toBe(false);
    expect(grid.cells[0].shape).toBe(2);
  });
});

describe('resizeGrid', () => {
  it('keeps each cell at its column and row and blanks the new ones', () => {
    const grid = blankGrid(400, 300);
    paintCell(grid, 0, 4, 2);
    const lastCol = grid.layout.cols - 1;
    paintCell(grid, lastCol, 6, 3);
    const bigger = resizeGrid(grid, layoutGrid(800, 600));
    expect(bigger.cells[0]).toEqual({ shape: 4, color: 2 });
    expect(bigger.cells[lastCol]).toEqual({ shape: 6, color: 3 });
    expect(bigger.cells[bigger.layout.cols - 1]).toEqual({ shape: 1, color: BACKGROUND_COLOR });
    expect(bigger.cells.length).toBe(bigger.layout.cols * bigger.layout.rows);
  });

  it('survives shrinking to nothing and growing back', () => {
    const grid = blankGrid(400, 300);
    paintCell(grid, 0, 4, 2);
    const empty = resizeGrid(grid, layoutGrid(0, 0));
    expect(empty.cells).toEqual([]);
    const back = resizeGrid(empty, layoutGrid(400, 300));
    expect(back.cells.length).toBe(grid.cells.length);
    expect(back.cells[0]).toEqual({ shape: 1, color: BACKGROUND_COLOR });
  });
});

describe('colours', () => {
  it('maps paint indices to the palette and the blank index to the current background', () => {
    expect(colorHex(0, 0)).toBe(PAINT_COLORS[0]);
    expect(colorHex(4, 0)).toBe(PAINT_COLORS[4]);
    expect(colorHex(BACKGROUND_COLOR, 1)).toBe(BACKGROUNDS[1]);
  });

  it('supports the classic original palette with purple, yellow, pink, green and orange on global indices 5-9', () => {
    expect(colorHex(5, 0)).toBe(PALETTES.classic.paints[0]);
    expect(colorHex(5, 0)).toBe('#484B78');
    expect(colorHex(6, 0)).toBe('#E4AA2D');
    expect(colorHex(7, 0)).toBe('#C62F40');
    expect(colorHex(8, 0)).toBe('#58875D');
    expect(colorHex(9, 0)).toBe('#D0692E');
    // Cells preserve their original colors regardless of the active palette parameter
    expect(colorHex(0, 0, 'classic')).toBe('#c48208');
    expect(colorHex(5, 0, 'modern')).toBe('#484B78');
    expect(colorHex(BACKGROUND_COLOR, 0, 'classic')).toBe('#282828');
    expect(colorHex(BACKGROUND_COLOR, 1, 'classic')).toBe('#1E1E1E');
    expect(colorHex(BACKGROUND_COLOR, 2, 'classic')).toBe('#18111D');
    expect(colorHex(BACKGROUND_COLOR, 3, 'classic')).toBe('#F5F2EB');
  });

  it('toggles between modern and classic palettes', () => {
    expect(nextPalette('modern')).toBe('classic');
    expect(nextPalette('classic')).toBe('modern');
    expect(getPalette('modern').label).toBe('Modern');
    expect(getPalette('classic').label).toBe('Classic');
  });

  it.each([-1, 11, Number.NaN])('draws an invalid colour index %s as the background', (color) => {
    expect(colorHex(color, 0)).toBe(BACKGROUNDS[0]);
  });

  it('falls back to the first background when the background index is invalid', () => {
    expect(colorHex(BACKGROUND_COLOR, 99)).toBe(BACKGROUNDS[0]);
    expect(colorHex(BACKGROUND_COLOR, 99, 'classic')).toBe(PALETTES.classic.backgrounds[0]);
  });

  it('cycles backgrounds and wraps', () => {
    let index = 0;
    for (let step = 0; step < BACKGROUNDS.length; step += 1) index = nextBackground(index);
    expect(index).toBe(0);

    let classicIndex = 0;
    for (let step = 0; step < PALETTES.classic.backgrounds.length; step += 1) {
      classicIndex = nextBackground(classicIndex, 'classic');
    }
    expect(classicIndex).toBe(0);
  });
});

describe('popScale', () => {
  it('bulges right after a paint and settles back to 1', () => {
    expect(popScale(0, false)).toBeGreaterThan(1);
    expect(popScale(POP_MS / 2, false)).toBeGreaterThan(1);
    expect(popScale(POP_MS, false)).toBe(1);
    expect(popScale(POP_MS * 10, false)).toBe(1);
  });

  it('is flat under reduced motion and for bad ages', () => {
    expect(popScale(0, true)).toBe(1);
    expect(popScale(POP_MS / 2, true)).toBe(1);
    expect(popScale(-10, false)).toBe(1);
    expect(popScale(Number.NaN, false)).toBe(1);
  });
});
