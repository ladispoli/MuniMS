import { format } from 'date-fns';
import { it } from 'date-fns/locale';

/**
 * by providing a default string of 'PPP' or any of its variants for `formatStr`
 * it will format dates in whichever way is appropriate to the locale
 *
 * documentation: https://date-fns.org/docs/format
 */
function formatLocale(date: Date | string, formatStr = 'PPP') {
  if (typeof date === 'string') date = new Date(date);
  if (formatStr === 'ISO') formatStr = "yyyy-MM-dd'T'HH:mm:ss.'000Z'"; // ISO format with hardcoded timezone +0

  return format(date, formatStr, { locale: it });
}

export { formatLocale as formatDate };
