<script lang="ts" setup>
import type { Evento } from '~/types/strapi';

const route = useRoute();
const { settings } = useConfigStore();

const query = {
  contentType: 'eventi',
  singleEntry: true,
  dataT: {} as Evento,
  params: {
    filters: {
      slug: route.params.slug,
      tax_evento: {
        slug: route.params.taxonomy,
      },
    },
    populate: {
      argomenti: true,
      tax_evento: true,
      immagine: true,
      partecipanti: {
        fields: ['slug', 'nome', 'cognome'],
      },
      galleria: true,
      timeline: {
        populate: ['date', 'periodi'],
      },
      costi: {
        populate: ['prezzi'],
      },
      luoghi: {
        fields: ['slug', 'nome', 'descrizione', 'indirizzo', 'indirizzo2', 'cap'],
        populate: ['tax_luogo'],
      },
      allegati: true,
      contatti: {
        populate: ['valori'],
      },
      unita_organizzative: {
        fields: ['slug', 'titolo', 'descrizione'],
        populate: ['tax_unita_organizzativa', 'logo'],
      },
      evento_padre: {
        fields: ['slug', 'titolo', 'descrizione', 'dataInizio', 'dataFine'],
        populate: ['immagine', 'tax_evento'],
      },
      eventi_figli: {
        fields: ['slug', 'titolo', 'descrizione', 'dataInizio', 'dataFine'],
        populate: ['immagine', 'tax_evento'],
      },
      seo: {
        populate: ['metaImage', 'metaSocial'],
      },
    },
  },
};
</script>

<template>
  <StrapiFetch id="evento" :find="query" fallback-error="404">
    <template #response="{ data }">
      <Page
        :title="data.titolo"
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
          <h2 v-if="data.sottotitolo" class="h4 text-muted">{{ data.sottotitolo }}</h2>
          <h3 v-if="data.dataInizio" class="h5 pt-2">
            <Icon name="it-calendar" size="sm" color="info" />
            {{
              eventHasMoreDays(data)
                ? `dal ${formatDate(data.dataInizio)} al ${formatDate(data.dataFine)}`
                : formatDate(data.dataInizio)
            }}
          </h3>
          <p class="subtitle-small" data-audio>{{ data.descrizione }}</p>
        </PageHeading>

        <PageContent>
          <LazyPageContentSection v-if="data.contenuto" title="Cos'è">
            <StrapiRichText :html="data.contenuto" />
          </LazyPageContentSection>

          <section v-if="data.partecipanti?.length" class="mb-4">
            <h2 class="h4 pb-2">Parteciperanno</h2>

            <ul class="d-flex flex-wrap gap-1 mt-2 list-inline font-sans-serif">
              <li v-for="partecipante in data.partecipanti" :key="partecipante.id">
                <Chip
                  :label="`${partecipante.cognome} ${partecipante.nome}`"
                  :to="`${settings.nav.amministrazione.routes.persone}/${partecipante.slug}`"
                  color="primary"
                  simple
                />
              </li>
            </ul>
          </section>

          <section v-if="data.galleria?.length" class="mb-4">
            <h2 class="h4 mb-0">Galleria</h2>

            <Carousel three-cols>
              <CarouselSlide v-for="image in data.galleria" :key="image.hash">
                <StrapiMedia :data="image" :img-attrs="{ class: 'img-fluid' }" />
              </CarouselSlide>
            </Carousel>
          </section>

          <LazyPageContentSection v-if="data.perChi" title="A chi è rivolto">
            <StrapiRichText :html="data.perChi" />
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.luoghi?.length" title="Dove">
            <CardWrapper :teaser-large="data.luoghi.length == 1" :teaser="data.luoghi.length > 1">
              <Card v-for="luogo in data.luoghi" :key="luogo.id" title-class="h5">
                <template #pre-body><Icon name="it-map-marker-circle" color="primary" /></template>
                <template #title>
                  <NuxtLink
                    :to="`${settings.nav.vivereIlComune.routes.luoghi}/${luogo.tax_luogo.slug}/${luogo.slug}`"
                    class="text-decoration-none"
                  >
                    {{ luogo.nome }}
                  </NuxtLink>
                </template>
                <template #text>
                  <p class="text-muted mb-3">
                    {{ luogo.descrizione }}
                  </p>
                  <p>
                    <span class="d-block">{{ luogo.indirizzo }} - {{ luogo.cap }}</span>
                    <span v-if="luogo.indirizzo2" class="d-block">
                      {{ luogo.indirizzo2 }}
                    </span>
                  </p>
                  <p class="mt-3">
                    <NuxtLink
                      :to="`${settings.nav.vivereIlComune.routes.luoghi}/${luogo.tax_luogo.slug}/${luogo.slug}`"
                    >
                      Ulteriori dettagli
                    </NuxtLink>
                  </p>
                </template>
              </Card>
            </CardWrapper>
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.timeline" title="Date e orari">
            <StrapiTimeline :data="data.timeline" />
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.costi" title="Costi">
            <StrapiListinoPrezzi :data="data.costi" />
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.allegati?.length" title="Allegati">
            <CardWrapper teaser>
              <Card
                v-for="file in data.allegati"
                :key="file.hash"
                class="p-3 shadow-sm border border-light"
                title-class="h6 mb-0"
              >
                <template #pre-body>
                  <Icon name="it-clip" />
                </template>
                <template #title>
                  <StrapiMedia :data="file" :file-link-attrs="{ class: 'text-decoration-none' }" info-after />
                </template>
              </Card>
            </CardWrapper>
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.evento_padre" title="Evento principale">
            <CardWrapper class="pt-3">
              <Card
                img-panoramic
                :date="data.evento_padre.dataInizio"
                :date-end="eventHasMoreDays(data.evento_padre) ? data.evento_padre.dataFine : undefined"
                :read-more-link="`${settings.nav.vivereIlComune.routes.eventi}/${data.evento_padre.tax_evento.slug}/${data.evento_padre.slug}`"
                read-more-label="Leggi di più"
              >
                <template v-if="data.evento_padre.immagine" #img>
                  <StrapiMedia :data="data.evento_padre.immagine" :simple-img="[800]" />
                </template>
                <template #category>
                  <NuxtLink
                    :to="`${settings.nav.vivereIlComune.routes.eventi}/${data.evento_padre.tax_evento.slug}`"
                    class="text-decoration-none"
                  >
                    {{ data.evento_padre.tax_evento.nome }}
                  </NuxtLink>
                </template>
                <template #title>
                  <NuxtLink
                    :to="`${settings.nav.vivereIlComune.routes.eventi}/${data.evento_padre.tax_evento.slug}/${data.evento_padre.slug}`"
                    class="text-decoration-none"
                  >
                    {{ data.evento_padre.titolo }}
                  </NuxtLink>
                </template>
                <template #text>{{ data.evento_padre.descrizione }}</template>
              </Card>
            </CardWrapper>
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.eventi_figli?.length" title="Appuntamenti">
            <div class="row g-3 pt-3">
              <CardWrapper v-for="evento in data.eventi_figli" :key="evento.id" class="col-12 col-lg-6">
                <Card
                  img-panoramic
                  :date="evento.dataInizio"
                  :date-end="eventHasMoreDays(evento) ? evento.dataFine : undefined"
                  :read-more-link="`${settings.nav.vivereIlComune.routes.eventi}/${evento.tax_evento.slug}/${evento.slug}`"
                  read-more-label="Leggi di più"
                  class="shadow-sm border border-light"
                >
                  <template v-if="evento.immagine" #img>
                    <StrapiMedia :data="evento.immagine" :simple-img="[800]" />
                  </template>
                  <template #category>
                    <NuxtLink
                      :to="`${settings.nav.vivereIlComune.routes.eventi}/${evento.tax_evento.slug}`"
                      class="text-decoration-none"
                    >
                      {{ evento.tax_evento.nome }}
                    </NuxtLink>
                  </template>
                  <template #title>
                    <NuxtLink
                      :to="`${settings.nav.vivereIlComune.routes.eventi}/${evento.tax_evento.slug}/${evento.slug}`"
                      class="text-decoration-none"
                    >
                      {{ evento.titolo }}
                    </NuxtLink>
                  </template>
                  <template #text>{{ evento.descrizione }}</template>
                </Card>
              </CardWrapper>
            </div>
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.contatti?.length" title="Contatti" font="sans-serif">
            <CardWrapper teaser-large>
              <Card>
                <StrapiContacts show-icon :contacts="data.contatti" />
              </Card>
            </CardWrapper>

            <section v-if="data.unita_organizzative?.length">
              <h3 class="h4 mt-3">Con il supporto di:</h3>

              <CardWrapper teaser>
                <Card
                  v-for="unitaOrganizzativa in data.unita_organizzative"
                  :key="unitaOrganizzativa.id"
                  title-class="h5"
                  class="shadow-sm border border-light"
                >
                  <template #pre-body>
                    <Avatar v-if="unitaOrganizzativa.logo" :title="unitaOrganizzativa.titolo" size="lg" class="me-3">
                      <StrapiMedia
                        :data="unitaOrganizzativa.logo"
                        :simple-img="[80]"
                        :img-attrs="{ alt: unitaOrganizzativa.titolo }"
                        no-caption
                      />
                    </Avatar>
                    <Icon v-else name="it-pa" />
                  </template>
                  <template #title>
                    <StrapiBlockUnitaOrganizzativaLink
                      class="text-decoration-none"
                      :unita-organizzativa="unitaOrganizzativa"
                    />
                  </template>
                  <template #text>
                    <p class="mb-2">{{ unitaOrganizzativa.descrizione }}</p>
                  </template>
                </Card>
              </CardWrapper>
            </section>
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.patrocinio" title="Patrocinato da">
            <StrapiRichText :html="data.patrocinio" />
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.sponsor" title="Sponsor">
            <StrapiRichText :html="data.sponsor" />
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.info" title="Ulteriori informazioni">
            <StrapiRichText :html="data.info" />
          </LazyPageContentSection>
        </PageContent>
      </Page>
    </template>
  </StrapiFetch>
</template>
