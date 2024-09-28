<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core';
import type { TaxArgomento } from '~/types/strapi';

interface StrapiQuery {
  index: string;
  label: string;
  icon: string;
  isActive: boolean;
}

definePageMeta({
  title: 'Ricerca',
  description: 'Risultati della ricerca globale',
});

const { settings } = useConfigStore();

const { width: windowWidth } = useWindowSize();
const lgGridBreakpoint = 992; // bootstrap-italia grid-breakpoint 'md'
const isDesktop = computed(() => windowWidth.value > lgGridBreakpoint);
const headerHeight = useState('header-height');
const headerHeightPx = computed(() => headerHeight.value + 'px');

const documentiPage = settings.nav.amministrazione.menu.find(
  ({ path }) => path === settings.nav.amministrazione.routes.documenti,
);

const queries = reactive<Array<StrapiQuery>>([
  {
    index: 'servizio',
    label: 'Servizi',
    icon: 'it-settings',
    isActive: false,
  },
  {
    index: 'notizia',
    label: 'Novità',
    icon: 'it-note',
    isActive: false,
  },
  {
    index: 'unita-organizzativa',
    label: 'Uffici e strutture',
    icon: 'it-pa',
    isActive: false,
  },
  {
    index: 'documento-pubblico',
    label: 'Documenti',
    icon: 'it-files',
    isActive: false,
  },
  {
    index: 'evento',
    label: 'Eventi',
    icon: 'it-calendar',
    isActive: false,
  },
  {
    index: 'luogo',
    label: 'Luoghi',
    icon: 'it-map-marker-circle',
    isActive: false,
  },

  {
    index: 'persona',
    label: 'Persone',
    icon: 'it-user',
    isActive: false,
  },
  {
    index: 'incarico',
    label: 'Incarichi',
    icon: 'it-bookmark',
    isActive: false,
  },
]);

const { data: argomenti } = await useStrapiFetch('argomenti', {
  contentType: 'argomenti',
  dataT: {} as Array<any>,
  params: {
    fields: ['nome'],
    pagination: {
      pageSize: 300,
      page: 1,
    },
  },
  transform: (argomenti: Array<TaxArgomento>) =>
    argomenti.map(({ nome }) => ({ value: nome, label: nome, isRefined: false })) ?? [],
});

const argomentiRefined = computed(() => argomenti?.filter(({ isRefined }) => isRefined));

const filteredQueries = computed(() => {
  const filtered: { items: Array<StrapiQuery>; disabled: boolean } = {
    items: [],
    disabled: false,
  };

  for (const query of queries) {
    if (query.isActive) filtered.items.push(query);
  }

  if (!filtered.items.length) {
    // no filters applied, every query is active
    filtered.items = queries;
    filtered.disabled = true;
  }
  return filtered;
});

function clearQueriesFilter() {
  for (const query of queries) {
    query.isActive = false;
  }
}

const filtersIsOpen = ref(false);

function toggleFilters() {
  filtersIsOpen.value = !filtersIsOpen.value;
}
</script>

<template>
  <Page>
    <section class="section pt-0 px-0">
      <div class="container">
        <div v-if="!isDesktop" class="filters-wrapper p-1">
          <div class="my-2">
            <div class="d-flex justify-content-end">
              <Button
                color="primary"
                :outline="filteredQueries.disabled"
                size="xs"
                icon
                :class="['py-2 px-3', { 'bg-white': filteredQueries.disabled }]"
                @click="toggleFilters()"
              >
                <Icon name="it-funnel" :color="filteredQueries.disabled ? 'primary' : 'white'" class="me-1" />
                Filtra
              </Button>
            </div>
          </div>
        </div>

        <div v-if="argomentiRefined?.length">
          <h2 class="visually-hidden">filtri argomenti applicati</h2>
          <h3 class="header small fw-bold text-secondary">Argomenti:</h3>

          <ul class="list-unstyled">
            <li>
              <Chip v-for="argomento in argomentiRefined" :key="argomento.value" simple>
                {{ argomento.label }}
              </Chip>
            </li>
          </ul>
        </div>

        <StrapiSearch
          :find="{ index: 'argomento' }"
          :page-size="4"
          placeholder="Cerca"
          autofocus
          no-fallback
          hide-stats
          no-pagination
        >
          <template #response>
            <span />
          </template>

          <div class="row justify-content-between">
            <div v-if="isDesktop" class="filters-wrapper drop-shadow col-lg-3 pe-4">
              <fieldset class="mt-4 mb-2">
                <h2 class="visually-hidden">filtri da applicare</h2>

                <legend class="pb-2">
                  <h3 class="header small fw-bold text-secondary text-uppercase">Tipologie</h3>
                </legend>

                <Button class="p-2" size="xs" :disabled="filteredQueries.disabled" @click="clearQueriesFilter()">
                  Rimuovi i filtri
                </Button>

                <ul class="list-unstyled">
                  <li v-for="query in queries" :key="query.index">
                    <div class="form-check">
                      <input
                        :id="`checkbox-${query.index}`"
                        v-model="query.isActive"
                        type="checkbox"
                        @click="query.isActive = !query.isActive"
                      />
                      <label :for="`checkbox-${query.index}`">
                        <span class="h6">{{ query.label }}</span>
                      </label>
                    </div>
                  </li>
                </ul>
              </fieldset>

              <StrapiSearchFilters
                v-if="argomenti"
                attr="argomenti_slug"
                :items="argomenti"
                items-sort="asc"
                show-current
                hide-count
                clear-label="Rimuovi i filtri"
                class="mt-4 mb-2"
              >
                <template #heading>
                  <h3 class="header small fw-bold text-secondary text-uppercase">Argomenti</h3>
                </template>
              </StrapiSearchFilters>
            </div>

            <Modal :is-open="filtersIsOpen" close-btn align="right" title="Filtri" title-tag="h3" scrollable>
              <fieldset class="pb-2">
                <h2 class="visually-hidden">filtri da applicare</h2>

                <legend class="pb-2">
                  <h3 class="header small fw-bold text-secondary text-uppercase">Tipologie</h3>
                </legend>

                <Button class="p-2" size="xs" :disabled="filteredQueries.disabled" @click="clearQueriesFilter()">
                  Rimuovi i filtri
                </Button>

                <ul class="list-unstyled">
                  <li v-for="query in queries" :key="query.index">
                    <div class="form-check">
                      <input
                        :id="`checkbox-${query.index}`"
                        v-model="query.isActive"
                        type="checkbox"
                        @click="query.isActive = !query.isActive"
                      />
                      <label :for="`checkbox-${query.index}`">
                        <span class="h6">{{ query.label }}</span>
                      </label>
                    </div>
                  </li>
                </ul>
              </fieldset>

              <StrapiSearchFilters
                v-if="argomenti"
                attr="argomenti_slug"
                :items="argomenti"
                :sort="['nome:asc']"
                hide-count
                clear-label="Rimuovi i filtri"
                class="mt-4 mb-2"
              >
                <template #heading>
                  <h3 class="header small fw-bold text-secondary text-uppercase">Argomenti</h3>
                </template>
              </StrapiSearchFilters>
            </Modal>

            <div class="col-lg-8">
              <LazyStrapiSearchExtend
                v-for="query in filteredQueries.items"
                :key="query.index"
                :find="{ index: query.index }"
                more
              >
                <template #response="{ data }: any">
                  <h2 class="h5 fw-bold text-secondary border-bottom">
                    <Icon :name="query.icon" color="secondary" />
                    {{ query.label }}
                  </h2>

                  <div class="row g-4 mt-2">
                    <CardWrapper
                      v-for="item in data"
                      :key="item.id"
                      teaser-large
                      class="col-lg-12 col-xl-6 mt-0 pb-lg-4"
                    >
                      <Card
                        v-if="query.index === 'notizia'"
                        :date="item?.data"
                        img-panoramic
                        title-class="h4"
                        class="border border-light shadow-sm no-after h-100 pb-0"
                      >
                        <template v-if="item?.immagine" #img>
                          <StrapiMedia :data="item.immagine" :simple-img="[800]" />
                        </template>
                        <template #category>
                          <StrapiSearchHighlight attr="tax_notizia_nome" :item="item" />
                        </template>
                        <template #title>
                          <NuxtLink
                            :to="`${getTaxPath(settings.nav.novita.menu, item.tax_notizia)}/${item.slug}`"
                            class="text-decoration-none"
                          >
                            <StrapiSearchHighlight attr="titolo" :item="item" />
                          </NuxtLink>
                        </template>
                        <template #text>
                          <p class="font-sans-serif fs-6"><StrapiSearchHighlight attr="descrizione" :item="item" /></p>
                        </template>
                      </Card>

                      <Card
                        v-else-if="query.index === 'servizio'"
                        class="border border-light shadow-sm no-after h-100 pb-0"
                        title-class="h4"
                      >
                        <template #category>
                          <StrapiSearchHighlight attr="tax_servizio_nome" :item="item" />
                        </template>
                        <template #title>
                          <NuxtLink
                            :to="`/servizi/${item.tax_servizio.slug}/${item.slug}`"
                            class="text-decoration-none"
                            data-element="service-link"
                          >
                            <StrapiSearchHighlight attr="titolo" :item="item" />
                          </NuxtLink>
                          <p v-if="item.accessoDigitale" class="my-0 py-0">
                            <Badge color="info">online</Badge>
                          </p>
                        </template>
                        <template #text>
                          <p class="font-sans-serif fs-6"><StrapiSearchHighlight attr="descrizione" :item="item" /></p>
                        </template>
                      </Card>

                      <Card
                        v-else-if="query.index === 'documento-pubblico' && documentiPage?.menu"
                        title-class="h4"
                        class="border border-light shadow-sm no-after h-100 pb-0"
                      >
                        <template v-if="item.immagine" #pre-body>
                          <Avatar :title="item.titolo" size="lg" class="me-3">
                            <StrapiMedia
                              :data="item.immagine"
                              :simple-img="[80]"
                              :img-attrs="{ alt: item.titolo }"
                              no-caption
                            />
                          </Avatar>
                        </template>
                        <template #category>
                          <StrapiSearchHighlight attr="tax_documento_nome" :item="item" />
                        </template>
                        <template #title>
                          <NuxtLink
                            :to="`${getTaxPath(documentiPage.menu, item.tax_documento)}/${item.slug}`"
                            class="text-decoration-none"
                          >
                            <StrapiSearchHighlight attr="titolo" :item="item" />
                          </NuxtLink>
                        </template>
                        <template v-if="item.descrizione" #text>
                          <p class="font-sans-serif fs-6"><StrapiSearchHighlight attr="descrizione" :item="item" /></p>

                          <div v-if="item.data"><b>Data pubblicazione</b>: {{ formatDate(item.data, 'P') }}</div>
                          <div v-if="item.dataFine"><b>Data scadenza</b>: {{ formatDate(item.dataFine, 'P') }}</div>
                          <div v-if="item.unita_organizzativa" class="pt-1 small">
                            <b>Area/Ufficio</b>:
                            <StrapiSearchHighlight attr="unita_organizzativa_titolo" :item="item" />
                          </div>
                        </template>
                      </Card>

                      <Card
                        v-else-if="query.index === 'evento'"
                        img-panoramic
                        title-class="h4"
                        class="border border-light shadow-sm no-after h-100 pb-0"
                      >
                        <template v-if="item.immagine" #img>
                          <StrapiMedia :data="item.immagine" :simple-img="[800]" />
                        </template>
                        <template #category>
                          <StrapiSearchHighlight attr="tax_evento_nome" :item="item" />
                        </template>
                        <template #title>
                          <NuxtLink
                            :to="`${settings.nav.vivereIlComune.routes.eventi}/${item.tax_evento.slug}/${item.slug}`"
                            class="text-decoration-none"
                          >
                            <StrapiSearchHighlight attr="titolo" :item="item" />
                          </NuxtLink>
                        </template>
                        <template #text><StrapiSearchHighlight attr="descrizione" :item="item" /></template>
                      </Card>

                      <Card
                        v-else-if="query.index === 'luogo'"
                        img-panoramic
                        title-class="h4"
                        class="border border-light shadow-sm no-after h-100 pb-0"
                      >
                        <template v-if="item.immagine" #img>
                          <StrapiMedia :data="item.immagine" :simple-img="[800]" />
                        </template>
                        <template #category>
                          <StrapiSearchHighlight attr="tax_luogo_nome" :item="item" />
                        </template>
                        <template #title>
                          <NuxtLink
                            :to="`${settings.nav.vivereIlComune.routes.luoghi}/${item.tax_luogo.slug}/${item.slug}`"
                            class="text-decoration-none"
                          >
                            <StrapiSearchHighlight attr="nome" :item="item" />
                          </NuxtLink>
                          <h4 v-if="item?.nome2" class="h5 text-secondary mt-2">
                            <StrapiSearchHighlight attr="nome2" :item="item" />
                          </h4>
                        </template>
                        <template #text><StrapiSearchHighlight attr="descrizione" :item="item" /></template>
                      </Card>

                      <Card
                        v-else-if="query.index === 'unita-organizzativa'"
                        title-class="h4"
                        class="border border-light shadow-sm no-after h-100 pb-0"
                      >
                        <template v-if="item.logo" #pre-body>
                          <Avatar :title="item.titolo" size="lg" class="me-3">
                            <StrapiMedia
                              :data="item.logo"
                              :simple-img="[80]"
                              :img-attrs="{ alt: item.titolo }"
                              no-caption
                            />
                          </Avatar>
                        </template>
                        <template #category>
                          <StrapiSearchHighlight attr="tax_unita_organizzativa_nome" :item="item" />
                        </template>
                        <template #title>
                          <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="item" class="text-decoration-none">
                            <StrapiSearchHighlight attr="titolo" :item="item" />
                          </StrapiBlockUnitaOrganizzativaLink>
                        </template>
                        <template #text>
                          <StrapiSearchHighlight attr="descrizione" :item="item" />
                        </template>
                      </Card>

                      <StrapiBlockPersonaCard
                        v-else-if="query.index === 'persona'"
                        :persona="item"
                        title-class="h4"
                        class="shadow-sm border border-light no-after h-100 pb-0"
                      >
                        <template #cognome-nome>
                          <StrapiSearchHighlight attr="cognome" :item="item" />&nbsp;<StrapiSearchHighlight
                            attr="nome"
                            :item="item"
                          />
                        </template>
                        <template #text-after>
                          <div class="pt-2">
                            <div v-if="item.responsabile_unita_organizzative?.length" class="mb-2">
                              <ul class="list-comma-inline fs-6">
                                <strong>responsabile di: </strong>
                                <li
                                  v-for="unitaOrganizzativa in item.responsabile_unita_organizzative"
                                  :key="unitaOrganizzativa.id"
                                >
                                  {{ unitaOrganizzativa.titolo }}
                                </li>
                              </ul>
                            </div>
                            <div v-if="item.componente_unita_organizzative?.length" class="mb-2">
                              <ul class="list-comma-inline fs-6">
                                <strong>fa parte di: </strong>
                                <li
                                  v-for="unitaOrganizzativa in item.componente_unita_organizzative"
                                  :key="unitaOrganizzativa.id"
                                >
                                  {{ unitaOrganizzativa.titolo }}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </template>
                      </StrapiBlockPersonaCard>

                      <Card
                        v-else-if="query.index === 'incarico'"
                        title-class="h4"
                        class="border border-light shadow-sm no-after h-100 pb-0"
                      >
                        <template #category>
                          <StrapiSearchHighlight attr="tax_incarico_nome" :item="item" />
                        </template>
                        <template #title>
                          <NuxtLink
                            :to="`${settings.nav.amministrazione.routes.incarichi}/${item.slug}`"
                            class="text-decoration-none"
                          >
                            <StrapiSearchHighlight attr="titolo" :item="item" />
                          </NuxtLink>
                        </template>
                        <template #text>
                          <div v-if="item.unita_organizzativa" class="mb-3 ms-2">
                            <strong>presso: </strong>
                            <StrapiSearchHighlight attr="unita_organizzativa_titolo" :item="item" />
                          </div>
                          <div v-if="item.persona">
                            <Icon name="it-user" size="sm" class="me-1" />
                            <NuxtLink :to="`${settings.nav.amministrazione.routes.persone}/${item.persona.slug}`">
                              <StrapiSearchHighlight attr="persona_nome" :item="item" />
                            </NuxtLink>
                          </div>
                        </template>
                      </Card>
                    </CardWrapper>
                  </div>
                </template>

                <template #fallback>
                  <h2 class="h5 fw-bold text-secondary border-bottom">{{ query.label }}</h2>
                  <div class="py-3">Nessun risultato trovato</div>
                </template>
              </LazyStrapiSearchExtend>
            </div>
          </div>
        </StrapiSearch>
      </div>
    </section>
  </Page>
</template>

<style lang="scss" scoped>
:deep(.strapi-search) {
  .strapi-search-box {
    margin-bottom: 3rem;

    @include media-breakpoint-up(sm) {
      input[type='search'] {
        font-size: 1.7rem;
        height: 3.2rem;
        padding-left: 3rem;
      }

      button[type='submit'] {
        &,
        .icon {
          width: 30px;
          height: 30px;
        }
      }
    }

    @include media-breakpoint-up(md) {
      input[type='search'] {
        font-size: 2.2rem;
        height: 4rem;
        padding-left: 3.5rem;
      }

      button[type='submit'] {
        &,
        .icon {
          width: 35px;
          height: 35px;
        }
      }
    }
  }
}

.filters-wrapper {
  max-height: 90vh;
  overflow-y: auto;
  position: sticky;
  top: v-bind('headerHeightPx');
  z-index: 2;
}
</style>
