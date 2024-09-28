/** generic utility functions */

import { differenceInDays } from 'date-fns';
import type { RouteLocationRaw } from 'vue-router';
import type { Evento, Taxonomy } from '~/types/strapi';

function isExternalLink(path?: RouteLocationRaw) {
  if (!path) return false;
  return typeof path === 'string' && path.startsWith('http');
}

/**
 * specific for taxonomy based routes defined in app.config.ts by taxonomySlug
 */
function getTaxPath(menu: Array<{ taxonomySlug: string; path?: string }> | undefined, taxonomy: Taxonomy) {
  if (!menu) return '';
  const page = menu.find(({ taxonomySlug }) => taxonomySlug === taxonomy.slug);
  return page?.path ?? '';
}

/**
 * specific for 'Evento' from strapi.
 */
function eventHasMoreDays({ dataInizio, dataFine }: Evento) {
  return differenceInDays(new Date(dataFine), new Date(dataInizio)) !== 0;
}

export { isExternalLink, getTaxPath, eventHasMoreDays };
