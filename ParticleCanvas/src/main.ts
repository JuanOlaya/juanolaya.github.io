import { PARTICLE_CANVAS, resolveConfig } from '../../src/sketches/inspirational-wall/config.ts';
import { mountInspirationalWall } from '../../src/sketches/inspirational-wall/sketch.ts';
import '../../src/sketches/inspirational-wall/style.css';

mountInspirationalWall(resolveConfig(PARTICLE_CANVAS, window.location.search));
