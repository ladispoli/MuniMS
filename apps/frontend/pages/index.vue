<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import type { RouteLocationRaw } from '#vue-router';
import type { LinkList } from '~/components/List/List.vue';
import type {
  Evento,
  Homepage,
  Notizia,
  NotizieInEvidenza,
  Servizio,
  TaxArgomento,
  Incarico,
  UnitaOrganizzativa,
  Persona,
} from '~/types/strapi';

interface InEvidenza<First, Others = First> {
  first?: First;
  others?: Array<Others>;
  readMore?: { link: RouteLocationRaw; label: string };
}

definePageMeta({
  layout: 'default-no-breadcrumb',
});

const { settings } = useConfigStore();

const { width: windowWidth } = useWindowSize();
const mdGridBreakpoint = 768; // bootstrap-italia grid-breakpoint 'md'
const galleriaSfondoMaxHeight = '335px';
const isDesktop = computed(() => windowWidth.value > mdGridBreakpoint);
const CardWrapper = resolveComponent('CardWrapper');

const today = formatDate(new Date(), 'yyyy-MM-dd');

const { data: homepage } = await useStrapiFetch<Homepage>('homepage', {
  contentType: 'homepage',
  singleEntry: true,
  params: {
    populate: {
      galleriaSfondo: true,
      argomenti: true,
      immagineArgomenti: true,
      altriArgomenti: true,
      linkAccessoRapido: {
        populate: ['immagine'],
      },
      sitiTematici: {
        populate: ['immagine'],
      },
      linkUtili: true,
    },
  },
});

const newsInEvidenza = ref<InEvidenza<Notizia>>({});
const showNewsInEvidenzaAsCarousel = homepage?.notizieInEvidenza === null || homepage?.notizieInEvidenza === 0;
const othersNewsNum = homepage?.notizieInEvidenza ?? 9;

if (homepage?.mostraSoloPrimaNovitaInEvidenza) {
  const { data: NovitaInEvidenza } = await useStrapiFetch<InEvidenza<Notizia>>('notizie-in-evidenza', {
    contentType: 'notizie-in-evidenza',
    singleEntry: true,
    params: {
      populate: {
        notizie: {
          fields: ['slug', 'titolo', 'data', 'descrizione', 'dataScadenza'],
          populate: ['tax_notizia', 'immagine', 'argomenti'],
        },
      },
    },
    transform: ({ notizie, mostraSoloInHomepage }: NotizieInEvidenza) => {
      const _notizia = notizie?.find(({ dataScadenza }) => !dataScadenza || dataScadenza >= today);
      const readMore = {
        link: mostraSoloInHomepage ? settings.nav.novita.routes.tutte : settings.nav.novita.routes.inEvidenza,
        label: mostraSoloInHomepage ? 'Tutte le Novità' : 'Tutte le Notizie in evidenza',
      };

      return { first: _notizia ?? undefined, readMore };
    },
  });

  const { data: othersNews } = await useStrapiFetch<Array<Notizia>>('notizie', {
    contentType: 'notizie',
    params: {
      filters: {
        id: { $ne: NovitaInEvidenza?.first?.id },
        $or: [{ dataScadenza: { $null: true } }, { dataScadenza: { $gte: today } }],
      },
      fields: ['slug', 'titolo', 'data', 'descrizione', 'dataScadenza'],
      populate: ['tax_notizia', 'immagine', 'argomenti'],
      sort: 'data:desc',
      pagination: {
        limit: othersNewsNum,
      },
    },
  });

  newsInEvidenza.value = {
    ...NovitaInEvidenza,
    others: othersNews ?? [],
  };
} else {
  const { data: news } = await useStrapiFetch<InEvidenza<Notizia>>('notizie-in-evidenza', {
    contentType: 'notizie-in-evidenza',
    singleEntry: true,
    params: {
      populate: {
        notizie: {
          fields: ['slug', 'titolo', 'data', 'descrizione', 'dataScadenza'],
          populate: ['tax_notizia', 'immagine', 'argomenti'],
        },
      },
      pagination: {
        start: 0,
        limit: 4,
      },
    },
    transform: ({ notizie }: NotizieInEvidenza) => {
      const _news = notizie?.filter(({ dataScadenza }) => !dataScadenza || dataScadenza >= today) ?? [];

      if (!_news.length) {
        return { first: undefined, others: [] };
      }
      return { first: _news.shift(), others: _news.slice(0, othersNewsNum) };
    },
  });

  newsInEvidenza.value = news ?? {};
}

const avvisiInScadenzaQuery = {
  contentType: 'notizie',
  dataT: {} as Array<Notizia>,
  params: {
    filters: {
      tax_notizia: {
        slug: 'avviso',
      },
      dataScadenza: { $gte: today },
    },
    fields: ['slug', 'titolo', 'data', 'descrizione', 'dataScadenza'],
    populate: ['tax_notizia', 'immagine'],
    sort: 'dataScadenza:asc',
  },
};

const { data: eventiInEvidenza } = await useStrapiFetch<Array<Evento>>('eventi-in-evidenza', {
  contentType: 'eventi-in-evidenza',
  singleEntry: true,
  params: {
    populate: {
      eventi: {
        fields: ['slug', 'titolo', 'descrizione', 'dataInizio', 'dataFine'],
        populate: ['immagine', 'tax_evento'],
      },
    },
    pagination: {
      limit: homepage?.eventiInEvidenza ?? 9,
    },
  },
  transform: ({ eventi }: { eventi: Array<Evento> }) => eventi,
});

const showEventiInEvidenzaAsCarousel = homepage?.eventiInEvidenza === null || homepage?.eventiInEvidenza === 0;

function getNotizieArgomentoQuery(argomento: TaxArgomento): LinkList {
  return {
    contentType: 'notizie',
    dataT: {} as Array<Notizia>,
    params: {
      filters: {
        argomenti: {
          slug: { $eq: argomento.slug },
        },
        $or: [{ dataScadenza: { $null: true } }, { dataScadenza: { $gte: today } }],
      },
      fields: ['slug', 'titolo', 'data'],
      populate: ['tax_notizia'],
      sort: 'dataScadenza:asc',
      pagination: {
        start: 0,
        limit: homepage?.argomentiNotizie ? homepage?.argomentiNotizie + 1 : 0, // add one to check if there are more items and show "..."
      },
    },
    transform: (notizie: Array<Notizia>): LinkList => {
      // get rid of the last item if there are more items than the limit
      const list: LinkList = [];
      const argomentiNotizie = homepage?.argomentiNotizie ?? 0;

      if (notizie.length > argomentiNotizie) {
        notizie.pop();
        list.push({
          name: '...',
          path: `/argomenti/${argomento.slug}`,
          attrs: { class: 'px-1 py-0' },
        });
      }

      return [
        ...notizie.map((notizia) => ({
          name: notizia.titolo,
          path: `${getTaxPath(settings.nav.novita.menu, notizia.tax_notizia)}/${notizia.slug}`,
          iconLeft: 'it-calendar',
        })),
        ...list,
      ];
    },
  };
}

function getServiziArgomentoQuery(argomento: TaxArgomento): LinkList {
  return {
    contentType: 'servizi',
    dataT: {} as Array<Servizio>,
    params: {
      filters: {
        argomenti: {
          slug: { $eq: argomento.slug },
        },
      },
      fields: ['slug', 'titolo', 'descrizione'],
      populate: ['tax_servizio'],
      sort: 'titolo',
      pagination: {
        start: 0,
        limit: homepage?.argomentiServizi ? homepage?.argomentiServizi + 1 : 0, // add one to check if there are more items and show "..."
      },
    },
    transform: (servizi: Array<Servizio>): LinkList => {
      // get rid of the last item if there are more items than the limit
      const list: LinkList = [];
      const argomentiServizi = homepage?.argomentiServizi ?? 0;

      if (servizi.length > argomentiServizi) {
        servizi.pop();
        list.push({
          name: '...',
          path: `/argomenti/${argomento.slug}`,
          attrs: { class: 'px-1 py-0' },
        });
      }

      return [
        ...servizi.map((servizio) => ({
          name: servizio.titolo,
          path: `/servizi/${servizio.tax_servizio.slug}/${servizio.slug}`,
          iconLeft: 'it-settings',
          attrs: { 'data-element': 'service-link' },
        })),
        ...list,
      ];
    },
  };
}

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
</script>

<template>
  <Page :title="settings.nav.home.name" :description="settings.nav.home.description">
    <template v-if="homepage">
      <h1 class="visually-hidden">{{ settings.municipalityName }}</h1>

      <section v-if="homepage?.galleriaSfondo?.length" class="galleria-sfondo drop-shadow-dark">
        <Carousel v-if="homepage.galleriaSfondo?.length > 1" three-cols show-arrows img="big" track-class="p-0">
          <CarouselSlide v-for="img in homepage.galleriaSfondo" :key="img.id">
            <StrapiMedia :data="img" />
          </CarouselSlide>
        </Carousel>
        <StrapiMedia v-else :data="homepage.galleriaSfondo[0]" />
      </section>

      <section v-if="newsInEvidenza?.first">
        <div class="container">
          <div class="row">
            <div class="col-12 mt-4 mb-2 px-0">
              <h2 class="ps-lg-4">In evidenza</h2>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-6 order-2 order-lg-1 ps-0">
              <Card
                no-bg
                :rounded="false"
                :date="newsInEvidenza.first?.data"
                date-near-category
                :read-more-link="newsInEvidenza.readMore?.link"
                :read-more-label="newsInEvidenza.readMore?.label"
                class="mb-5 pb-5 px-0 no-after"
              >
                <template #category>
                  <Icon name="it-calendar" size="sm" class="me-1" />
                  <NuxtLink
                    :to="getTaxPath(settings.nav.novita.menu, newsInEvidenza.first.tax_notizia)"
                    class="text-decoration-none"
                  >
                    {{ newsInEvidenza.first.tax_notizia.nome }}
                  </NuxtLink>
                </template>
                <template #title>
                  <NuxtLink
                    :to="`${getTaxPath(settings.nav.novita.menu, newsInEvidenza.first.tax_notizia)}/${
                      newsInEvidenza.first.slug
                    }`"
                    class="text-decoration-none"
                  >
                    {{ newsInEvidenza.first.titolo }}
                  </NuxtLink>
                </template>
                <template #text>
                  <p class="font-sans-serif fs-6 pt-2">{{ newsInEvidenza.first.descrizione }}</p>

                  <div v-if="newsInEvidenza.first.argomenti?.length" class="mt-4">
                    <h4 class="visually-hidden">Argomenti</h4>

                    <Chip
                      v-for="tag in newsInEvidenza.first.argomenti"
                      :key="tag.id"
                      :label="tag.nome"
                      :to="`/argomenti/${tag.slug}`"
                      :data-attribute="tag?.vocabolario"
                      simple
                      color="primary"
                    />
                  </div>
                </template>
              </Card>
            </div>
            <div v-if="newsInEvidenza.first.immagine" class="col-lg-6 order-1 order-lg-2 px-0 px-lg-3">
              <StrapiMedia
                :data="newsInEvidenza.first.immagine"
                :simple-img="[1000]"
                class="novita-featured-img img-fluid"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="newsInEvidenza?.others?.length || homepage.mostraAvvisiInScadenza || eventiInEvidenza?.length"
        class="section section-muted px-lg-5 pt-0"
      >
        <div v-if="newsInEvidenza?.others?.length" class="container-xxl row mx-auto mb-2">
          <div
            v-if="!showNewsInEvidenzaAsCarousel && newsInEvidenza.others.length < 9"
            class="other-news-section row g-4"
          >
            <CardWrapper v-for="notizia in newsInEvidenza.others" :key="notizia.id" class="col-md-6 col-xl-4">
              <Card
                :date="notizia.data"
                img-panoramic
                date-near-category
                class="border border-light no-after shadow-sm mx-0"
                title-class="fs-4"
              >
                <template v-if="notizia.immagine && isDesktop" #img>
                  <StrapiMedia :data="notizia.immagine" :simple-img="[500]" />
                </template>
                <template #category>
                  <NuxtLink
                    :to="getTaxPath(settings.nav.novita.menu, notizia.tax_notizia)"
                    class="text-decoration-none"
                  >
                    {{ notizia.tax_notizia.nome }}
                  </NuxtLink>
                </template>
                <template #title>
                  <NuxtLink
                    :to="`${getTaxPath(settings.nav.novita.menu, notizia.tax_notizia)}/${notizia.slug}`"
                    class="text-decoration-none"
                  >
                    {{ notizia.titolo }}
                  </NuxtLink>
                </template>
                <template #text>
                  <p class="font-sans-serif fs-6">{{ notizia.descrizione }}</p>

                  <div v-if="notizia.argomenti?.length" class="mt-4">
                    <h4 class="visually-hidden">Argomenti</h4>

                    <Chip
                      v-for="tag in notizia.argomenti"
                      :key="tag.id"
                      :label="tag.nome"
                      :to="`/argomenti/${tag.slug}`"
                      :data-attribute="tag?.vocabolario"
                      simple
                      color="primary"
                    />
                  </div>
                </template>
              </Card>
            </CardWrapper>
          </div>
          <CarouselCardsWrap v-else :items="newsInEvidenza.others" :wrap-if="!isDesktop" class="other-news-section">
            <template #item="notizia">
              <Card
                :date="notizia.data"
                date-near-category
                img-panoramic
                class="border border-light shadow-sm no-after mx-0"
                title-class="fs-4"
              >
                <template v-if="notizia.immagine && isDesktop" #img>
                  <StrapiMedia :data="notizia.immagine" :simple-img="[500]" />
                </template>
                <template #category>
                  <NuxtLink
                    :to="getTaxPath(settings.nav.novita.menu, notizia.tax_notizia)"
                    class="text-decoration-none"
                  >
                    {{ notizia.tax_notizia.nome }}
                  </NuxtLink>
                </template>
                <template #title>
                  <NuxtLink
                    :to="`${getTaxPath(settings.nav.novita.menu, notizia.tax_notizia)}/${notizia.slug}`"
                    class="text-decoration-none"
                  >
                    {{ notizia.titolo }}
                  </NuxtLink>
                </template>
                <template #text>
                  <p class="font-sans-serif fs-6">{{ notizia.descrizione }}</p>

                  <div v-if="notizia.argomenti?.length" class="mt-4">
                    <h4 class="visually-hidden">Argomenti</h4>

                    <Chip
                      v-for="tag in notizia.argomenti"
                      :key="tag.id"
                      :label="tag.nome"
                      :to="`/argomenti/${tag.slug}`"
                      :data-attribute="tag?.vocabolario"
                      simple
                      color="primary"
                    />
                  </div>
                </template>
              </Card>
            </template>
          </CarouselCardsWrap>

          <div class="d-flex justify-content-end mt-4">
            <Button
              :to="settings.nav.novita.routes.tutte"
              color="primary"
              outline
              class="show-all-btn"
              data-element="live-button-events"
            >
              Tutte le novità
              <Icon name="it-arrow-right" size="xs" color="primary" />
            </Button>
          </div>
        </div>

        <div
          v-if="homepage.mostraAvvisiInScadenza || eventiInEvidenza?.length"
          id="calendario"
          class="container-xxl row mx-auto"
        >
          <StrapiFetch
            v-if="homepage.mostraAvvisiInScadenza"
            id="avvisi-in-scadenza"
            :find="avvisiInScadenzaQuery"
            class="container-xxl pt-4 pb-3"
            no-fallback
          >
            <template #response="{ data: avvisiInScadenza }">
              <h2 class="px-2">Avvisi in scadenza</h2>

              <div class="row">
                <CarouselCardsWrap :items="avvisiInScadenza" :wrap-if="!isDesktop">
                  <template #item="notizia">
                    <Card class="border border-light shadow-sm no-after mx-0" title-class="fs-4" body-class="pt-2">
                      <template v-if="notizia?.dataScadenza" #pre-body>
                        <time :datetime="notizia.dataScadenza" class="h6 m-0 mt-3 ms-auto px-4">
                          <small>scadenza </small>
                          <span class="text-capitalize">{{ formatDate(notizia.dataScadenza, 'dd MMM') }}</span>
                        </time>
                      </template>
                      <template #title>
                        <NuxtLink
                          :to="`${getTaxPath(settings.nav.novita.menu, notizia.tax_notizia)}/${notizia.slug}`"
                          class="text-decoration-none"
                        >
                          {{ notizia.titolo }}
                        </NuxtLink>
                      </template>
                      <template #text>
                        <p class="font-sans-serif fs-6">{{ notizia.descrizione }}</p>
                      </template>
                    </Card>
                  </template>
                </CarouselCardsWrap>
              </div>
            </template>
          </StrapiFetch>

          <div v-if="eventiInEvidenza?.length" class="pt-4 pb-3">
            <h2 class="px-2">Eventi</h2>

            <div class="container-xxl row mx-auto mb-2">
              <div v-if="!showEventiInEvidenzaAsCarousel && eventiInEvidenza.length < 9" class="row g-4 mt-0">
                <CardWrapper v-for="evento in eventiInEvidenza" :key="evento.id" class="col-md-6 col-xl-4">
                  <Card
                    class="border border-light shadow-sm"
                    img-panoramic
                    title-class="fs-4"
                    :date="evento.dataInizio"
                    :date-end="eventHasMoreDays(evento) ? evento.dataFine : undefined"
                    :read-more-link="`${settings.nav.vivereIlComune.routes.eventi}/${evento.tax_evento.slug}/${evento.slug}`"
                    read-more-label="Leggi di più"
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
                    <template #text>
                      <p class="font-sans-serif fs-6">{{ evento.descrizione }}</p>
                    </template>
                  </Card>
                </CardWrapper>
              </div>
              <CarouselCardsWrap v-else :items="eventiInEvidenza" :wrap-if="!isDesktop" class="mt-0">
                <template #item="evento">
                  <Card
                    class="border border-light shadow-sm"
                    img-panoramic
                    title-class="fs-4"
                    :date="evento.dataInizio"
                    :date-end="eventHasMoreDays(evento) ? evento.dataFine : undefined"
                    :read-more-link="`${settings.nav.vivereIlComune.routes.eventi}/${evento.tax_evento.slug}/${evento.slug}`"
                    read-more-label="Leggi di più"
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
                    <template #text>
                      <p class="font-sans-serif fs-6">{{ evento.descrizione }}</p>
                    </template>
                  </Card>
                </template>
              </CarouselCardsWrap>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <Button
                :to="settings.nav.vivereIlComune.routes.eventi"
                color="primary"
                outline
                class="show-all-btn"
                data-element="live-button-events"
              >
                Tutti gli eventi
                <Icon name="it-arrow-right" size="xs" color="primary" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="homepage?.argomenti?.length"
        id="argomenti"
        class="section argomenti-evidenza position-relative py-5 px-lg-5 position-relative"
      >
        <Hero class="argomenti-evidenza-background position-absolute top-0 start-0 end-0" role="presentation">
          <template v-if="homepage?.immagineArgomenti" #img>
            <StrapiMedia :data="homepage.immagineArgomenti" />
          </template>
        </Hero>

        <div class="container-xxl row mx-auto">
          <h2 class="section-title text-white">Argomenti in evidenza</h2>

          <CardWrapper teaser class="argomenti-evidenza-wrapper">
            <Card
              v-for="argomento in homepage.argomenti.slice(0, 3)"
              :key="argomento.id"
              :title="argomento.nome"
              title-class="text-secondary"
              :read-more-link="`/argomenti/${argomento.slug}`"
              read-more-label="Esplora argomento"
              body-class="pb-3"
              class="border border-light"
            >
              <template v-if="argomento.note" #text>{{ argomento.note }}</template>

              <div class="my-3">
                <StrapiFetch
                  v-if="homepage?.argomentiNotizie && homepage.argomentiNotizie > 0"
                  :id="`argomento-notizie_${argomento.slug}`"
                  :find="getNotizieArgomentoQuery(argomento)"
                  no-fallback
                >
                  <template #response="{ data: notizieList }">
                    <small class="mb-1 fw-bold">Notizie</small>

                    <List :link-list="notizieList" :list-item-attrs="{ class: 'text-decoration-underline px-0' }" />
                  </template>
                </StrapiFetch>

                <StrapiFetch
                  v-if="homepage?.argomentiServizi && homepage.argomentiServizi > 0"
                  :id="`argomento-servizi_${argomento.slug}`"
                  :find="getServiziArgomentoQuery(argomento)"
                  no-fallback
                >
                  <template #response="{ data: serviziList }">
                    <small class="mb-1 fw-bold">Servizi</small>

                    <List :link-list="serviziList" :list-item-attrs="{ class: 'text-decoration-underline px-0' }" />
                  </template>
                </StrapiFetch>
              </div>
            </Card>
          </CardWrapper>
        </div>

        <div v-if="homepage?.altriArgomenti?.length" class="container pt-4">
          <div class="d-flex justify-content-center">
            <div class="row d-lg-inline-flex">
              <div class="col-lg-3 text-center">
                <h3 class="small fw-bold text-secondary text-uppercase text-lg-end pt-2">Altri argomenti</h3>
              </div>
              <div class="col-lg-9">
                <ul class="list-unstyled d-flex flex-wrap justify-content-center justify-content-lg-start gap-1 mt-2">
                  <li v-for="argomento in homepage.altriArgomenti" :key="argomento.id">
                    <Chip
                      :label="argomento.nome"
                      :to="`/argomenti/${argomento.slug}`"
                      :data-vocabulary="argomento?.vocabolario"
                      simple
                      color="primary"
                    />
                  </li>
                </ul>
              </div>
              <div class="text-center pt-4">
                <Button to="/argomenti" color="primary">Mostra tutti</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="homepage?.linkAccessoRapido?.length"
        id="accesso-rapido"
        class="section accesso-rapido px-lg-5 pt-0"
      >
        <div class="container-xxl row mx-auto">
          <h2 class="px-2">Accesso rapido</h2>

          <CardWrapper teaser class="accesso-rapido-wrapper">
            <Card
              v-for="sito in homepage.linkAccessoRapido"
              :key="sito.id"
              :title="sito.titolo"
              title-class="text-white"
              :to="sito.link"
              class="text-white text-decoration-none shadow-none p-3"
              :style="sito?.coloreSfondo ? { 'background-color': sito?.coloreSfondo } : {}"
            >
              <template #pre-body>
                <Avatar v-if="sito.immagine" :title="sito.titolo" size="lg" class="me-3">
                  <StrapiMedia :data="sito.immagine" :simple-img="[80]" :img-attrs="{ alt: sito.titolo }" no-caption />
                </Avatar>
                <Icon v-else :name="sito.icona ?? 'it-link'" color="white" class="my-1" />
              </template>
              <template v-if="sito.descrizione" #text>
                <p class="text-white">{{ sito.descrizione }}</p>
              </template>
            </Card>
          </CardWrapper>
        </div>
      </section>

      <section v-if="homepage?.sitiTematici?.length" id="siti-tematici" class="section siti-tematici px-lg-5 pt-0">
        <div class="container-xxl row mx-auto">
          <h2 class="px-2">Siti tematici</h2>

          <CardWrapper teaser class="siti-tematici-wrapper">
            <Card
              v-for="sito in homepage.sitiTematici"
              :key="sito.id"
              :title="sito.titolo"
              title-class="text-white"
              :to="sito.link"
              class="text-white text-decoration-none shadow-none p-3"
              :style="sito?.coloreSfondo ? { 'background-color': sito?.coloreSfondo } : {}"
            >
              <template #pre-body>
                <Avatar v-if="sito.immagine" :title="sito.titolo" size="lg" class="me-3">
                  <StrapiMedia :data="sito.immagine" :simple-img="[80]" :img-attrs="{ alt: sito.titolo }" no-caption />
                </Avatar>
                <Icon v-else :name="sito.icona ?? 'it-link'" color="white" class="my-1" />
              </template>
              <template v-if="sito.descrizione" #text>
                <p class="text-white">{{ sito.descrizione }}</p>
              </template>
            </Card>
          </CardWrapper>
        </div>
      </section>

      <section
        v-if="homepage.mostraAmministrazione && (sindaco || organiDiGoverno?.length)"
        id="amministrazione"
        class="section section-muted px-lg-5 py-5"
      >
        <div class="container-xxl row mx-auto">
          <h2 class="px-2 pb-4">Amministrazione</h2>

          <div class="row px-1">
            <CardWrapper v-if="sindaco" class="col-md-12 col-lg-4">
              <Card class="shadow-sm border border-light no-after" title-class="fs-4">
                <template #heading>
                  <div class="p-4 pb-0 d-flex justify-content-between align-items-start">
                    <Avatar
                      v-if="sindaco?.immagine"
                      :to="`${settings.nav.amministrazione.routes.persone}/${sindaco.slug}`"
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
                    </Avatar>
                    <div class="etichetta">
                      <Icon name="it-user" />
                      <span>Politici</span>
                    </div>
                  </div>
                </template>
                <template #title>
                  <NuxtLink
                    :to="`${settings.nav.amministrazione.routes.persone}/${sindaco.slug}`"
                    class="text-decoration-none"
                  >
                    Sindaco - {{ sindaco.cognome }} {{ sindaco.nome }}
                  </NuxtLink>
                </template>
              </Card>
            </CardWrapper>

            <CardWrapper
              v-for="organoDiGoverno in organiDiGoverno"
              :key="organoDiGoverno.id"
              class="col-md-12 col-lg-4"
            >
              <Card class="shadow-sm border border-light no-after" title-class="fs-4">
                <template #heading>
                  <div class="p-4 pb-0">
                    <div class="etichetta">
                      <Icon name="it-pa" />
                      <span>Organi di governo</span>
                    </div>
                  </div>
                </template>
                <template #title>
                  <NuxtLink
                    :to="`${settings.nav.amministrazione.routes.organiDiGoverno}/${organoDiGoverno.slug}`"
                    class="text-decoration-none"
                  >
                    {{ organoDiGoverno.titolo }}
                  </NuxtLink>
                </template>
              </Card>
            </CardWrapper>
          </div>
        </div>
      </section>

      <section v-if="homepage?.linkUtili?.length" class="section section-muted link-utili p-0 pt-5 pb-3">
        <div class="container">
          <div class="row d-flex justify-content-center">
            <div class="col-12 col-lg-6">
              <div class="m-4 mt-0 pb-2">
                <Button to="/cerca" color="primary" outline icon block class="py-2">
                  <div class="d-inline-flex align-items-top my-1">
                    <Icon name="it-search" color="primary" size="sm" class="me-2" />
                    <span>Cerca su tutto il sito</span>
                  </div>
                </Button>
              </div>
            </div>

            <List
              :link-list="
                homepage.linkUtili.map(({ titolo, link }) => ({
                  name: titolo,
                  path: link,
                }))
              "
              :list-item-attrs="{ class: 'text-decoration-underline' }"
              large
              class="link-utili-wrapper"
            >
              <template #heading>
                <h2 class="header h6 text-uppercase p-0">Link utili</h2>
              </template>
            </List>
          </div>
        </div>
      </section>
    </template>
  </Page>
</template>

<style lang="scss" scoped>
.galleria-sfondo {
  max-height: v-bind(galleriaSfondoMaxHeight);

  :deep(.it-carousel-wrapper) {
    margin: 0;
    width: 100%;
    max-width: unset;

    .figure {
      width: 100%;

      img {
        width: 100%;
        object-fit: cover;
        object-position: center;
        max-height: v-bind(galleriaSfondoMaxHeight);
      }
    }

    .splide__arrows {
      left: 1rem;
      right: 1rem;
      top: 43%;

      .splide__arrow {
        background: none;
        color: $white;

        .icon,
        .icon svg {
          width: 5rem;
          height: 5rem;
          fill: $primary-a1;
        }
      }
    }

    .splide__pagination {
      position: relative;
      top: -40px;

      button {
        width: 15px;
        height: 15px;

        background-color: $primary-a1;
        box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.5);

        &.is-active {
          background-color: $primary-a12;
          box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.5);
        }
      }
    }
  }

  // single image
  :deep(.figure) {
    width: 100%;

    img {
      width: 100%;
      object-fit: cover;
      object-position: center;
      max-height: v-bind(galleriaSfondoMaxHeight);
    }
  }
}

.other-news-section {
  position: relative;
  margin-top: -50px;

  @include media-breakpoint-down(md) {
    margin-top: -70px;
  }
}

.novita-featured-img {
  height: 400px;
  width: 100%;
  object-fit: cover;
  object-position: center;

  @include media-breakpoint-down(lg) {
    height: auto;
    max-height: 300px;
  }
}

.argomenti-evidenza {
  .section-title {
    z-index: 1;
    text-shadow: 0 3px 15px rgba(0, 0, 0, 0.8);
  }

  &-background {
    max-height: 300px;
    min-height: 300px;

    :deep(.img-wrapper img) {
      max-height: 300px;
      width: 100vw;
      display: block;
      object-fit: cover;
      object-position: center;
    }
  }

  &-wrapper {
    align-items: stretch;

    :deep(.card) {
      flex: 0 0 100%;

      @include media-breakpoint-up(lg) {
        flex: 0 0 32%;
      }
    }
  }
}

.accesso-rapido,
.siti-tematici {
  &-wrapper {
    align-items: stretch;

    :deep(.card) {
      background-color: $primary;

      @include media-breakpoint-up(lg) {
        flex: 0 0 32%;
      }
    }
  }
}

.link-utili {
  :deep(.link-utili-wrapper) {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;

    li {
      flex: 0 0 100%;

      @include media-breakpoint-up(md) {
        flex: 0 0 49%;
      }

      @include media-breakpoint-up(lg) {
        flex: 0 0 32%;
      }

      &.link-list-heading {
        flex: 0 0 100%;
      }
    }
  }
}
</style>
