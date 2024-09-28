<script lang="ts" setup>
import type { Notizia, TaxArgomento, UnitaOrganizzativa, Servizio, DocumentoPubblico, Luogo } from '~/types/strapi';

definePageMeta({
  layout: 'default-no-breadcrumb',
});

const route = useRoute();
const { settings } = useConfigStore();

const documentiPage = settings.nav.amministrazione.menu.find(
  ({ path }) => path === settings.nav.amministrazione.routes.documenti,
);
const novitaPage = settings.nav.novita;

const query = ref({
  contentType: 'argomenti',
  singleEntry: true,
  dataT: {} as TaxArgomento,
  params: {
    filters: {
      slug: route.params.slug,
    },
    populate: 'immagine',
  },
});

const unitaOrganizzativeQuery = ref({
  contentType: 'unita-organizzative',
  dataT: {} as Array<UnitaOrganizzativa>,
  params: {
    filters: {
      argomenti: {
        slug: route.params.slug,
      },
    },
    fields: ['slug', 'titolo', 'descrizione'],
    populate: ['tax_unita_organizzativa', 'logo'],
    sort: 'titolo',
  },
});

const serviziQuery = ref({
  index: 'servizio',
  itemT: {} as Servizio,
  filters: `argomenti_slug=${route.params.slug}`,
  sort: ['titolo:asc'],
  hideIfEmptyFetch: {
    contentType: 'servizi',
    params: {
      filters: {
        argomenti: {
          slug: route.params.slug,
        },
      },
    },
  },
});

const newsQuery = ref({
  index: 'notizia',
  itemT: {} as Notizia,
  filters: `argomenti_slug=${route.params.slug}`,
  sort: ['data:desc'],
  hideIfEmptyFetch: {
    contentType: 'notizie',
    params: {
      filters: {
        argomenti: {
          slug: route.params.slug,
        },
      },
    },
  },
});

const luoghiQuery = ref({
  index: 'luogo',
  itemT: {} as Luogo,
  filters: `argomenti_slug=${route.params.slug}`,
  sort: ['nome:asc'],
  hideIfEmptyFetch: {
    contentType: 'luoghi',
    params: {
      filters: {
        argomenti: {
          slug: route.params.slug,
        },
      },
    },
  },
});

const documentiQuery = ref({
  index: 'documento-pubblico',
  itemT: {} as DocumentoPubblico,
  filters: `argomenti_slug=${route.params.slug}`,
  sort: ['titolo:asc', 'data:desc'],
  hideIfEmptyFetch: {
    contentType: 'documenti-pubblici',
    params: {
      filters: {
        argomenti: {
          slug: route.params.slug,
        },
      },
    },
  },
});

function getDescription(argomento: TaxArgomento) {
  return argomento?.note ?? 'Servizi comunali, documenti, uffici, notizie ed eventi relativi a ' + argomento.nome;
}
</script>

<template>
  <StrapiFetch id="argomento" :find="query" fallback-error="404">
    <template #response="{ data }">
      <Page
        :title="data.nome"
        :description="getDescription(data)"
        :published-at="data.publishedAt"
        :updated-at="data.updatedAt"
        :image="data.immagine?.url"
      >
        <Hero overlapping-content class="it-wrapped-container">
          <template v-if="data.immagine" #img>
            <StrapiMedia :data="data.immagine" no-caption class="hero-img" />
          </template>

          <template #after>
            <section class="container">
              <div class="row">
                <div class="col-12">
                  <div class="it-hero-card it-hero-bottom-overlapping rounded shadow-sm p-4 p-lg-5 py-2">
                    <div class="row justify-content-center">
                      <div class="col-12">
                        <TheBreadcrumb class="my-0 pl-lg-5 mt-2 mt-lg-0" />
                      </div>
                    </div>

                    <div class="row justify-content-between mt-lg-2">
                      <div class="col-12 col-lg-5 pl-lg-5">
                        <h1 class="mb-3">{{ data.nome }}</h1>
                        <p class="text-secondary mb-5">
                          {{ getDescription(data) }}
                        </p>
                      </div>

                      <StrapiFetch
                        id="unita-organizzative"
                        :find="unitaOrganizzativeQuery"
                        no-fallback
                        class="col-12 col-lg-5"
                      >
                        <template #response="{ data: unitaOrganizzative }">
                          <h3 class="small fw-bold text-secondary">Questo argomento è gestito da:</h3>

                          <CardWrapper class="card-column">
                            <Card
                              v-for="unitaOrganizzativa in unitaOrganizzative"
                              :key="unitaOrganizzativa.id"
                              class="shadow-sm no-after d-flex flex-row align-items-center mx-0"
                              border-left
                              title-class="h5 mb-1"
                            >
                              <template #title>
                                <StrapiBlockUnitaOrganizzativaLink
                                  class="text-decoration-none"
                                  :unita-organizzativa="unitaOrganizzativa"
                                />
                              </template>
                              <template #text>{{ truncate(unitaOrganizzativa.descrizione, 30) }}</template>
                              <template v-if="unitaOrganizzativa.logo" #after-body>
                                <Avatar :title="unitaOrganizzativa.titolo" size="lg" class="px-3">
                                  <StrapiMedia
                                    :data="unitaOrganizzativa.logo"
                                    :simple-img="[80]"
                                    :img-attrs="{ alt: unitaOrganizzativa.titolo }"
                                    no-caption
                                  />
                                </Avatar>
                              </template>
                            </Card>
                          </CardWrapper>
                        </template>
                      </StrapiFetch>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </template>
        </Hero>

        <div class="search-results">
          <section class="section section-muted px-0 mt-3 mt-sm-5 mt-lg-4">
            <div class="container pt-5 mt-sm-5 mt-lg-0">
              <StrapiSearch id="servizi" :find="serviziQuery">
                <template #header>
                  <h2 class="pb-2 pb-lg-3 mt-lg-5">Servizi</h2>
                </template>

                <template #response="{ data: servizi }">
                  <div class="row g-4">
                    <CardWrapper v-for="servizio in servizi" :key="servizio.id" class="col-12 col-md-6 col-lg-4">
                      <Card title-class="h4" class="no-after border border-light shadow-sm">
                        <template #category>
                          <NuxtLink :to="`/servizi/${servizio.tax_servizio.slug}`" class="text-decoration-none">
                            <StrapiSearchHighlight attr="tax_servizio_nome" :item="servizio" />
                          </NuxtLink>
                        </template>
                        <template #title>
                          <NuxtLink
                            :to="`/servizi/${servizio.tax_servizio.slug}/${servizio.slug}`"
                            class="text-decoration-none"
                            data-element="service-link"
                          >
                            <StrapiSearchHighlight attr="titolo" :item="servizio" />
                          </NuxtLink>
                          <p v-if="servizio.accessoDigitale" class="my-0 py-0">
                            <Badge color="info">online</Badge>
                          </p>
                        </template>

                        <StrapiSearchHighlight v-if="servizio?.descrizione" attr="descrizione" :item="servizio" />
                      </Card>
                    </CardWrapper>
                  </div>
                </template>

                <template #footer>
                  <div class="d-flex justify-content-end m-2">
                    <Button to="/servizi" color="primary" class="show-all-btn">Tutti i servizi</Button>
                  </div>
                </template>
              </StrapiSearch>
            </div>
          </section>

          <StrapiSearch id="novita" :find="newsQuery" on="section" class="section" search-class="container py-5">
            <template #header>
              <h2 class="pb-2 pb-lg-3">Novità</h2>
            </template>

            <template #response="{ data: news }">
              <div class="row g-4">
                <CardWrapper v-for="notizia in news" :key="notizia.id" class="col-12 col-md-6 col-lg-4">
                  <Card
                    class="border border-light shadow-sm"
                    :date="notizia.data"
                    :category="notizia.tax_notizia.nome"
                    img-panoramic
                  >
                    <template v-if="notizia.immagine" #img>
                      <StrapiMedia :data="notizia.immagine" :simple-img="[800]" />
                    </template>
                    <template #category>
                      <NuxtLink :to="getTaxPath(novitaPage.menu, notizia.tax_notizia)" class="text-decoration-none">
                        <StrapiSearchHighlight attr="tax_notizia_nome" :item="notizia" />
                      </NuxtLink>
                    </template>
                    <template #title>
                      <NuxtLink
                        :to="`${getTaxPath(novitaPage.menu, notizia.tax_notizia)}/${notizia.slug}`"
                        class="text-decoration-none"
                      >
                        <StrapiSearchHighlight attr="titolo" :item="notizia" />
                      </NuxtLink>
                    </template>
                    <template #text>
                      <p class="font-sans-serif fs-6">
                        <StrapiSearchHighlight v-if="notizia?.descrizione" attr="descrizione" :item="notizia" />
                      </p>
                    </template>
                  </Card>
                </CardWrapper>
              </div>
            </template>
            <template #fallback>
              <div class="p-4 text-center">Nessuna novità trovata</div>
            </template>

            <template #footer>
              <div class="d-flex justify-content-end m-2">
                <Button to="/novita" color="primary" class="show-all-btn">Tutte le novità</Button>
              </div>
            </template>
          </StrapiSearch>

          <StrapiSearch id="luoghi" :find="luoghiQuery" on="section" class="section" search-class="container py-5">
            <template #header>
              <h2 class="pb-2 pb-lg-3">Luoghi</h2>
            </template>

            <template #response="{ data: luoghi }">
              <div class="row g-4">
                <CardWrapper v-for="luogo in luoghi" :key="luogo.id" class="col-12 col-md-6 col-lg-4">
                  <Card class="border border-light shadow-sm" img-panoramic>
                    <template v-if="luogo.immagine" #img>
                      <StrapiMedia :data="luogo.immagine" :simple-img="[800]" />
                    </template>
                    <template #category>
                      <NuxtLink
                        :to="`${settings.nav.vivereIlComune.routes.luoghi}/${luogo.tax_luogo.slug}`"
                        class="text-decoration-none"
                      >
                        <StrapiSearchHighlight attr="tax_luogo_nome" :item="luogo" />
                      </NuxtLink>
                    </template>
                    <template #title>
                      <NuxtLink
                        :to="`${settings.nav.vivereIlComune.routes.luoghi}/${luogo.tax_luogo.slug}/${luogo.slug}`"
                        class="text-decoration-none"
                      >
                        <StrapiSearchHighlight attr="nome" :item="luogo" />
                      </NuxtLink>
                    </template>

                    <template #text>
                      <StrapiSearchHighlight v-if="luogo?.descrizione" attr="descrizione" :item="luogo" />
                    </template>
                  </Card>
                </CardWrapper>
              </div>
            </template>

            <template #footer>
              <div class="d-flex justify-content-end m-2">
                <Button :to="settings.nav.vivereIlComune.routes.luoghi" color="primary" class="show-all-btn">
                  Tutti i luoghi
                </Button>
              </div>
            </template>
          </StrapiSearch>

          <StrapiSearch
            v-if="documentiPage"
            id="luoghi"
            :find="documentiQuery"
            on="section"
            class="section"
            search-class="container py-5"
          >
            <template #header>
              <h2 class="pb-2 pb-lg-3">Documenti</h2>
            </template>

            <template #response="{ data: documenti }">
              <div class="row g-4">
                <CardWrapper v-for="documento in documenti" :key="documento.id" class="col-12 col-md-6 col-lg-4">
                  <Card title-class="h4" class="no-after border border-light shadow-sm">
                    <template #category>
                      <NuxtLink
                        :to="getTaxPath(documentiPage?.menu, documento.tax_documento)"
                        class="text-decoration-none"
                      >
                        <StrapiSearchHighlight attr="tax_documento_nome" :item="documento" />
                      </NuxtLink>
                    </template>
                    <template #title>
                      <NuxtLink
                        :to="`${getTaxPath(documentiPage?.menu, documento.tax_documento)}/${documento.slug}`"
                        class="text-decoration-none"
                      >
                        <StrapiSearchHighlight attr="titolo" :item="documento" />
                      </NuxtLink>
                    </template>

                    <StrapiSearchHighlight v-if="documento?.descrizione" attr="descrizione" :item="documento" />
                  </Card>
                </CardWrapper>
              </div>
            </template>

            <template #footer>
              <div class="d-flex justify-content-end m-2">
                <Button :to="documentiPage?.path" color="primary" class="show-all-btn">Tutti i documenti</Button>
              </div>
            </template>
          </StrapiSearch>
        </div>
      </Page>
    </template>
  </StrapiFetch>
</template>

<style lang="scss" scoped>
.hero-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.search-results {
  .section:first-child {
    background-color: $color-background-muted;
  }

  .show-all-btn {
    font-size: 1rem;
  }
}

:deep(.show-all-btn) {
  @include media-breakpoint-down(md) {
    display: block;
    width: 100%;
  }
}
</style>
