<script lang="ts" setup>
import type { EventiInEvidenza, Evento } from '~/types/strapi';

const { settings } = useConfigStore();
const route = useRoute();

const page = settings.nav.vivereIlComune.menu.find(({ path }) => path === route.matched[0].path);
if (!page) showError({ statusCode: 404 });

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
  },
  transform: ({ eventi }: EventiInEvidenza) => eventi ?? [],
});

const eventiQuery = ref({
  index: 'evento',
  itemT: {} as Evento,
  sort: ['dataInizio:desc'],
});
</script>

<template>
  <Page :title="page?.name" :description="page?.description">
    <PageHeading class="pb-4" show-actions />

    <section v-if="eventiInEvidenza" class="section section-muted py-5">
      <h2 class="mb-4 text-black">Eventi in evidenza</h2>

      <div class="container">
        <div class="row g-4">
          <CardWrapper v-for="evento in eventiInEvidenza" :key="evento.id" class="col-lg-6 col-xl-4">
            <Card
              class="border border-light shadow-sm"
              img-panoramic
              :date="evento.dataInizio"
              :date-end="eventHasMoreDays(evento) ? evento.dataFine : undefined"
              :read-more-link="$route.path + `/${evento.tax_evento.slug}/${evento.slug}`"
              read-more-label="Leggi di più"
            >
              <template v-if="evento.immagine" #img>
                <StrapiMedia :data="evento.immagine" :simple-img="[800]" />
              </template>
              <template #category>
                <NuxtLink :to="$route.path + `/${evento.tax_evento.slug}`" class="text-decoration-none">
                  {{ evento.tax_evento.nome }}
                </NuxtLink>
              </template>
              <template #title>
                <NuxtLink :to="$route.path + `/${evento.tax_evento.slug}/${evento.slug}`" class="text-decoration-none">
                  {{ evento.titolo }}
                </NuxtLink>
              </template>
              <template #text>{{ evento.descrizione }}</template>
            </Card>
          </CardWrapper>
        </div>
      </div>
    </section>

    <section class="section px-0 py-5">
      <div class="container">
        <h2 class="pb-4">Tutti gli Eventi</h2>

        <StrapiSearch :find="eventiQuery">
          <template #response="{ data: eventi }">
            <div class="row g-4">
              <CardWrapper v-for="evento in eventi" :key="evento.id" class="col-lg-6 col-xl-4">
                <Card
                  img-panoramic
                  :date="evento.dataInizio"
                  :date-end="eventHasMoreDays(evento) ? evento.dataFine : undefined"
                  :read-more-link="$route.path + `/${evento.tax_evento.slug}/${evento.slug}`"
                  read-more-label="Leggi di più"
                  class="border border-light shadow-sm"
                >
                  <template v-if="evento.immagine" #img>
                    <StrapiMedia :data="evento.immagine" :simple-img="[800]" />
                  </template>
                  <template #category>
                    <NuxtLink :to="$route.path + `/${evento.tax_evento.slug}`" class="text-decoration-none">
                      <StrapiSearchHighlight attr="tax_evento_nome" :item="evento" />
                    </NuxtLink>
                  </template>
                  <template #title>
                    <NuxtLink
                      :to="$route.path + `/${evento.tax_evento.slug}/${evento.slug}`"
                      class="text-decoration-none"
                    >
                      <StrapiSearchHighlight attr="titolo" :item="evento" />
                    </NuxtLink>
                  </template>
                  <template #text><StrapiSearchHighlight attr="descrizione" :item="evento" /></template>
                </Card>
              </CardWrapper>
            </div>
          </template>
        </StrapiSearch>
      </div>
    </section>
  </Page>
</template>
