<script lang="ts" setup>
import type { Persona, UnitaOrganizzativa } from '~/types/strapi';

const { settings } = useConfigStore();
const route = useRoute();

const page = settings.nav.amministrazione.menu.find(({ path }) => path === route.matched[0].path);
if (!page) showError({ statusCode: 404 });

const dirigentiQuery = ref({
  contentType: 'persone',
  dataT: {} as Array<Persona>,
  params: {
    filters: {
      responsabile_unita_organizzative: {
        tax_unita_organizzativa: {
          slug: 'struttura-amministrativa_area',
        },
      },
    },
    sort: ['cognome', 'nome'],
    populate: {
      responsabile_unita_organizzative: {
        fields: ['slug', 'titolo'],
        populate: ['tax_unita_organizzativa', 'unita_organizzativa_padre'],
      },
      contatti: {
        populate: ['valori'],
      },
    },
  },
  pagination: {
    pageSize: 6,
    pageParam: 'p1',
  },
});

const responsabiliQuery = ref({
  contentType: 'persone',
  dataT: {} as Array<Persona>,
  params: {
    filters: {
      responsabile_unita_organizzative: {
        tax_unita_organizzativa: {
          slug: {
            $startsWith: 'struttura-amministrativa',
            $ne: 'struttura-amministrativa_area',
          },
        },
      },
    },
    sort: ['cognome', 'nome'],
    populate: {
      responsabile_unita_organizzative: {
        fields: ['slug', 'titolo'],
        populate: ['tax_unita_organizzativa', 'unita_organizzativa_padre'],
      },
      contatti: {
        populate: ['valori'],
      },
    },
  },
  pagination: {
    pageSize: 6,
    pageParam: 'p2',
  },
});

const impiegatiQuery = ref({
  contentType: 'persone',
  dataT: {} as Array<Persona>,
  params: {
    filters: {
      componente_unita_organizzative: {
        tax_unita_organizzativa: {
          slug: {
            $startsWith: 'struttura-amministrativa',
          },
        },
      },
    },
    sort: ['cognome', 'nome'],
    populate: {
      componente_unita_organizzative: {
        fields: ['slug', 'titolo'],
        populate: ['tax_unita_organizzativa'],
      },
    },
  },
  pagination: {
    pageSize: 6,
    pageParam: 'p3',
  },
});

function filterStruttureAmministrative(strutture?: Array<UnitaOrganizzativa>) {
  if (!strutture?.length) return [];
  return strutture.filter(({ tax_unita_organizzativa: tax }) => tax?.slug.startsWith('struttura-amministrativa'));
}
</script>

<template>
  <Page :title="page?.name" :description="page?.description">
    <PageHeading :nav="settings.nav.amministrazione" class="drop-shadow pb-4">
      <p class="subtitle-small" data-audio>{{ page?.description }}</p>

      <Button :to="settings.nav.amministrazione.routes.persone" color="primary" outline icon>
        <Icon name="it-search" color="primary" class="me-1" />
        <span>Cerca dall'elenco delle persone</span>
      </Button>
    </PageHeading>

    <StrapiFetch id="dirigenti" :find="dirigentiQuery" no-fallback on="section" class="page-section py-5">
      <template #response="{ data: dirigenti }">
        <div class="container">
          <h2 class="h3 mb-4 text-black">Dirigenti</h2>

          <div class="row g-4">
            <CardWrapper
              v-for="persona in dirigenti"
              :key="persona.id"
              teaser-large
              class="col-md-6 col-lg-4 px-lg-3 mt-0 mb-3 pb-3"
            >
              <StrapiBlockPersonaCard :persona="persona" class="shadow-sm border border-light no-after h-100 pb-0">
                <template #text>
                  <div class="mb-3">
                    <ul class="list-comma-inline fs-6">
                      <strong>presso: </strong>
                      <li
                        v-for="unitaOrganizzativa in filterStruttureAmministrative(
                          persona.responsabile_unita_organizzative,
                        )"
                        :key="unitaOrganizzativa.id"
                      >
                        <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="unitaOrganizzativa" />
                      </li>
                    </ul>
                  </div>
                </template>
              </StrapiBlockPersonaCard>
            </CardWrapper>
          </div>
        </div>
      </template>
    </StrapiFetch>

    <StrapiFetch id="responsabili" :find="responsabiliQuery" no-fallback on="section" class="page-section py-5">
      <template #response="{ data: responsabili }">
        <div class="container">
          <h2 class="h3 mb-4 text-black">Responsabili</h2>

          <div class="row g-4">
            <CardWrapper
              v-for="persona in responsabili"
              :key="persona.id"
              teaser-large
              class="col-md-6 col-lg-4 px-lg-3 mt-0 mb-3 pb-3"
            >
              <StrapiBlockPersonaCard :persona="persona" class="shadow-sm border border-light no-after h-100 pb-0">
                <template #text>
                  <div class="mb-3">
                    <ul class="list-comma-inline fs-6">
                      <strong>presso: </strong>
                      <li
                        v-for="unitaOrganizzativa in filterStruttureAmministrative(
                          persona.responsabile_unita_organizzative,
                        )"
                        :key="unitaOrganizzativa.id"
                      >
                        <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="unitaOrganizzativa" />
                      </li>
                    </ul>
                  </div>
                </template>
              </StrapiBlockPersonaCard>
            </CardWrapper>
          </div>
        </div>
      </template>
    </StrapiFetch>

    <StrapiFetch
      id="impiegati"
      :find="impiegatiQuery"
      no-fallback
      on="section"
      class="page-section py-5"
      aria-describedby="impiegati-titolo"
    >
      <template #response="{ data: impiegati }">
        <div class="container">
          <h2 id="impiegati-titolo" class="h3 mb-4 text-black">Impiegati</h2>

          <div class="row g-4">
            <CardWrapper
              v-for="persona in impiegati"
              :key="persona.id"
              teaser-large
              class="col-md-6 col-lg-4 px-lg-3 mt-0 mb-3 pb-3"
            >
              <StrapiBlockPersonaCard :persona="persona" class="shadow-sm border border-light no-after h-100 pb-1">
                <template #text>
                  <ul class="list-comma-inline fs-6">
                    <strong>presso: </strong>
                    <li
                      v-for="unitaOrganizzativa in filterStruttureAmministrative(
                        persona.componente_unita_organizzative,
                      )"
                      :key="unitaOrganizzativa.id"
                    >
                      <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="unitaOrganizzativa" />
                    </li>
                  </ul>
                </template>
              </StrapiBlockPersonaCard>
            </CardWrapper>
          </div>
        </div>
      </template>
    </StrapiFetch>
  </Page>
</template>
