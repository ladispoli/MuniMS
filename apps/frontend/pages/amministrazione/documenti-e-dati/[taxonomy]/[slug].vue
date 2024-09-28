<script lang="ts" setup>
import type { DocumentoPubblico } from '~/types/strapi';

const route = useRoute();

const { settings } = useConfigStore();

const parentPage = settings.nav.amministrazione.menu.find(
  ({ path }) => path === settings.nav.amministrazione.routes.documenti,
);
const taxPage = parentPage?.menu?.find(({ path }) => path === route.path.substring(0, route.path.lastIndexOf('/')));
if (!taxPage) showError({ statusCode: 404 });

const query = ref({
  contentType: 'documenti-pubblici',
  singleEntry: true,
  dataT: {} as DocumentoPubblico,
  params: {
    filters: {
      slug: route.params.slug,
      tax_documento: {
        slug: taxPage?.taxonomySlug,
      },
    },
    populate: {
      argomenti: true,
      immagine: true,
      files: true,
      galleria: true,
      tax_documento: true,
      tax_documento_albo_pretorio: true,
      tax_licenza: true,
      tax_eventi_persone: true,
      tax_eventi_imprese: true,
      unita_organizzativa: {
        fields: ['slug', 'titolo', 'descrizione'],
        populate: ['tax_unita_organizzativa', 'logo'],
      },
      servizi: {
        fields: ['slug', 'titolo', 'sottotitolo', 'descrizione', 'accessoDigitale'],
        populate: ['tax_servizio'],
      },
      documenti_correlati: {
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
    sort: 'data:desc',
  },
});

function getDocumentPath(documento: DocumentoPubblico) {
  const page = parentPage?.menu?.find(({ taxonomySlug }) => taxonomySlug === documento.tax_documento.slug);
  return `${page?.path}/${documento.slug}`;
}

function getFileIcon(extension: string) {
  const fileExt = extension.substring(1); // remove the dot
  if (['pdf', 'odp', 'xml', 'csv', 'ods', 'txt', 'json', 'odt'].includes(fileExt)) {
    return `it-file-${fileExt}`;
  }
  return 'it-file';
}
</script>

<template>
  <StrapiFetch id="documento" :find="query" fallback-error="404">
    <template #response="{ data }">
      <Page
        :title="data.titolo"
        :description="data.descrizione ?? data.tax_documento.nome"
        :published-at="data.data"
        :updated-at="data.updatedAt"
        :image="data.immagine?.url"
        :seo="data.seo"
      >
        <PageHeading :tags="data.argomenti" :media="data.immagine" show-actions show-date>
          <p v-if="data.descrizione" class="subtitle-small" data-audio>{{ data.descrizione }}</p>

          <Chip
            v-if="data.tax_documento_albo_pretorio"
            :label="`Documento Albo Pretorio: ${data.tax_documento_albo_pretorio.nome}`"
            color="info"
            large
            class="mb-3"
          />
          <Chip v-else-if="data.tax_documento" :label="data.tax_documento.nome" color="info" large class="mb-3" />

          <div v-if="data.dataInizio || data.dataFine" class="my-3">
            <div v-if="data.dataInizio">
              Data di inizio: <strong>{{ formatDate(data.dataInizio) }}</strong>
            </div>
            <div v-if="data.dataFine">
              Data di scadenza: <strong>{{ formatDate(data.dataFine) }}</strong>
            </div>
          </div>
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

          <LazyPageContentSection v-if="data.files?.length" title="Documenti" font="sans-serif">
            <List>
              <ListItem v-for="file in data.files" :key="file.hash" :icon="getFileIcon(file.ext)">
                <StrapiMedia :data="file" />
              </ListItem>
            </List>
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.contenuto" title="Descrizione">
            <StrapiRichText :html="data.contenuto" />
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.autore" title="Autore/i">
            <StrapiRichText :html="data.autore" />
          </LazyPageContentSection>

          <section v-if="data.unita_organizzativa" class="mb-4">
            <h3 class="h5 mt-4">
              {{
                data.unita_organizzativa.tax_unita_organizzativa?.slug === 'struttura-amministrativa_area'
                  ? 'Area'
                  : 'Ufficio'
              }}
              responsabile del documento
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
                    class="text-decoration-none"
                    :unita-organizzativa="data.unita_organizzativa"
                  />
                </template>
                <template #text>{{ data.unita_organizzativa.descrizione }}</template>
              </Card>
            </CardWrapper>
          </section>

          <LazyPageContentSection v-if="data.servizi?.length" title="Servizi">
            <CardWrapper teaser>
              <Card
                v-for="servizio in data.servizi"
                :key="servizio.id"
                class="border border-light shadow-sm p-3"
                title-class="h5"
              >
                <template #title>
                  <NuxtLink
                    :to="`/servizi/${servizio.tax_servizio.slug}/${servizio.slug}`"
                    class="text-decoration-none"
                    data-element="service-link"
                  >
                    {{ servizio.titolo }}
                  </NuxtLink>
                  <p v-if="servizio.accessoDigitale" class="my-0 py-0">
                    <Badge color="info">online</Badge>
                  </p>
                </template>
                <template #text>
                  <h4 v-if="servizio.sottotitolo" class="h6 mb-1">{{ servizio.sottotitolo }}</h4>
                  <p>{{ servizio.descrizione }}</p>
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

          <LazyPageContentSection v-if="data.documenti_correlati?.length" title="Documenti collegati">
            <CardWrapper teaser>
              <Card
                v-for="documento in data.documenti_correlati"
                :key="documento.id"
                class="border border-light shadow-sm p-3"
                title-class="h6"
              >
                <template #pre-body><Icon name="it-file" /></template>
                <template #title>
                  <NuxtLink :to="getDocumentPath(documento)" class="text-decoration-none">
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

          <p v-if="data.identificativo">
            <strong>Identificativo del documento:</strong>
            {{ data.identificativo }}
          </p>
          <p v-if="data.protocollo">
            <strong>Numero di protocollo:</strong>
            {{ data.protocollo }}
          </p>

          <div v-if="data.tax_licenza">
            <strong>Licenza:</strong>
            <Chip :label="data.tax_licenza.nome" color="info" class="mx-2" />
          </div>

          <section v-if="data.tax_eventi_persone?.length">
            <small>Eventi della vita delle persone:</small>

            <ul class="list-unstyled d-flex flex-wrap gap-1 mt-2">
              <li v-for="tag in data.tax_eventi_persone" :key="tag.id">
                <Chip :label="tag.nome" :data-attribute="tag?.vocabolario" simple color="primary" />
              </li>
            </ul>
          </section>

          <section v-if="data.tax_eventi_imprese?.length">
            <small>Eventi della vita delle imprese:</small>

            <ul class="list-unstyled d-flex flex-wrap gap-1 mt-2">
              <li v-for="tag in data.tax_eventi_imprese" :key="tag.id">
                <Chip :label="tag.nome" :data-attribute="tag?.vocabolario" simple color="primary" />
              </li>
            </ul>
          </section>

          <LazyPageContentSection v-if="data.info" title="Ulteriori informazioni">
            <StrapiRichText :html="data.info" />
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.riferimenti" title="Riferimenti normativi">
            <StrapiRichText :html="data.riferimenti" />
          </LazyPageContentSection>
        </PageContent>
      </Page>
    </template>
  </StrapiFetch>
</template>
