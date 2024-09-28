<script lang="ts" setup>
import type { Servizio } from '~/types/strapi';

const route = useRoute();

const { settings } = useConfigStore();

const documentiPage = settings.nav.amministrazione.menu.find(
  ({ path }) => path === settings.nav.amministrazione.routes.documenti,
);

const { data } = await useStrapiFetch('servizio', {
  contentType: 'servizi',
  dataT: {} as Servizio,
  singleEntry: true,
  params: {
    filters: {
      slug: route.params.slug,
      tax_servizio: {
        slug: route.params.taxonomy,
      },
    },
    populate: {
      tax_servizio: true,
      argomenti: true,
      immagine: true,
      timeline: {
        populate: ['date', 'periodi'],
      },
      costi: {
        populate: ['prezzi'],
      },
      contatti: {
        populate: ['valori'],
      },
      unita_organizzativa_responsabile: {
        fields: ['slug', 'titolo', 'descrizione'],
        populate: ['tax_unita_organizzativa', 'logo'],
      },
      fileCondizioni: true,
      documenti: {
        fields: ['slug', 'titolo', 'descrizione'],
        populate: ['files', 'tax_documento'],
      },
      tax_eventi_persone: true,
      tax_eventi_imprese: true,
      seo: {
        populate: ['metaImage', 'metaSocial'],
      },
    },
  },
});

if (!data) showError({ statusCode: 404 });

useHead(() => {
  if (!data) return {};

  const serviceMeta = {
    name: data.titolo,
    serviceType: data.tax_servizio?.nome,
    serviceOperator: {
      '@type': 'GovernmentOrganization',
      name: settings.municipalityName,
      url: settings.domainName,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: data.zona,
    },
    audience: {
      '@type': 'Audience',
      audienceType: data.perChi,
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: data.accessoDigitale,
      serviceLocation: {
        name: data.unita_organizzativa_responsabile?.titolo ?? null,
        address: {
          streetAddress: data.accessoFisico,
          postalCode: settings.municipalityAddress,
          addressLocality: settings.municipalityName,
        },
      },
    },
  };

  return {
    script: [
      {
        type: 'application/ld+json',
        'data-element': 'metatag',
        textContent: JSON.stringify(serviceMeta),
      },
    ],
  };
});
</script>

<template>
  <Page
    v-if="data"
    :title="data.titolo"
    :description="data.descrizione"
    :published-at="data.publishedAt"
    :updated-at="data.updatedAt"
    :image="data.immagine?.url"
    :seo="data.seo"
  >
    <PageHeading
      :tags="data.argomenti"
      :media="data.immagine"
      :title-data="{ element: 'service-title' }"
      :tags-data="{ element: 'service-topic' }"
      show-actions
    >
      <h2 v-if="data.sottotitolo" class="h4 text-muted mb-3">{{ data.sottotitolo }}</h2>
      <p class="subtitle-small" data-audio data-element="service-description">{{ data.descrizione }}</p>

      <Callout
        v-if="data.stato"
        :title="data.attivo ? 'Avviso' : 'Servizio non attivo'"
        :type="data.attivo ? 'note' : 'danger'"
      >
        <LazyStrapiRichText :html="data.stato" data-element="service-status" />
      </Callout>

      <Button
        v-if="data.accessoDigitale"
        :to="data.accessoDigitale"
        target="_blank"
        :title="data.titolo + ' - accesso online'"
        color="primary"
        class="mt-3"
      >
        Accedi al servizio online
      </Button>
    </PageHeading>

    <PageContent font="sans-serif">
      <LazyPageContentSection v-if="data.perChi" title="A chi è rivolto">
        <StrapiRichText :html="data.perChi" data-element="service-addressed" />
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.contenuto" title="Descrizione">
        <StrapiRichText :html="data.contenuto" />
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.zona" title="Copertura geografica">
        <StrapiRichText :html="data.zona" />
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.comeUsufruire" title="Come fare">
        <StrapiRichText :html="data.comeUsufruire" data-element="service-how-to" />
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.cosaServe" title="Cosa serve">
        <StrapiRichText :html="data.cosaServe" data-element="service-needed" />
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.siOttiene" title="Cosa si ottiene">
        <StrapiRichText :html="data.siOttiene" data-element="service-achieved" />
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.timeline" title="Tempi e scadenze">
        <StrapiTimeline :data="data.timeline" />
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.costi" title="Costi">
        <StrapiListinoPrezzi :data="data.costi" />
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.procedureEsito" title="Procedure collegate all'esito">
        <StrapiRichText :html="data.procedureEsito" />
      </LazyPageContentSection>

      <LazyPageContentSection
        v-if="data.accessoFisico || data.accessoDigitale || data.prenotaAppuntamento"
        title="Accedi al servizio"
        class="section p-4 section-primary-light"
      >
        <LazyStrapiRichText v-if="data.accessoFisico" :html="data.accessoFisico" />

        <div v-if="data.accessoDigitale">
          <p>Accedi online al servizio tramite identità digitale</p>

          <Button
            :to="data.accessoDigitale"
            target="_blank"
            color="primary"
            :title="data.titolo + ' - accesso online'"
            data-element="service-online-access"
            mobile-block
            class="mb-4"
          >
            Accedi al servizio online
          </Button>
        </div>

        <div v-if="data.prenotaAppuntamento">
          <p>Prenota un appuntamento presso gli uffici</p>

          <Button
            :to="data.prenotaAppuntamento"
            target="_blank"
            color="primary"
            outline
            :title="data.titolo + ' - prenotazione appuntamento'"
            data-element="service-booking-access"
            mobile-block
            class="bg-white mb-4"
          >
            Prenota appuntamento
          </Button>
        </div>
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.vincoli" title="Vincoli">
        <StrapiRichText :html="data.vincoli" />
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.casiParticolari" title="Casi particolari">
        <StrapiRichText :html="data.casiParticolari" />
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.info" title="Ulteriori informazioni">
        <StrapiRichText :html="data.info" />
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.fileCondizioni?.length" title="Condizioni di servizio">
        <p>
          Per conoscere i dettagli di scadenze, requisiti e altre informazioni importanti, leggi i termini e le
          condizioni di servizio.
        </p>

        <CardWrapper teaser>
          <Card
            v-for="file in data.fileCondizioni"
            :key="file.hash"
            class="border border-light shadow-sm p-3"
            title-class="h6"
          >
            <template #pre-body>
              <Icon name="it-clip" />
            </template>
            <template #title>
              <StrapiMedia :data="file" info-after />
            </template>
          </Card>
        </CardWrapper>
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.contatti?.length || data.unita_organizzativa_responsabile" title="Contatti">
        <div v-if="data.unita_organizzativa_responsabile" data-element="service-area">
          <h3 class="h4 font-sans-serif">
            {{
              data.unita_organizzativa_responsabile.tax_unita_organizzativa?.slug === 'struttura-amministrativa_area'
                ? 'Area amministrativa'
                : 'Ufficio'
            }}
          </h3>

          <CardWrapper teaser-large>
            <Card title-class="h5 mb-1" border-left>
              <template #pre-body>
                <Avatar
                  v-if="data.unita_organizzativa_responsabile.logo"
                  :title="data.unita_organizzativa_responsabile.titolo"
                  size="lg"
                  class="me-3"
                >
                  <StrapiMedia
                    :data="data.unita_organizzativa_responsabile.logo"
                    :simple-img="[80]"
                    :img-attrs="{ alt: data.unita_organizzativa_responsabile.titolo }"
                    no-caption
                  />
                </Avatar>
                <Icon v-else name="it-pa" />
              </template>
              <template #title>
                <StrapiBlockUnitaOrganizzativaLink
                  :unita-organizzativa="data.unita_organizzativa_responsabile"
                  class="text-decoration-none"
                />
              </template>
              <template #text>
                <p class="mb-2">{{ data.unita_organizzativa_responsabile.descrizione }}</p>
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

      <LazyPageContentSection v-if="data.documenti?.length" title="Documenti">
        <CardWrapper teaser>
          <Card
            v-for="documento in data.documenti"
            :key="documento.id"
            class="border border-light shadow-sm p-3"
            title-class="h6"
          >
            <template #pre-body>
              <Icon name="it-file" />
            </template>
            <template #title>
              <NuxtLink :to="`${getTaxPath(documentiPage?.menu, documento.tax_documento)}/${documento.slug}`">
                {{ documento.titolo }}
              </NuxtLink>
            </template>
            <template #text>
              <p v-if="documento.descrizione" class="pb-2">{{ documento.descrizione }}</p>
              <StrapiMedia :data="documento.files[0]" title="Scarica il file" icon="it-download" />
            </template>
          </Card>
        </CardWrapper>
      </LazyPageContentSection>

      <p v-if="data.codiceIpa"><strong>Codice IPA (ente erogatore):</strong> {{ data.codiceIpa }}</p>

      <p v-if="data.classificazione">
        <strong>Settore merceologico (classificazione NACE):</strong> {{ data.classificazione }}
      </p>

      <div v-if="data.tax_eventi_persone?.length">
        <small>Eventi della vita delle persone:</small>

        <ul class="list-unstyled d-flex flex-wrap gap-1 mt-2">
          <li v-for="tag in data.tax_eventi_persone" :key="tag.id">
            <Chip :label="tag.nome" :data-attribute="tag?.vocabolario" simple color="primary" />
          </li>
        </ul>
      </div>

      <div v-if="data.tax_eventi_imprese?.length">
        <small>Eventi della vita delle imprese:</small>

        <ul class="list-unstyled d-flex flex-wrap gap-1 mt-2">
          <li v-for="tag in data.tax_eventi_imprese" :key="tag.id">
            <Chip :label="tag.nome" :data-attribute="tag?.vocabolario" simple color="primary" />
          </li>
        </ul>
      </div>
    </PageContent>
  </Page>
</template>
