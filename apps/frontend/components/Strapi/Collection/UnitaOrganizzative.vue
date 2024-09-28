<script lang="ts" setup>
import type { UnitaOrganizzativa } from '~/types/strapi';

interface Props {
  queryFilters: string | Record<string, unknown> | Ref<Record<string, unknown>>; // filters for StrapiSearch query or for strapiFetch query
  disableSearch?: boolean; // use StrapiFetch instead of StrapiSearch
  searchStatsLabel?: { singular: string; plural: string }; // stats label for StrapiSearch
  wrapperClass?: string; // wrapper class
  id?: string; // key to ensure multiple fetches in the same route path
  hideParent?: boolean;
  basePath?: string; // base route path
  pageSize?: number; // number of elements for the pagination
  pageParam?: string; // page query parameter for the pagination
  noFallback?: boolean; // Strapi Fetch, remove fallback
}

const props = withDefaults(defineProps<Props>(), {
  searchStatsLabel: () => ({
    singular: 'unità organizzativa trovata in ordine alfabetico',
    plural: 'unità organizzative trovate in ordine alfabetico',
  }),
  id: 'unitaOrganizzative',
  wrapperClass: 'container',
  pageSize: 6,
  pageParam: 'p',
});

// StrapiSearch
const searchQuery = {
  index: 'unita-organizzativa',
  itemT: {} as UnitaOrganizzativa,
  filters: typeof props.queryFilters === 'string' ? props.queryFilters : JSON.stringify(props.queryFilters),
  sort: ['order:desc', 'titolo:asc'],
  pageSize: props.pageSize,
};

// StrapiFetch
const fetchQuery = ref({
  contentType: 'unita-organizzative',
  dataT: {} as Array<UnitaOrganizzativa>,
  params: {
    filters: unref(props.queryFilters),
    fields: ['slug', 'titolo', 'descrizione'],
    populate: {
      logo: true,
      tax_unita_organizzativa: true,
      unita_organizzativa_padre: props.hideParent
        ? false
        : {
            fields: ['slug', 'titolo'],
            populate: ['tax_unita_organizzativa'],
          },
    },
    sort: 'titolo',
  },
  pagination: {
    pageSize: props.pageSize,
    pageParam: props.pageParam,
  },
});

function getStrutturaDiRiferimentoTitle(unitaOrganizzativa: UnitaOrganizzativa) {
  if (unitaOrganizzativa?.unita_organizzativa_padre?.tax_unita_organizzativa) {
    const parentTaxSlug = unitaOrganizzativa.unita_organizzativa_padre.tax_unita_organizzativa.slug;

    if (parentTaxSlug === 'struttura-amministrativa_area') {
      return 'Area';
    }
    if (parentTaxSlug === 'struttura-amministrativa_ufficio') {
      return 'Ufficio di riferimento';
    }
  }

  return 'Appartiene a';
}
</script>

<template>
  <section v-if="!disableSearch" :id="id" :class="wrapperClass">
    <StrapiSearch :find="searchQuery" :stats-label="searchStatsLabel" :no-fallback="noFallback">
      <template #response="{ data: unitaOrganizzative }">
        <div class="row g-4 mb-3 mt-4">
          <CardWrapper
            v-for="unitaOrganizzativa in unitaOrganizzative"
            :key="unitaOrganizzativa.id"
            class="col-lg-6 col-xl-4 my-0 pb-0"
            teaser-large
            stretch
          >
            <Card class="shadow-sm border border-light no-after" no-bg title-class="h4 mb-0">
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
                <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="unitaOrganizzativa" search-highlight />
              </template>
              <template #text>
                <div class="font-sans-serif">
                  <p class="mb-2">
                    <StrapiSearchHighlight attr="descrizione" :item="unitaOrganizzativa" />
                  </p>
                  <p
                    v-if="
                      unitaOrganizzativa.unita_organizzativa_padre &&
                      unitaOrganizzativa.unita_organizzativa_padre.id != unitaOrganizzativa.id // it's not parent of itself
                    "
                  >
                    <strong>{{ getStrutturaDiRiferimentoTitle(unitaOrganizzativa) }}: </strong>
                    <StrapiBlockUnitaOrganizzativaLink
                      :unita-organizzativa="unitaOrganizzativa.unita_organizzativa_padre"
                      search-highlight
                    />
                  </p>
                </div>
              </template>
              <small class="mt-auto mb-0">
                <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="unitaOrganizzativa">
                  Ulteriori dettagli
                </StrapiBlockUnitaOrganizzativaLink>
              </small>
            </Card>
          </CardWrapper>
        </div>
      </template>
    </StrapiSearch>
  </section>
  <StrapiFetch v-else :id="id" :find="fetchQuery" :no-fallback="noFallback">
    <template #response="{ data: unitaOrganizzative }">
      <section :class="wrapperClass">
        <div class="row g-4 mb-3">
          <CardWrapper
            v-for="unitaOrganizzativa in unitaOrganizzative"
            :key="unitaOrganizzativa.id"
            class="col-lg-6 col-xl-4 my-0 pb-0"
            teaser-large
            stretch
          >
            <Card class="shadow-sm border border-light no-after" no-bg title-class="h4 mb-0">
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
                <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="unitaOrganizzativa" />
              </template>
              <template #text>
                <div class="font-sans-serif">
                  <p class="mb-2">{{ unitaOrganizzativa.descrizione }}</p>
                  <p
                    v-if="
                      unitaOrganizzativa.unita_organizzativa_padre &&
                      unitaOrganizzativa.unita_organizzativa_padre.id != unitaOrganizzativa.id // it's not parent of itself
                    "
                  >
                    <strong>{{ getStrutturaDiRiferimentoTitle(unitaOrganizzativa) }}: </strong>
                    <StrapiBlockUnitaOrganizzativaLink
                      :unita-organizzativa="unitaOrganizzativa.unita_organizzativa_padre"
                    />
                  </p>
                </div>
              </template>
              <small class="mt-auto mb-0">
                <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="unitaOrganizzativa">
                  Ulteriori dettagli
                </StrapiBlockUnitaOrganizzativaLink>
              </small>
            </Card>
          </CardWrapper>
        </div>
      </section>
    </template>
  </StrapiFetch>
</template>
