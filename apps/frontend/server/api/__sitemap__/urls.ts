import type { Servizio } from '~/types/strapi';

export default defineSitemapEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig();

  const pages: any = await $fetch(`${runtimeConfig.strapiUrl}/api/sitemap`);

  if (Array.isArray(pages) && pages.length) {
    return pages;
  }

  return [];
});
