<script lang="ts" setup>
import type { UnitaOrganizzativa, Incarico, Persona } from '~/types/strapi';

const { settings } = useConfigStore();
const route = useRoute();

const page = settings.nav.amministrazione.menu.find(({ path }) => path === route.matched[0].path);
if (!page) showError({ statusCode: 404 });

const personeRoutePath = settings.nav.amministrazione.routes.persone + '/';

const { data: sindaco } = await useStrapiFetch<Persona>('sindaco', {
  contentType: 'incarichi',
  singleEntry: true,
  params: {
    filters: {
      slug: 'sindaco',
    },
    fields: ['dataInizio'],
    populate: {
      persona: {
        fields: ['slug', 'nome', 'cognome'],
        populate: ['immagine'],
      },
    },
  },
  transform: (incarico: Incarico) => incarico?.persona,
});

const { data: organiDiGoverno } = await useStrapiFetch<Array<UnitaOrganizzativa>>('organiDiGoverno', {
  contentType: 'unita-organizzative',
  params: {
    filters: {
      slug: {
        $in: ['consiglio-comunale', 'giunta-comunale'],
      },
    },
    fields: ['slug', 'titolo', 'descrizione'],
    sort: 'titolo',
  },
});

const commissioniQuery = ref({
  contentType: 'unita-organizzative',
  dataT: {} as Array<UnitaOrganizzativa>,
  params: {
    filters: {
      tax_unita_organizzativa: {
        slug: 'struttura-politica_commissione',
      },
    },
    fields: ['slug', 'titolo', 'descrizione'],
    populate: ['logo'],
    sort: 'titolo',
  },
  pagination: {
    pageSize: 3,
    pageParam: 'p1',
  },
});

const consulteQuery = ref({
  contentType: 'unita-organizzative',
  dataT: {} as Array<UnitaOrganizzativa>,
  params: {
    filters: {
      tax_unita_organizzativa: {
        slug: 'struttura-politica_consulta',
      },
    },
    fields: ['slug', 'titolo', 'descrizione'],
    populate: ['tax_unita_organizzativa', 'logo'],
    sort: 'titolo',
  },
  pagination: {
    pageSize: 3,
    pageParam: 'p2',
  },
});
</script>

<template>
  <Page :title="page?.name" :description="page?.description">
    <PageHeading :nav="settings.nav.amministrazione" class="pb-3" />

    <section class="page-section">
      <div class="container">
        <div class="row g-4 mb-5">
          <CardWrapper v-if="sindaco" class="col-md-12 col-lg-4 px-lg-3 pb-lg-3">
            <Card
              class="shadow-sm border border-light"
              big
              title-class="h5"
              label-icon="it-user"
              label="Politici"
              :read-more-link="personeRoutePath + sindaco.slug"
            >
              <template #heading>
                <LazyAvatar
                  v-if="sindaco?.immagine"
                  :to="personeRoutePath + sindaco.slug"
                  :title="`${sindaco.cognome} ${sindaco.nome}`"
                  size="lg"
                  class="heading-avatar"
                >
                  <StrapiMedia
                    :simple-img="[80]"
                    :data="sindaco?.immagine"
                    :img-attrs="{ alt: `${sindaco.cognome} ${sindaco.nome}` }"
                    no-caption
                  />
                </LazyAvatar>
              </template>
              <template #title>
                <NuxtLink :to="personeRoutePath + sindaco.slug" class="text-decoration-none">
                  Sindaco - {{ sindaco.cognome }} {{ sindaco.nome }}
                </NuxtLink>
              </template>
              <template #text>
                <div class="font-sans-serif">
                  Il sindaco è capo dell’amministrazione comunale e ufficiale di governo.
                </div>
              </template>
            </Card>
          </CardWrapper>

          <CardWrapper
            v-for="organoDiGoverno in organiDiGoverno"
            :key="organoDiGoverno.id"
            class="col-md-12 col-lg-4 px-lg-3 pb-lg-3"
          >
            <Card
              class="shadow-sm border border-light"
              big
              title-class="h5"
              label="Organi di governo"
              label-icon="it-pa"
              :read-more-link="`${$route.path}/${organoDiGoverno.slug}`"
            >
              <template #title>
                <NuxtLink :to="`${$route.path}/${organoDiGoverno.slug}`" class="text-decoration-none">
                  {{ organoDiGoverno.titolo }}
                </NuxtLink>
              </template>
              <template #text>
                <div class="font-sans-serif">
                  <p class="mb-2">{{ organoDiGoverno.descrizione }}</p>
                </div>
              </template>
            </Card>
          </CardWrapper>
        </div>
      </div>
    </section>

    <StrapiFetch id="commissioni" on="section" :find="commissioniQuery" no-fallback class="page-section pt-5 pb-4">
      <template #response="{ data: commissioni }">
        <div class="container">
          <h2 class="h3 mb-4 text-black">Commissioni Consiliari</h2>
          <div class="row g-4 py-4">
            <CardWrapper
              v-for="commissione in commissioni"
              :key="commissione.id"
              class="col-md-6 col-lg-4 px-lg-3 pb-lg-3 my-0"
              teaser-large
            >
              <Card class="shadow-sm border border-light my-0" title-class="h5">
                <template #pre-body>
                  <Avatar v-if="commissione.logo" :title="commissione.titolo" size="lg" class="me-3">
                    <StrapiMedia
                      :data="commissione.logo"
                      :simple-img="[80]"
                      :img-attrs="{ alt: commissione.titolo }"
                      no-caption
                    />
                  </Avatar>
                  <Icon v-else name="it-pa" />
                </template>
                <template #title>
                  <NuxtLink :to="`${$route.path}/commissioni/${commissione.slug}`" class="text-decoration-none">
                    {{ commissione.titolo }}
                  </NuxtLink>
                </template>
                <template #text>
                  {{ commissione.descrizione }}
                </template>
              </Card>
            </CardWrapper>
          </div>
        </div>
      </template>
    </StrapiFetch>

    <StrapiCollectionGruppiConsiliari on="section" wrapper-class="page-section py-5" />

    <StrapiFetch id="consulte" :find="consulteQuery" on="section" no-fallback class="page-section pt-5 pb-4">
      <template #response="{ data: consulte }">
        <div class="container">
          <h2 class="h3 mb-4 text-black">Consulte</h2>
          <div class="row g-4 py-4">
            <CardWrapper
              v-for="consulta in consulte"
              :key="consulta.id"
              class="col-md-6 col-lg-4 px-lg-3 pb-lg-3 my-0"
              teaser-large
            >
              <Card class="shadow-sm border border-light my-0" title-class="h5">
                <template #pre-body>
                  <Avatar v-if="consulta.logo" :title="consulta.titolo" size="lg" class="me-3">
                    <StrapiMedia
                      :data="consulta.logo"
                      :simple-img="[80]"
                      :img-attrs="{ alt: consulta.titolo }"
                      no-caption
                    />
                  </Avatar>
                  <Icon v-else name="it-pa" />
                </template>
                <template #title>
                  <NuxtLink :to="`${$route.path}/consulte/${consulta.slug}`" class="text-decoration-none">
                    {{ consulta.titolo }}
                  </NuxtLink>
                </template>
                <template #text>
                  {{ consulta.descrizione }}
                </template>
              </Card>
            </CardWrapper>
          </div>
        </div>
      </template>
    </StrapiFetch>
  </Page>
</template>

<style lang="scss" scoped>
:deep(.card .heading-avatar) {
  position: absolute;
  left: 48px;
  top: 25px;
  justify-content: flex-start;
}
</style>
