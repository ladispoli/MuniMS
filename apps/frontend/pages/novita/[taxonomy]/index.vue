<script lang="ts" setup>
import type { Notizia } from '~/types/strapi';

const { settings } = useConfigStore();
const route = useRoute();

const page = settings.nav.novita.menu.find(({ path }) => path === route.path);
if (!page) showError({ statusCode: 404 });

const newsQuery = {
  index: 'notizia',
  itemT: {} as Notizia,
  filters: `tax_notizia.slug=${page?.taxonomySlug}`,
  sort: ['data:desc'],
};
</script>

<template>
  <Page :title="page?.name" :description="page?.description">
    <PageHeading :nav="settings.nav.novita" class="drop-shadow pb-4" />

    <section class="section py-5 px-0">
      <div class="container">
        <StrapiSearch :find="newsQuery">
          <template #response="{ data: news }">
            <div class="row g-4">
              <CardWrapper v-for="notizia in news" :key="notizia.id" class="col-md-6 col-xl-4">
                <Card
                  class="border border-light shadow-sm"
                  img-panoramic
                  :date="notizia.data"
                  :category="notizia.tax_notizia.nome"
                >
                  <template v-if="notizia.immagine" #img>
                    <StrapiMedia :data="notizia.immagine" :simple-img="[800]" />
                  </template>
                  <template #title>
                    <NuxtLink :to="$route.path + `/${notizia.slug}`" class="text-decoration-none">
                      <StrapiSearchHighlight attr="titolo" :item="notizia" />
                    </NuxtLink>
                  </template>
                  <template #text>
                    <p class="font-sans-serif fs-6"><StrapiSearchHighlight attr="descrizione" :item="notizia" /></p>
                  </template>
                </Card>
              </CardWrapper>
            </div>
          </template>
          <template #fallback>
            <div class="p-4 text-center">Nessuna novità trovata</div>

            <div v-if="notizia.argomenti?.length" class="mt-4">
              <h4 class="visually-hidden">Argomenti</h4>

              <Chip
                v-for="tag in notizia.argomenti"
                :key="tag.id"
                :label="tag.nome"
                :to="`/argomenti/${tag.slug}`"
                :data-attribute="tag?.vocabolario"
                simple
                color="primary"
              />
            </div>
          </template>
        </StrapiSearch>
      </div>
    </section>
  </Page>
</template>
