<script lang="ts" setup>
import type { UnitaOrganizzativa } from '~/types/strapi';

const { settings } = useConfigStore();
const route = useRoute();

const page = settings.nav.amministrazione.menu.find(({ path }) => path === route.matched[0].path);
if (!page) showError({ statusCode: 404 });

const entiFondazioniQuery = {
  index: 'unita-organizzativa',
  itemT: {} as UnitaOrganizzativa,
  filters: `tax_unita_organizzativa.slug=altra-struttura OR
    tax_unita_organizzativa.slug=altra-struttura_ente OR
    tax_unita_organizzativa.slug=altra-struttura_fondazione OR
    tax_unita_organizzativa.slug=altra-struttura_azienda-municipalizzata OR
    tax_unita_organizzativa.slug=altra-struttura_biblioteca OR
    tax_unita_organizzativa.slug=altra-struttura_centro-culturale OR
    tax_unita_organizzativa.slug=altra-struttura_museo OR
    tax_unita_organizzativa.slug=altra-struttura_scuola`,
  sort: ['order:desc', 'titolo:asc'],
};
</script>

<template>
  <Page :title="page?.name" :description="page?.description">
    <PageHeading :nav="settings.nav.amministrazione" class="pb-4" />

    <section class="page-section">
      <div class="container">
        <h2 id="servizi-titolo" class="mb-4 mt-5 mb-lg-5">Esplora tutte le strutture</h2>

        <StrapiSearch
          :find="entiFondazioniQuery"
          :stats-label="{
            singular: 'struttura trovata in ordine alfabetico',
            plural: 'strutture trovate in ordine alfabetico',
          }"
        >
          <template #response="{ data: unitaOrganizzative }">
            <div class="row g-4">
              <CardWrapper teaser class="col-12 col-lg-8 mt-4 pb-0">
                <Card
                  v-for="unitaOrganizzativa in unitaOrganizzative"
                  :key="unitaOrganizzativa.id"
                  class="border border-light shadow-sm"
                  :category="unitaOrganizzativa.tax_unita_organizzativa?.nome"
                >
                  <template v-if="unitaOrganizzativa.logo" #pre-body>
                    <Avatar :title="unitaOrganizzativa.titolo" size="lg" class="me-3">
                      <StrapiMedia
                        :data="unitaOrganizzativa.logo"
                        :simple-img="[80]"
                        :img-attrs="{ alt: unitaOrganizzativa.titolo }"
                        no-caption
                      />
                    </Avatar>
                  </template>
                  <template #title>
                    <NuxtLink :to="`${$route.path}/${unitaOrganizzativa.slug}`" class="text-decoration-none">
                      <StrapiSearchHighlight attr="titolo" :item="unitaOrganizzativa" />
                    </NuxtLink>
                  </template>
                  <template #text>
                    <p class="font-sans-serif fs-6">
                      <StrapiSearchHighlight attr="descrizione" :item="unitaOrganizzativa" />
                    </p>
                  </template>
                </Card>
              </CardWrapper>

              <div class="col-12 col-lg-4 pt-3 ps-lg-3">
                <StrapiSearchFilters attr="tax_unita_organizzativa_nome" />
              </div>
            </div>
          </template>
        </StrapiSearch>
      </div>
    </section>
  </Page>
</template>
