<script lang="ts" setup>
import type { Luogo } from '~/types/strapi';

const route = useRoute();
const { settings } = useConfigStore();

const query = ref({
  contentType: 'luoghi',
  singleEntry: true,
  dataT: {} as Luogo,
  params: {
    filters: {
      slug: route.params.slug,
      tax_luogo: {
        slug: route.params.taxonomy,
      },
    },
    populate: {
      argomenti: true,
      immagine: true,
      galleria: true,
      contatti: {
        populate: ['valori'],
      },
      costi: {
        populate: ['prezzi'],
      },
      unita_organizzativa: {
        fields: ['slug', 'titolo', 'descrizione'],
        populate: ['tax_unita_organizzativa', 'logo'],
      },
      luoghi_correlati: {
        fields: ['slug', 'nome', 'descrizione', 'indirizzo', 'indirizzo2', 'cap'],
        populate: ['tax_luogo'],
      },
      seo: {
        populate: ['metaImage', 'metaSocial'],
      },
    },
  },
});
</script>

<template>
  <StrapiFetch id="luogo" :find="query" fallback-error="404">
    <template #response="{ data }">
      <Page
        :title="data.nome"
        :description="data.descrizione"
        :published-at="data.publishedAt"
        :updated-at="data.updatedAt"
        :image="data.immagine?.url"
        :seo="data.seo"
      >
        <PageHeading
          :tags="data.argomenti"
          :media="!data.showImagePreviewOnly ? data.immagine : undefined"
          show-actions
          class="pb-3"
        >
          <h2 v-if="data.nome2" class="h4 text-muted">{{ data.nome2 }}</h2>
          <p class="subtitle-small" data-audio>{{ data.descrizione }}</p>
          <p v-if="data.identificativo"><strong>Codice Identificativo:</strong> {{ data.identificativo }}</p>
        </PageHeading>

        <PageContent font="sans-serif">
          <section v-if="data.galleria?.length" class="mb-4">
            <h2 class="h4 mb-0">Galleria</h2>

            <Carousel three-cols>
              <CarouselSlide v-for="image in data.galleria" :key="image.hash">
                <StrapiMedia :data="image" :img-attrs="{ class: 'img-fluid' }" />
              </CarouselSlide>
            </Carousel>
          </section>

          <LazyPageContentSection v-if="data.contenuto" title="Descrizione">
            <StrapiRichText :html="data.contenuto" />
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.indirizzo" title="Dove">
            <CardWrapper teaser-large>
              <Card title-class="h5 mb-1">
                <template #pre-body>
                  <Icon name="it-map-marker-circle" />
                </template>
                <template #text>
                  <p>
                    <span class="d-block">{{ data.indirizzo }} - {{ data.cap }}</span>
                    <span v-if="data.indirizzo2" class="d-block">{{ data.indirizzo2 }}</span>
                  </p>
                  <p v-if="data.quartiere ?? data.circoscrizione" class="mt-2">
                    <span class="d-block">{{ data.quartiere }}</span>
                    <span class="d-block">{{ data.circoscrizione }}</span>
                  </p>
                </template>
              </Card>
            </CardWrapper>
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.orari" title="Orari di apertura">
            <StrapiRichText :html="data.orari" />
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.costi" title="Costi">
            <StrapiListinoPrezzi :data="data.costi" />
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.accesso" title="Modalità di accesso">
            <StrapiRichText :html="data.accesso" />
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.contatti?.length || data.unita_organizzativa" title="Contatti">
            <div v-if="data.unita_organizzativa">
              <h3 class="h4 font-sans-serif">
                {{
                  data.unita_organizzativa.tax_unita_organizzativa?.slug === 'struttura-amministrativa_area'
                    ? 'Area amministrativa'
                    : 'Ufficio'
                }}
              </h3>

              <CardWrapper teaser-large>
                <Card title-class="h5 mb-1" border-left>
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
                      :unita-organizzativa="data.unita_organizzativa"
                      class="text-decoration-none"
                    />
                  </template>
                  <template #text>
                    <p class="mb-2">{{ data.unita_organizzativa.descrizione }}</p>
                  </template>
                </Card>
              </CardWrapper>
            </div>

            <CardWrapper v-if="data.contatti?.length" teaser-large>
              <Card>
                <StrapiContacts show-icon :contacts="data.contatti" />
              </Card>
            </CardWrapper>
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.luoghi_correlati?.length" title="Luoghi collegati">
            <CardWrapper teaser>
              <Card
                v-for="luogo in data.luoghi_correlati"
                :key="luogo.id"
                title-class="h5"
                class="shadow-sm border border-light"
              >
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

          <LazyPageContentSection v-if="data.info" title="Ulteriori informazioni">
            <StrapiRichText :html="data.info" />
          </LazyPageContentSection>
        </PageContent>
      </Page>
    </template>
  </StrapiFetch>
</template>
