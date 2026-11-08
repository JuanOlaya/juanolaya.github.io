import { patternNames } from './data/patterns';
import {
  ALL_FAMILIES,
  activeFamilyId,
  goToPage,
  initialState,
  patternAt,
  selectFamily,
  selectPattern,
  type CatalogState,
} from './catalog';

/**
 * Query string ⇄ state, so a filtered view can be shared:
 * `?pattern=<name>&family=<id>&page=<1-based>`. Defaults are omitted; invalid values fall back to them.
 */
export function stateFromQuery(search: string): CatalogState {
  const params = new URLSearchParams(search);
  const patternIndex = (patternNames as readonly (string | null)[]).indexOf(params.get('pattern'));
  let state = patternIndex === -1 ? initialState : selectPattern(initialState, patternIndex);
  const family = params.get('family');
  if (family) state = selectFamily(state, family);
  const page = Number.parseInt(params.get('page') ?? '', 10);
  return Number.isNaN(page) ? state : goToPage(state, page - 1);
}

export function queryFromState(state: CatalogState): string {
  const params = new URLSearchParams();
  const pattern = patternAt(state.patternIndex);
  if (state.patternIndex !== initialState.patternIndex) params.set('pattern', pattern);
  const family = activeFamilyId(state);
  if (family !== ALL_FAMILIES) params.set('family', family);
  if (state.page > 0) params.set('page', String(state.page + 1));
  const query = params.toString();
  return query ? `?${query}` : '';
}
