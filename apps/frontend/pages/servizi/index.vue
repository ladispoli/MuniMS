<script lang="ts" setup>
import type { Servizio, Taxonomy } from '~/types/strapi';

const { settings } = useConfigStore();

const taxonomies = {
  contentType: 'tax-servizi',
  dataT: {} as Array<Taxonomy>,
  params: {
    filters: {
      disabilitato: {
        $ne: true,
      },
    },
    sort: 'nome',
  },
};

const serviziQuery = {
  index: 'servizio',
  itemT: {} as Servizio,
  sort: ['titolo:asc'],
};
</script>

<template>
  <Page :title="settings.nav.servizi.name" :description="settings.nav.servizi.description">
    <PageHeading class="pb-4" show-actions />

    <section class="section section-muted py-2 px-0" aria-describedby="servizi-titolo">
      <div class="container">
        <h2 id="servizi-titolo" class="mb-4 mt-5 mb-lg-5">Esplora tutti i servizi</h2>

        <StrapiSearch
          :find="serviziQuery"
          :stats-label="{
            singular: 'servizio trovato in ordine alfabetico',
            plural: 'servizi trovati in ordine alfabetico',
          }"
          :page-size="4"
        >
          <template #response="{ data: servizi }">
            <div class="row g-4">
              <CardWrapper teaser-large class="col-12 col-lg-8 mt-4 pb-0">
                <Card v-for="servizio in servizi" :key="servizio.id" class="shadow-sm no-after mb-4" title-class="h4">
                  <template #category>
                    <span class="visually-hidden">Categoria:</span>
                    <NuxtLink :to="`${$route.path}/${servizio.tax_servizio.slug}`" class="text-decoration-none">
                      <StrapiSearchHighlight attr="tax_servizio_nome" :item="servizio" />
                    </NuxtLink>
                  </template>
                  <template #title>
                    <NuxtLink
                      :to="`${$route.path}/${servizio.tax_servizio.slug}/${servizio.slug}`"
                      class="text-decoration-none"
                      data-element="service-link"
                    >
                      <StrapiSearchHighlight attr="titolo" :item="servizio" />
                    </NuxtLink>
                    <p v-if="servizio.accessoDigitale" class="my-0 py-0">
                      <Badge color="info">online</Badge>
                    </p>
                  </template>

                  <StrapiSearchHighlight attr="descrizione" :item="servizio" />
                </Card>
              </CardWrapper>

              <div class="col-12 col-lg-4 pt-3 ps-lg-3">
                <StrapiSearchFilters attr="tax_servizio_nome" :sort="['name:asc']" heading="Categorie" :limit="8" />
              </div>
            </div>
          </template>
          <template #fallback>
            <div class="p-4 text-center">Nessun servizio trovato</div>
          </template>
        </StrapiSearch>
      </div>
    </section>

    <StrapiFetch
      id="categorie"
      :find="taxonomies"
      on="section"
      class="section py-5 px-0"
      aria-describedby="categorie-titolo"
    >
      <template #response="{ data: categories }">
        <div class="container">
          <h2 id="categorie-titolo" class="mb-4">Esplora per categoria</h2>
          <div class="row g-4">
            <CardWrapper v-for="category in categories" :key="category.id" class="col-md-6 col-xl-4">
              <Card class="shadow-sm border border-light no-after" no-bg>
                <template #title>
                  <NuxtLink
                    :to="`${$route.path}/${category.slug}`"
                    class="text-decoration-none"
                    data-element="service-category-link"
                  >
                    {{ category.nome }}
                  </NuxtLink>
                </template>
                <span>{{ category.note }}</span>
              </Card>
            </CardWrapper>
          </div>
        </div>
      </template>
    </StrapiFetch>
  </Page>
</template>
