<script lang="ts" setup>
import type { Incarico } from '~/types/strapi';

const route = useRoute();

const { settings } = useConfigStore();

const documentiPage = settings.nav.amministrazione.menu.find(
  ({ path }) => path === settings.nav.amministrazione.routes.documenti,
);

const query = ref({
  contentType: 'incarichi',
  singleEntry: true,
  dataT: {} as Incarico,
  params: {
    filters: {
      slug: route.params.slug,
    },
    populate: {
      tax_incarico: true,
      persona: {
        fields: ['slug', 'nome', 'cognome', 'funzione'],
        populate: ['immagine', 'contatti.valori'],
      },
      unita_organizzativa: {
        fields: ['slug', 'titolo', 'descrizione'],
        populate: ['tax_unita_organizzativa'],
      },
      atto_nomina: {
        fields: ['slug', 'titolo', 'descrizione'],
        populate: ['files', 'tax_documento'],
      },
      seo: {
        populate: ['metaImage', 'metaSocial'],
      },
    },
  },
});

function getDescription(incarico: Incarico) {
  let description = `Incarico di ${incarico.titolo} ricoperto da ${incarico.persona.cognome} ${incarico.persona.nome}`;

  if (incarico.dataInizio) {
    description += ` dal ${formatDate(incarico.dataInizio, 'P')}`;
  }
  if (incarico.dataFine) {
    description += ` al ${formatDate(incarico.dataFine, 'P')}`;
  }
  if (incarico.dataInsediamento) {
    description += `. Data di insediamento: ${formatDate(incarico.dataInsediamento, 'P')}`;
  }

  return description;
}
</script>

<template>
  <StrapiFetch id="incarico" :find="query" fallback-error="404">
    <template #response="{ data }">
      <Page
        :title="data.titolo"
        :description="data.seo?.metaDescription || getDescription(data)"
        :published-at="data.publishedAt"
        :updated-at="data.updatedAt"
        :seo="data.seo"
      >
        <PageHeading
          :avatar="
            data.persona?.immagine
              ? { title: `${data.persona.nome} ${data.persona.cognome}`, img: data.persona?.immagine }
              : undefined
          "
          class="pb-3"
        >
          <h2 class="h4 text-muted">{{ data.persona.cognome }} {{ data.persona.nome }}</h2>
        </PageHeading>

        <PageContent font="sans-serif">
          <p v-if="data?.tax_incarico.slug != 'altro'">
            Incarico di tipo <strong>{{ data.tax_incarico.nome }}</strong>
          </p>

          <PageContentSection v-if="data.unita_organizzativa" title="Struttura">
            <h3 class="h6 font-sans-serif">Struttura o organizzazione presso la quale viene svolto l'incarico</h3>
            <CardWrapper teaser-large>
              <Card title-class="h5" class="shadow-sm border border-light">
                <template #pre-body><Icon name="it-pa" /></template>
                <template #title>
                  <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="data.unita_organizzativa" />
                </template>
                <template #text>
                  <p class="mb-2">{{ data.unita_organizzativa.descrizione }}</p>
                </template>
              </Card>
            </CardWrapper>
          </PageContentSection>

          <PageContentSection v-if="data.persona" title="Incaricato">
            <CardWrapper teaser-large>
              <StrapiBlockPersonaCard :persona="data.persona" class="shadow-sm border border-light" />
            </CardWrapper>

            <p class="font-sans-serif">
              <span v-if="data.dataInizio">
                <strong>Inizio incarico</strong>: {{ formatDate(data.dataInizio, 'P') }}
              </span>
              <br />
              <span v-if="data.dataFine"> <strong>Fine incarico</strong>: {{ formatDate(data.dataFine, 'P') }}</span>
              <br />
              <span v-if="data.dataInsediamento">
                <strong>Data di insediamento</strong>: {{ formatDate(data.dataInsediamento, 'P') }}
              </span>
            </p>

            <CardWrapper v-if="data.atto_nomina" teaser>
              <Card class="p-3 shadow-sm border border-light" title-tag="h4" title-class="h6 mb-0">
                <template #pre-body>
                  <Icon name="it-file" />
                </template>
                <template #title>
                  <NuxtLink
                    :to="`${getTaxPath(documentiPage?.menu, data.atto_nomina.tax_documento)}/${data.atto_nomina.slug}`"
                  >
                    Atto di nomina
                  </NuxtLink>
                </template>
                <template #text>
                  <p v-if="data.atto_nomina.descrizione" class="pb-2">{{ data.atto_nomina.descrizione }}</p>
                  <StrapiMedia :data="data.atto_nomina.files[0]" title="Scarica il file" />
                </template>
              </Card>
            </CardWrapper>
          </PageContentSection>

          <PageContentSection v-if="data.compensi" title="Compensi">
            <StrapiRichText :html="data.compensi" />
          </PageContentSection>

          <PageContentSection v-if="data.importi" title="Importi di viaggio di servizio">
            <h3 class="h6 pb-2 font-sans-serif">Viaggi di servizio e missioni pagati con fondi pubblici</h3>

            <StrapiRichText :html="data.importi" />
          </PageContentSection>

          <PageContentSection v-if="data.info" title="Ulteriori informazioni">
            <StrapiRichText :html="data.info" />
          </PageContentSection>
        </PageContent>
      </Page>
    </template>
  </StrapiFetch>
</template>

<style lang="scss" scoped></style>
