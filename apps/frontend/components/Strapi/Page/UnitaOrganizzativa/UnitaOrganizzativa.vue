<script lang="ts" setup>
import type { DocumentoPubblico, Servizio, UnitaOrganizzativa } from '~/types/strapi';

interface Props {
  queryFilters: Record<string, unknown> | Ref<Record<string, unknown>>;
  children?: {
    sectionTitle: string;
    queryFilters: Record<string, unknown> | Ref<Record<string, unknown>>;
  };
  personeSectionBefore?: boolean;
}

const props = defineProps<Props>();

const { settings } = useConfigStore();

const documentiPage = settings.nav.amministrazione.menu.find(
  ({ path }) => path === settings.nav.amministrazione.routes.documenti,
);

const { data } = await useStrapiFetch('unita-organizzativa', {
  contentType: 'unita-organizzative',
  dataT: {} as UnitaOrganizzativa,
  singleEntry: true,
  params: {
    filters: unref(props.queryFilters),
    populate: {
      argomenti: true,
      immagine: true,
      logo: true,
      tax_unita_organizzativa: true,
      contatti: {
        populate: ['valori'],
      },
      unita_organizzativa_padre: {
        fields: ['slug', 'titolo', 'descrizione'],
        populate: {
          tax_unita_organizzativa: true,
          persona_responsabile: {
            fields: ['slug', 'nome', 'cognome'],
            populate: ['immagine', 'contatti.valori'],
          },
          logo: true,
        },
      },
      sede_principale: {
        fields: ['slug', 'nome', 'descrizione', 'indirizzo', 'indirizzo2', 'cap'],
        populate: ['tax_luogo'],
      },
      sedi_secondarie: {
        fields: ['slug', 'nome', 'descrizione', 'indirizzo', 'indirizzo2', 'cap'],
        populate: ['tax_luogo'],
      },
      persona_responsabile: {
        fields: ['slug', 'nome', 'cognome', 'funzione'],
        populate: ['immagine', 'contatti.valori'],
      },
      persona_assessore: {
        fields: ['slug', 'nome', 'cognome', 'funzione'],
        populate: ['immagine', 'incarichi', 'contatti.valori'],
      },
      persone_componenti: {
        fields: ['slug', 'nome', 'cognome', 'funzione'],
        populate: ['immagine', 'incarichi', 'contatti.valori'],
      },
      seo: {
        populate: ['metaImage', 'metaSocial'],
      },
    },
  },
});

if (!data) showError({ statusCode: 404 });

const serviziQuery = ref({
  contentType: 'servizi',
  dataT: {} as Array<Servizio>,
  params: {
    filters: {
      unita_organizzativa_responsabile: {
        id: data?.id,
      },
    },
    fields: ['slug', 'titolo', 'sottotitolo', 'descrizione', 'accessoDigitale'],
    populate: ['tax_servizio'],
    sort: 'titolo',
  },
  pagination: {
    pageParam: 'servizi',
    pageSize: 4,
  },
});

const documentiQuery = ref({
  contentType: 'documenti-pubblici',
  dataT: {} as Array<DocumentoPubblico>,
  params: {
    filters: {
      unita_organizzativa: {
        id: data?.id,
      },
    },
    fields: ['slug', 'titolo', 'descrizione'],
    populate: ['files', 'tax_documento'],
    sort: 'titolo',
  },
  pagination: {
    pageParam: 'documenti',
    pageSize: 4,
  },
});

// unita organizzative figlie
const childrenQuery = ref({
  contentType: 'unita-organizzative',
  dataT: {} as Array<UnitaOrganizzativa>,
  params: {
    filters: unref(props.children?.queryFilters),
    fields: ['slug', 'titolo', 'descrizione'],
    populate: ['tax_unita_organizzativa'],
    sort: 'titolo',
  },
});

// return the correct label for the "responsabile": (Dirigente or the default one)
function getResponsabileTitle(unitaOrganizzativa?: UnitaOrganizzativa) {
  if (
    unitaOrganizzativa &&
    (unitaOrganizzativa.tax_unita_organizzativa?.slug === 'struttura-amministrativa_area' || // it's an area
      (unitaOrganizzativa?.unita_organizzativa_padre &&
        unitaOrganizzativa?.unita_organizzativa_padre.id === unitaOrganizzativa.id)) // it's parent of itself
  ) {
    return 'Dirigente';
  }

  return 'Responsabile';
}

function getStrutturaDiRiferimentoTitle(unitaOrganizzativa?: UnitaOrganizzativa) {
  if (unitaOrganizzativa?.unita_organizzativa_padre?.tax_unita_organizzativa) {
    const parentTaxSlug = unitaOrganizzativa.unita_organizzativa_padre.tax_unita_organizzativa.slug;

    if (parentTaxSlug === 'struttura-amministrativa_area') {
      return 'Area di riferimento';
    }
    if (parentTaxSlug === 'struttura-amministrativa_ufficio') {
      return 'Ufficio di riferimento';
    }
  }

  return 'Struttura di riferimento';
}
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
      :avatar="data.logo ? { title: data.titolo, img: data.logo } : undefined"
      wrapper-class="pb-3"
    />

    <PageContent font="sans-serif">
      <LazyPageContentSection v-if="data.competenze" title="Cosa fa">
        <StrapiRichText :html="data.competenze" />
      </LazyPageContentSection>

      <LazyPageContentSection
        v-if="
          personeSectionBefore &&
          (data.unita_organizzativa_padre?.persona_responsabile ||
            data.persona_responsabile ||
            data.persona_assessore ||
            data.persone_componenti?.length)
        "
        title="Persone"
      >
        <StrapiBlockUnitaOrganizzativaPersone
          :responsabile-padre="data.unita_organizzativa_padre?.persona_responsabile"
          :responsabile-padre-title="getResponsabileTitle(data.unita_organizzativa_padre)"
          :responsabile="data.persona_responsabile"
          :responsabile-title="getResponsabileTitle(data)"
          :assessore="data.persona_assessore"
          :componenti="data.persone_componenti"
        />
      </LazyPageContentSection>

      <LazyPageContentSection
        v-if="data.unita_organizzativa_padre && data?.unita_organizzativa_padre.id != data.id"
        :title="getStrutturaDiRiferimentoTitle(data)"
      >
        <CardWrapper teaser-large>
          <Card title-class="h5 mb-1" border-left>
            <template #pre-body>
              <Avatar
                v-if="data.unita_organizzativa_padre.logo"
                :title="data.unita_organizzativa_padre.titolo"
                size="lg"
                class="me-3"
              >
                <StrapiMedia
                  :data="data.unita_organizzativa_padre.logo"
                  :simple-img="[80]"
                  :img-attrs="{ alt: data.unita_organizzativa_padre.titolo }"
                  no-caption
                />
              </Avatar>
              <Icon v-else name="it-pa" />
            </template>
            <template #title>
              <StrapiBlockUnitaOrganizzativaLink
                class="text-decoration-none"
                :unita-organizzativa="data.unita_organizzativa_padre"
              />
            </template>
            <template #text>{{ data.unita_organizzativa_padre.descrizione }}</template>
          </Card>
        </CardWrapper>
      </LazyPageContentSection>

      <StrapiFetch
        v-if="children"
        id="children"
        on="section"
        :find="childrenQuery"
        no-fallback
        class="it-page-section anchor-offset mb-5"
      >
        <template #response="{ data: childrenData }">
          <h2 v-if="children?.sectionTitle" class="mb-4">{{ children.sectionTitle }}</h2>

          <CardWrapper teaser>
            <Card v-for="child in childrenData" :key="child.id" title-class="h5" class="shadow-sm border border-light">
              <template #pre-body>
                <Avatar v-if="child.logo" :title="child.titolo" size="lg" class="me-3">
                  <StrapiMedia :data="child.logo" :simple-img="[80]" :img-attrs="{ alt: child.titolo }" no-caption />
                </Avatar>
                <Icon v-else name="it-pa" />
              </template>
              <template #title>
                <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="child" class="text-decoration-none" />
              </template>
              <template #text>
                <p class="mb-2">{{ child.descrizione }}</p>
              </template>
              <small class="mt-auto mb-0">
                <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="child">
                  Ulteriori dettagli
                </StrapiBlockUnitaOrganizzativaLink>
              </small>
            </Card>
          </CardWrapper>
        </template>
      </StrapiFetch>

      <LazyPageContentSection v-if="data.contatti?.length" title="Contatti">
        <CardWrapper teaser-large>
          <Card>
            <StrapiContacts show-icon :contacts="data.contatti" />
          </Card>
        </CardWrapper>
      </LazyPageContentSection>

      <LazyPageContentSection
        v-if="data.sede_principale"
        :title="data.sedi_secondarie?.length ? 'Sede principale' : 'Sede'"
      >
        <CardWrapper teaser-large stretch>
          <Card title-class="h5 mb-1">
            <template #pre-body>
              <Icon name="it-map-marker-circle" />
            </template>
            <template #title>
              <NuxtLink
                :to="`${settings.nav.vivereIlComune.routes.luoghi}/${data.sede_principale.tax_luogo.slug}/${data.sede_principale.slug}`"
                class="text-decoration-none"
              >
                {{ data.sede_principale.nome }}
              </NuxtLink>
            </template>
            <template #text>
              <p class="text-muted mb-3">
                {{ data.sede_principale.descrizione }}
              </p>
              <p>
                <span class="d-block">{{ data.sede_principale.indirizzo }} - {{ data.sede_principale.cap }}</span>
                <span v-if="data.sede_principale.indirizzo2" class="d-block">
                  {{ data.sede_principale.indirizzo2 }}
                </span>
              </p>
              <p class="mt-3">
                <NuxtLink
                  :to="`${settings.nav.vivereIlComune.routes.luoghi}/${data.sede_principale.tax_luogo.slug}/${data.sede_principale.slug}`"
                >
                  Ulteriori dettagli
                </NuxtLink>
              </p>
            </template>
          </Card>
        </CardWrapper>
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.sedi_secondarie?.length" title="Altre Sedi">
        <CardWrapper teaser stretch>
          <Card
            v-for="sede in data.sedi_secondarie"
            :key="sede.id"
            title-class="h5"
            class="shadow-sm border border-light"
          >
            <template #title>
              <Icon name="it-map-marker-circle" class="me-2" />
              <NuxtLink
                :to="`${settings.nav.vivereIlComune.routes.luoghi}/${sede.tax_luogo.slug}/${sede.slug}`"
                class="text-decoration-none"
              >
                {{ sede.nome }}
              </NuxtLink>
            </template>
            <template #text>
              <div class="ms-2">
                <p class="text-muted mb-3">
                  {{ sede.descrizione }}
                </p>
                <p>
                  <span class="d-block">{{ sede.indirizzo }} - {{ sede.cap }}</span>
                  <span v-if="sede.indirizzo2" class="d-block">
                    {{ sede.indirizzo2 }}
                  </span>
                </p>
                <p class="mt-3 mb-0">
                  <NuxtLink :to="`${settings.nav.vivereIlComune.routes.luoghi}/${sede.tax_luogo.slug}/${sede.slug}`">
                    Ulteriori dettagli
                  </NuxtLink>
                </p>
              </div>
            </template>
          </Card>
        </CardWrapper>
      </LazyPageContentSection>

      <LazyPageContentSection v-if="data.orari" title="Orari di apertura">
        <CardWrapper teaser-large>
          <Card title-class="h5 mb-1">
            <template #pre-body>
              <Icon name="it-clock" />
            </template>
            <template #text>
              <StrapiRichText :html="data.orari" />
            </template>
          </Card>
        </CardWrapper>
      </LazyPageContentSection>

      <LazyPageContentSection
        v-if="
          !personeSectionBefore &&
          (data.unita_organizzativa_padre?.persona_responsabile ||
            data.persona_responsabile ||
            data.persona_assessore ||
            data.persone_componenti?.length)
        "
        title="Persone"
      >
        <StrapiBlockUnitaOrganizzativaPersone
          :responsabile-padre="data.unita_organizzativa_padre?.persona_responsabile"
          :responsabile-padre-title="getResponsabileTitle(data.unita_organizzativa_padre)"
          :responsabile="data.persona_responsabile"
          :responsabile-title="getResponsabileTitle(data)"
          :assessore="data.persona_assessore"
          :componenti="data.persone_componenti"
        />
      </LazyPageContentSection>

      <StrapiFetch id="servizi" :find="serviziQuery" no-fallback>
        <template #response="{ data: servizi }">
          <LazyPageContentSection title="Servizi">
            <CardWrapper teaser stretch>
              <Card
                v-for="servizio in servizi"
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
        </template>
      </StrapiFetch>

      <StrapiFetch id="documenti" :find="documentiQuery" no-fallback>
        <template #response="{ data: documenti }">
          <LazyPageContentSection title="Documenti">
            <CardWrapper teaser stretch>
              <Card
                v-for="documento in documenti"
                :key="documento.id"
                class="border border-light shadow-sm p-3"
                title-class="h6"
              >
                <template #pre-body><Icon name="it-file" /></template>
                <template #title>
                  <NuxtLink :to="`${getTaxPath(documentiPage?.menu, documento.tax_documento)}/${documento.slug}`">
                    {{ documento.titolo }}
                  </NuxtLink>
                </template>
                <template #text>
                  <p v-if="documento.descrizione" class="pb-2">{{ documento.descrizione }}</p>
                  <StrapiMedia v-if="documento.files.length === 1" :data="documento.files[0]" title="Scarica il file" />
                  <p v-else-if="documento.files.length > 1">Il documento contiene piu file</p>
                </template>
              </Card>
            </CardWrapper>
          </LazyPageContentSection>
        </template>
      </StrapiFetch>

      <LazyPageContentSection v-if="data.info" title="Ulteriori informazioni">
        <StrapiRichText :html="data.info" />
      </LazyPageContentSection>
    </PageContent>
  </Page>
</template>
