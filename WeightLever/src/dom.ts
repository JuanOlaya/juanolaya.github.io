export function byId<T extends HTMLElement>(id: string, type: new () => T): T {
  const element = document.getElementById(id);
  if (!(element instanceof type)) throw new Error(`#${id} is missing or is not a ${type.name}`);
  return element;
}

export function context2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error(`#${canvas.id} has no 2D context`);
  return ctx;
}

export function radios(name: string): NodeListOf<HTMLInputElement> {
  return document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`);
}

/** Value of the checked radio in a group; the markup always has one checked by default. */
export function checkedValue<T extends string>(name: string): T {
  const checked = document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  if (!checked) throw new Error(`No radio checked in group "${name}"`);
  return checked.value as T;
}
