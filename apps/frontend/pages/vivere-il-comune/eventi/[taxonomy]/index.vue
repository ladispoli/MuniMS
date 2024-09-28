<script lang="ts" setup>
import type { Taxonomy, Evento } from '~/types/strapi';

const { settings } = useConfigStore();
const route = useRoute();

const today = formatDate(new Date(), 'yyyy-MM-dd');

const categoriaQuery = ref({
  contentType: 'tax-eventi',
  singleEntry: true,
  dataT: {} as Taxonomy,
  params: {
    filters: {
      slug: route.params.taxonomy,
    },
  },
});

const { data: eventiAttuali } = await useStrapiFetch<Array<Evento>>('eventi-attuali', {
  contentType: 'eventi',
  params: {
    filters: {
      tax_evento: {
        slug: route.params.taxonomy,
      },
      dataFine: {
        $gte: today,
      },
    },
    fields: ['slug', 'titolo', 'descrizione', 'dataInizio', 'dataFine'],
    populate: ['immagine', 'tax_evento'],
    sort: ['dataInizio:desc'],
  },
  pagination: {
    pageSize: 6,
    pageParam: 'p',
  },
});

const eventiPassatiQuery = {
  index: 'evento',
  itemT: {} as Evento,
  filters: `tax_evento.slug=${route.params.taxonomy} AND dataFine_timestamp < ${new Date().getTime()}`,
  sort: ['dataInizio:desc'],
};
</script>

<template>
  <StrapiFetch id="categoria" :find="categoriaQuery" fallback-error="404">
    <template #response="{ data: categoria }">
      <Page
        :title="categoria.nome"
        :description="categoria.note ?? `Tutti gli eventi nella categoria: ${categoria.tassonomia}`"
      >
        <PageHeading class="pb-4" show-actions />

        <section class="section section-muted px-0 py-5">
          <div class="container">
            <div class="row g-4">
              <h2 class="pb-4">Prossimi eventi</h2>

              <template v-if="eventiAttuali?.length">
                <CardWrapper v-for="evento in eventiAttuali" :key="evento.id" class="col-lg-6 col-xl-4">
                  <Card
                    class="border border-light shadow-sm"
                    img-panoramic
                    :date="evento.dataInizio"
                    :date-end="eventHasMoreDays(evento) ? evento.dataFine : undefined"
                    :read-more-link="$route.path + `/${evento.slug}`"
                    read-more-label="Leggi di più"
                  >
                    <template v-if="evento.immagine" #img>
                      <StrapiMedia :data="evento.immagine" :simple-img="[800]" />
                    </template>
                    <template #title>
                      <NuxtLink :to="$route.path + `/${evento.slug}`" class="text-decoration-none">
                        {{ evento.titolo }}
                      </NuxtLink>
                    </template>
                    <template #text>{{ evento.descrizione }}</template>
                  </Card>
                </CardWrapper>
              </template>
              <div v-else class="text-center p-4">Nessun evento trovato</div>
            </div>
          </div>
        </section>

        <section class="section px-0 py-5">
          <div class="container">
            <StrapiSearch :find="eventiPassatiQuery">
              <template #response="{ data: eventi }">
                <div class="row g-4">
                  <h2 class="pb-4">Eventi passati</h2>

                  <CardWrapper v-for="evento in eventi" :key="evento.id" class="col-lg-6 col-xl-4">
                    <Card
                      class="border border-light shadow-sm"
                      :category="evento.tax_evento.nome"
                      img-panoramic
                      :date="evento.dataInizio"
                      :date-end="eventHasMoreDays(evento) ? evento.dataFine : undefined"
                      :read-more-link="$route.path + `/${evento.slug}`"
                      read-more-label="Leggi di più"
                    >
                      <template v-if="evento.immagine" #img>
                        <StrapiMedia :data="evento.immagine" :simple-img="[800]" />
                      </template>
                      <template #title>
                        <NuxtLink :to="$route.path + `/${evento.slug}`" class="text-decoration-none">
                          {{ evento.titolo }}
                        </NuxtLink>
                      </template>
                      <template #text>{{ evento.descrizione }}</template>
                    </Card>
                  </CardWrapper>
                </div>
              </template>
              <template #fallback>
                <div class="text-center p-4">Nessun evento trovato</div>
              </template>
            </StrapiSearch>
          </div>
        </section>
      </Page>
    </template>
  </StrapiFetch>
</template>
