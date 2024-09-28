<script lang="ts" setup>
import type { Taxonomy, Luogo } from '~/types/strapi';

const route = useRoute();

const categoriaQuery = ref({
  contentType: 'tax-luoghi',
  singleEntry: true,
  dataT: {} as Taxonomy,
  params: {
    filters: {
      slug: route.params.taxonomy,
    },
  },
});

const luoghiQuery = {
  index: 'luogo',
  itemT: {} as Luogo,
  filters: `tax_luogo.slug=${route.params.taxonomy}`,
  sort: ['nome:asc'],
};
</script>

<template>
  <StrapiFetch id="categoria" :find="categoriaQuery" fallback-error="404">
    <template #response="{ data: categoria }">
      <Page
        :title="categoria.nome"
        :description="categoria.note ?? `Luoghi di interesse nella categoria: ${categoria.tassonomia}`"
      >
        <PageHeading class="drop-shadow pb-4" show-actions />

        <section class="section px-0 py-5">
          <div class="container">
            <StrapiSearch :find="luoghiQuery">
              <template #response="{ data: luoghi }">
                <div class="row g-4">
                  <CardWrapper v-for="luogo in luoghi" :key="luogo.id" class="col-lg-6 col-xl-4">
                    <Card
                      class="border border-light shadow-sm"
                      :category="luogo.tax_luogo.nome"
                      img-panoramic
                      :read-more-link="$route.path + `/${luogo.slug}`"
                      read-more-label="Leggi di più"
                    >
                      <template v-if="luogo.immagine" #img>
                        <StrapiMedia :data="luogo.immagine" :simple-img="[800]" />
                      </template>
                      <template #title>
                        <NuxtLink :to="$route.path + `/${luogo.slug}`" class="text-decoration-none">
                          <StrapiSearchHighlight attr="nome" :item="luogo" />
                        </NuxtLink>
                      </template>
                      <template #text><StrapiSearchHighlight attr="descrizione" :item="luogo" /></template>
                    </Card>
                  </CardWrapper>
                </div>
              </template>
              <template #fallback>
                <div class="text-center p-4">Nessun luogo trovato</div>
              </template>
            </StrapiSearch>
          </div>
        </section>
      </Page>
    </template>
  </StrapiFetch>
</template>
