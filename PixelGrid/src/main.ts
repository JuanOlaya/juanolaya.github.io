import { PIXEL_GRID, resolveConfig } from '../../src/sketches/inspirational-wall/config.ts';
import { mountInspirationalWall } from '../../src/sketches/inspirational-wall/sketch.ts';
import '../../src/sketches/inspirational-wall/style.css';

mountInspirationalWall(resolveConfig(PIXEL_GRID, window.location.search));
