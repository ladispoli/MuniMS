<script lang="ts" setup>
import type { Servizio, Taxonomy, UnitaOrganizzativa } from '~/types/strapi';

const route = useRoute();

const categoriaQuery = ref({
  contentType: 'tax-servizi',
  singleEntry: true,
  dataT: {} as Taxonomy,
  params: {
    filters: {
      slug: route.params.taxonomy,
    },
  },
});

const serviziQuery = {
  index: 'servizio',
  itemT: {} as Servizio,
  sort: ['titolo:asc'],
  filters: `tax_servizio.slug=${route.params.taxonomy}`,
};

const unitaOrganizzativeResponsabiliQuery = ref({
  contentType: 'servizi',
  dataT: {} as Array<UnitaOrganizzativa>,
  params: {
    filters: {
      tax_servizio: {
        slug: route.params.taxonomy,
      },
    },
    populate: {
      unita_organizzativa_responsabile: {
        populate: ['tax_unita_organizzativa'],
        fields: ['titolo', 'slug'],
      },
    },
    sort: ['unita_organizzativa_responsabile.titolo', 'titolo'],
  },
  transform: (servizi: Array<Servizio>) => {
    const strutture = new Map();

    for (const servizio of servizi) {
      const struttura = servizio?.unita_organizzativa_responsabile;
      if (struttura && !strutture.has(struttura.id)) {
        strutture.set(struttura.id, struttura);
      }
    }

    return [...strutture.values()];
  },
});
</script>

<template>
  <StrapiFetch id="categoria" :find="categoriaQuery" fallback-error="404">
    <template #response="{ data: categoria }">
      <Page :title="categoria.nome" :description="categoria.note">
        <PageHeading class="pb-4" show-actions />

        <section class="section section-muted px-0 pt-1">
          <StrapiSearch
            :find="serviziQuery"
            :stats-label="{
              singular: 'servizio trovato in ordine alfabetico',
              plural: 'servizi trovati in ordine alfabetico',
            }"
            :placeholder="`Cerca servizi in ${categoria.nome}`"
            class="container mt-5"
          >
            <template #response="{ data: servizi }">
              <div class="row g-4">
                <CardWrapper teaser-large class="col-12 col-lg-8 pt-lg-50 pb-lg-50">
                  <Card
                    v-for="servizio in servizi"
                    :key="servizio.id"
                    class="shadow-sm no-after mb-lg-4"
                    title-class="h4"
                  >
                    <template #title>
                      <NuxtLink
                        :to="`${$route.path}/${servizio.slug}`"
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

                <StrapiFetch
                  id="unitaOrganizzativeResponsabili"
                  :find="unitaOrganizzativeResponsabiliQuery"
                  no-fallback
                  class="col-12 col-lg-4 pt-50 pb-30 pt-lg-5 ps-lg-3"
                >
                  <template #response="{ data: unitaOrganizzativeResponsabili }">
                    <List :link-list="[]">
                      <template #heading>
                        <h2 class="small fw-bold text-uppercase header">Strutture responsabili</h2>
                      </template>
                      <li v-for="unitaOrganizzativa in unitaOrganizzativeResponsabili" :key="unitaOrganizzativa.id">
                        <StrapiBlockUnitaOrganizzativaLink
                          :unita-organizzativa="unitaOrganizzativa"
                          class="list-item large text-decoration-underline"
                          :title="unitaOrganizzativa.titolo"
                        />
                      </li>
                    </List>
                  </template>
                </StrapiFetch>
              </div>
            </template>
            <template #fallback>
              <div class="text-center p-4">Nessun servizio trovato</div>
            </template>
          </StrapiSearch>
        </section>
      </Page>
    </template>
  </StrapiFetch>
</template>

<style lang="scss" scoped>
.row [class*='col-'] .servizio-card {
  &,
  > :deep(.card) {
    height: auto;
  }
}
</style>
