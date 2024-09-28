<script lang="ts" setup>
import type { Notizia } from '~/types/strapi';

const route = useRoute();

const { settings } = useConfigStore();
const taxPage = settings.nav.novita.menu?.find(
  ({ path }) => path === route.path.substring(0, route.path.lastIndexOf('/')),
);
if (!taxPage) showError({ statusCode: 404 });

const documentiPage = settings.nav.amministrazione.menu.find(
  ({ path }) => path === settings.nav.amministrazione.routes.documenti,
);

const query = ref({
  contentType: 'notizie',
  singleEntry: true,
  dataT: {} as Notizia,
  params: {
    filters: {
      slug: route.params.slug,
      tax_notizia: {
        slug: taxPage?.taxonomySlug,
      },
    },
    populate: {
      argomenti: true,
      immagine: true,
      galleria: true,
      persone: true,
      luoghi: {
        fields: ['slug', 'nome', 'descrizione', 'indirizzo', 'indirizzo2', 'cap'],
        populate: ['tax_luogo'],
      },
      unita_organizzativa: {
        fields: ['slug', 'titolo', 'descrizione'],
        populate: ['tax_unita_organizzativa', 'logo'],
      },
      allegati: {
        fields: ['slug', 'titolo', 'descrizione'],
        populate: ['files', 'tax_documento'],
      },
      datasets: {
        fields: ['slug', 'titolo', 'descrizione'],
      },
      seo: {
        populate: ['metaImage', 'metaSocial'],
      },
    },
  },
});
</script>

<template>
  <StrapiFetch id="notizia" :find="query" fallback-error="404">
    <template #response="{ data }">
      <Page
        :title="data.titolo"
        :description="data.descrizione"
        :published-at="data.data"
        :updated-at="data.updatedAt"
        :image="data.immagine?.url"
        :seo="data.seo"
      >
        <PageHeading
          :tags="data.argomenti"
          :media="!data.showImagePreviewOnly ? data.immagine : undefined"
          :word-count-inside="data.contenuto"
          show-date
          show-actions
        >
          <p class="subtitle-small" data-audio>{{ data.descrizione }}</p>
          <p v-if="data.numeroComunicato">
            <strong>Comunicato stampa N. {{ data.numeroComunicato }}</strong>
          </p>
        </PageHeading>

        <PageContent>
          <PageContentSection title="Descrizione" hide-title>
            <article class="pt-3" data-audio>
              <StrapiRichText :html="data.contenuto" />
            </article>
          </PageContentSection>

          <LazyPageContentSection v-if="data.galleria?.length" class="mb-4" title="Galleria">
            <Carousel three-cols>
              <CarouselSlide v-for="image in data.galleria" :key="image.hash">
                <StrapiMedia :data="image" :img-attrs="{ class: 'img-fluid' }" />
              </CarouselSlide>
            </Carousel>
          </LazyPageContentSection>

          <LazyPageContentSection
            v-if="data.unita_organizzativa || data.persone?.length"
            title="A cura di"
            font="sans-serif"
          >
            <div class="row">
              <div v-if="data.unita_organizzativa" :class="['col-12', { 'col-sm-8 col-xl-6': data.persone?.length }]">
                <CardWrapper teaser-large>
                  <Card class="shadow-sm" title-class="h5 mb-1" border-left>
                    <template #pre-body>
                      <Avatar
                        v-if="data.unita_organizzativa.logo"
                        :title="data.unita_organizzativa.titolo"
                        size="lg"
                        class="me-3"
                      >
                        <StrapiMedia
                          :data="data.unita_organizzativa.logo"
                          :simple-img="[80]"
                          :img-attrs="{ alt: data.unita_organizzativa.titolo }"
                          no-caption
                        />
                      </Avatar>
                      <Icon v-else name="it-pa" />
                    </template>
                    <template #title>
                      <StrapiBlockUnitaOrganizzativaLink
                        class="text-decoration-none"
                        :unita-organizzativa="data.unita_organizzativa"
                      />
                    </template>
                    <template #text>{{ data.unita_organizzativa.descrizione }}</template>
                  </Card>
                </CardWrapper>
              </div>

              <div v-if="data.persone?.length" :class="['col-12', { 'col-sm-4 col-xl-6': data.unita_organizzativa }]">
                <h3 class="h6">Persone</h3>

                <ul class="d-flex flex-wrap gap-1 mt-2 list-inline font-sans-serif">
                  <li v-for="persona in data.persone" :key="persona.id">
                    <Chip
                      :label="`${persona.cognome} ${persona.nome}`"
                      :to="`${settings.nav.amministrazione.routes.persone}/${persona.slug}`"
                      color="primary"
                      simple
                    />
                  </li>
                </ul>
              </div>
            </div>
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.luoghi?.length" title="Luoghi">
            <CardWrapper teaser>
              <Card v-for="luogo in data.luoghi" :key="luogo.id" title-class="h5" class="shadow-sm border border-light">
                <template #title>
                  <Icon name="it-map-marker-circle" class="me-2" />
                  <NuxtLink
                    :to="`${settings.nav.vivereIlComune.routes.luoghi}/${luogo.tax_luogo.slug}/${luogo.slug}`"
                    class="text-decoration-none"
                  >
                    {{ luogo.nome }}
                  </NuxtLink>
                </template>
                <template #text>
                  <div class="ms-2">
                    <p class="text-muted mb-3">
                      {{ luogo.descrizione }}
                    </p>
                    <p>
                      <span class="d-block">{{ luogo.indirizzo }} - {{ luogo.cap }}</span>
                      <span v-if="luogo.indirizzo2" class="d-block">
                        {{ luogo.indirizzo2 }}
                      </span>
                    </p>
                    <p class="mt-3 mb-0">
                      <NuxtLink
                        :to="`${settings.nav.vivereIlComune.routes.luoghi}/${luogo.tax_luogo.slug}/${luogo.slug}`"
                      >
                        Ulteriori dettagli
                      </NuxtLink>
                    </p>
                  </div>
                </template>
              </Card>
            </CardWrapper>
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.allegati?.length && documentiPage?.menu" title="Documenti">
            <CardWrapper teaser>
              <Card
                v-for="documento in data.allegati"
                :key="documento.id"
                class="border border-light shadow-sm p-3"
                title-class="h6"
              >
                <template #pre-body><Icon name="it-file" /></template>
                <template #title>
                  <NuxtLink :to="`${getTaxPath(documentiPage.menu, documento.tax_documento)}/${documento.slug}`">
                    {{ documento.titolo }}
                  </NuxtLink>
                </template>
                <template #text>
                  <p v-if="documento.descrizione" class="pb-2">{{ documento.descrizione }}</p>
                  <StrapiMedia :data="documento.files[0]" title="Scarica il file" />
                </template>
              </Card>
            </CardWrapper>
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.datasets?.length" title="Dataset">
            <CardWrapper teaser>
              <Card
                v-for="dataset in data.datasets"
                :key="dataset.id"
                class="border border-light shadow-sm p-3"
                title-class="h6"
              >
                <template #pre-body><Icon name="it-chart-line" /></template>
                <template #title>
                  <NuxtLink
                    :to="`${settings.nav.amministrazione.routes.documenti}/dataset/${dataset.slug}`"
                    class="text-decoration-none"
                  >
                    {{ dataset.titolo }}
                  </NuxtLink>
                </template>
                <template v-if="dataset.descrizione" #text>
                  <p>{{ dataset.descrizione }}</p>
                </template>
              </Card>
            </CardWrapper>
          </LazyPageContentSection>
        </PageContent>
      </Page>
    </template>
  </StrapiFetch>
</template>
