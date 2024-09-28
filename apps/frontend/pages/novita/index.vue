<script lang="ts" setup>
import type { Notizia, NotizieInEvidenza } from '~/types/strapi';

const { settings } = useConfigStore();

const page = settings.nav.novita;
if (!page) showError({ statusCode: 404 });

const today = formatDate(new Date(), 'yyyy-MM-dd');

const { data: newsInEvidenza } = await useStrapiFetch<Array<Notizia>>('notizie-in-evidenza', {
  contentType: 'notizie-in-evidenza',
  singleEntry: true,
  params: {
    populate: {
      notizie: {
        fields: ['slug', 'titolo', 'data', 'descrizione', 'dataScadenza'],
        populate: ['argomenti', 'tax_notizia', 'immagine'],
      },
    },
  },
  transform: ({ notizie, mostraSoloInHomepage }: NotizieInEvidenza) => {
    if (mostraSoloInHomepage) {
      return [];
    }
    return notizie?.filter(({ dataScadenza }) => !dataScadenza || dataScadenza >= today) ?? [];
  },
});

const newsQuery = {
  index: 'notizia',
  itemT: {} as Notizia,
  sort: ['data:desc'],
  transform: (notizie: Array<Notizia>) => {
    const inEvidenzaIds = newsInEvidenza?.map(({ id }) => id) ?? [];

    let left = 0;
    let right = notizie.length - 1;
    while (left < right) {
      if (inEvidenzaIds.includes(notizie[left].id)) {
        // Swap elements to move with the rightmost non-matching element
        while (left < right && inEvidenzaIds.includes(notizie[right].id)) {
          right--;
        }
        [notizie[left], notizie[right]] = [notizie[right], notizie[left]];
        right--;
      }
      left++;
    }

    return notizie;
  },
};
</script>

<template>
  <Page :title="page.name" :description="page.description">
    <PageHeading :nav="page" class="drop-shadow pb-4" />

    <section v-if="newsInEvidenza?.length" id="in-evidenza" class="container py-5">
      <h2 class="mb-4">In evidenza</h2>

      <div class="row g-4">
        <CardWrapper v-for="notizia in newsInEvidenza" :key="notizia.id" class="col-md-6 col-xl-4">
          <Card class="border border-light shadow-sm" img-panoramic :date="notizia.data" date-near-category>
            <template v-if="notizia.immagine" #img>
              <StrapiMedia :data="notizia.immagine" :simple-img="[800]" />
            </template>
            <template #category>
              <NuxtLink :to="getTaxPath(page.menu, notizia.tax_notizia)" class="text-decoration-none">
                {{ notizia.tax_notizia.nome }}
              </NuxtLink>
            </template>
            <template #title>
              <NuxtLink
                :to="`${getTaxPath(page.menu, notizia.tax_notizia)}/${notizia.slug}`"
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
    </section>

    <section id="tutte" class="section section-muted py-2 px-0">
      <div class="container">
        <h2 class="mb-4 mt-5">Esplora tutte le novità</h2>

        <StrapiSearch :find="newsQuery">
          <template #response="{ data: notizie }">
            <div class="row g-4">
              <CardWrapper v-for="notizia in notizie" :key="notizia.id" class="col-md-6 col-xl-4">
                <Card class="border border-light shadow-sm" img-panoramic :date="notizia.data">
                  <template v-if="notizia.immagine" #img>
                    <StrapiMedia :data="notizia.immagine" :simple-img="[800]" />
                  </template>
                  <template #category>
                    <NuxtLink :to="getTaxPath(page.menu, notizia.tax_notizia)" class="text-decoration-none">
                      <StrapiSearchHighlight attr="tax_notizia_nome" :item="notizia" />
                    </NuxtLink>
                  </template>
                  <template #title>
                    <NuxtLink
                      :to="`${getTaxPath(page.menu, notizia.tax_notizia)}/${notizia.slug}`"
                      class="text-decoration-none"
                    >
                      <StrapiSearchHighlight attr="titolo" :item="notizia" />
                    </NuxtLink>
                  </template>
                  <template #text>
                    <p class="font-sans-serif fs-6"><StrapiSearchHighlight attr="descrizione" :item="notizia" /></p>
                  </template>
                </Card>
              </CardWrapper>
            </div>
          </template>
          <template #fallback>
            <div class="p-4 text-center">Nessuna novità trovata</div>
          </template>
        </StrapiSearch>
      </div>
    </section>

    <section class="container py-5">
      <h2 class="mb-4">Esplora per categoria</h2>

      <div class="row g-4">
        <CardWrapper v-for="item in page.menu" :key="item.path" class="col-12 col-md-6 col-lg-4 pb-0">
          <Card class="shadow-sm border border-light no-after" no-bg>
            <template #title>
              <NuxtLink :to="item.path" class="text-decoration-none">{{ item.name }}</NuxtLink>
            </template>
            <span v-if="item?.description">{{ item.description }}</span>
          </Card>
        </CardWrapper>
      </div>
    </section>
  </Page>
</template>
