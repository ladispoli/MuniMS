<script lang="ts" setup>
import type { DocumentiInEvidenza, Taxonomy } from '~/types/strapi';

interface Category {
  name: string;
  path: string;
  description: string;
}

const { settings } = useConfigStore();
const route = useRoute();

const page = settings.nav.amministrazione.menu.find(({ path }) => path === route.matched[0].path);
if (!page) showError({ statusCode: 404 });

const { data: documentiInEvidenza } = await useStrapiFetch<DocumentiInEvidenza>('documenti-in-evidenza', {
  contentType: 'documenti-in-evidenza',
  singleEntry: true,
  params: {
    populate: ['documenti'],
  },
});

const categoriesQuery = ref({
  contentType: 'tax-documenti',
  dataT: {} as Array<Category>,
  params: {
    filters: {
      $or: [
        {
          disabilitato: {
            $eq: null,
          },
        },
        {
          disabilitato: {
            $eq: false,
          },
        },
      ],
    },
    sort: 'nome',
  },
  transform: (taxonomies: Array<Taxonomy>) =>
    taxonomies.reduce((filtered: Array<Category>, tax) => {
      const menuPage = page?.menu?.find(({ taxonomySlug }) => taxonomySlug === tax.slug);

      if (menuPage) {
        filtered.push(menuPage);
      }

      return filtered;
    }, []),
});
</script>

<template>
  <Page :title="page?.name" :description="page?.description">
    <PageHeading :nav="settings.nav.amministrazione" class="drop-shadow pb-4" />

    <section v-if="documentiInEvidenza?.documenti?.length" class="container py-5">
      <h2 class="mb-4">In evidenza</h2>

      <div class="row g-4">
        <CardWrapper v-for="documento in documentiInEvidenza.documenti" :key="documento.id" class="col-md-6 col-xl-4">
          <Card class="shadow-sm border border-light no-after" no-bg>
            <template #title>
              <NuxtLink
                :to="documento.link"
                :rel="isExternalLink(documento.link) ? 'noopener noreferrer' : null"
                :target="isExternalLink(documento.link) ? '_blank' : null"
                class="text-decoration-none d-flex"
              >
                <Icon
                  :name="documento.icona ?? (isExternalLink(documento.link) ? 'it-external-link' : 'it-link')"
                  class="me-2 my-1"
                />
                {{ documento.titolo }}
              </NuxtLink>
            </template>
            <span v-if="documento.descrizione">{{ documento.descrizione }}</span>
          </Card>
        </CardWrapper>
      </div>
    </section>

    <StrapiFetch id="categorie" :find="categoriesQuery" no-fallback>
      <template #response="{ data: categories }">
        <section v-if="categories?.length" class="container py-5">
          <h2 class="mb-4">Esplora per categoria</h2>

          <div class="row g-4">
            <CardWrapper v-for="category in categories" :key="category.path" class="col-md-6 col-xl-4">
              <Card class="shadow-sm border border-light no-after" no-bg>
                <template #title>
                  <NuxtLink :to="category.path" class="text-decoration-none">{{ category.name }}</NuxtLink>
                </template>
                <span>{{ category.description }}</span>
              </Card>
            </CardWrapper>
          </div>
        </section>
      </template>
    </StrapiFetch>
  </Page>
</template>
