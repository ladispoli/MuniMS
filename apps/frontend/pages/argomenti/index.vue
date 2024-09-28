<script lang="ts" setup>
import type { TaxArgomento } from '~/types/strapi';

definePageMeta({
  title: 'Argomenti',
  description:
    "Gli argomenti rispondono a un'esigenza di organizzazione dei contenuti del sito istituzionale per temi e rappresentano le principali categorie di contenuti, informazioni e documenti specifici.",
});

const featuredArgomentiQuery = ref({
  contentType: 'argomenti',
  dataT: {} as Array<TaxArgomento>,
  params: {
    populate: 'immagine',
    sort: 'nome',
    pagination: {
      pageSize: 300,
      page: 1,
    },
  },
  transform: (argomenti: Array<TaxArgomento>) => argomenti.filter((argomento) => argomento?.immagine),
});

const tuttiArgomentiQuery = {
  index: 'argomento',
  itemT: {} as TaxArgomento,
  sort: ['nome:asc'],
  pageSize: 9,
};

function getDescription(argomento: TaxArgomento) {
  return argomento?.note ?? 'Servizi comunali, documenti, uffici, notizie ed eventi relativi a ' + argomento.nome;
}
</script>

<template>
  <Page>
    <PageHeading class="drop-shadow pb-4" show-actions />

    <StrapiFetch id="argomenti" :find="featuredArgomentiQuery" fallback-error="404">
      <template #response="{ data: argomenti }">
        <section v-if="argomenti?.length" class="container py-5">
          <h2 class="mb-4">In evidenza</h2>

          <div class="row g-4">
            <div v-for="argomento in argomenti" :key="argomento.id" class="col-sm-6 col-lg-4">
              <div class="img-responsive-wrapper">
                <div class="img-responsive">
                  <NuxtLink
                    :to="`${$route.path}/${argomento.slug}`"
                    :title="argomento.nome"
                    class="text-decoration-none"
                    data-element="topic-element"
                    :data-vocabulary="argomento?.vocabolario"
                  >
                    <StrapiMedia
                      v-if="argomento.immagine"
                      :data="argomento.immagine"
                      overlay="black full"
                      class="img-wrapper rounded"
                    >
                      <h3 class="title">{{ argomento.nome }}</h3>
                    </StrapiMedia>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </StrapiFetch>

    <section class="container py-5">
      <h2 class="mb-4">Esplora per argomento</h2>
      <StrapiSearch :find="tuttiArgomentiQuery" infinite-scroll infinite-scroll-label="Carica altri argomenti">
        <template #response="{ data: argomenti }">
          <div class="row g-4">
            <CardWrapper v-for="argomento in argomenti" :key="argomento.id" class="col-md-6 col-xl-4">
              <Card class="shadow-sm border border-light no-after" no-bg>
                <template #title>
                  <NuxtLink
                    :to="`${$route.path}/${argomento.slug}`"
                    class="text-decoration-none"
                    data-element="topic-element"
                    :data-vocabulary="argomento?.vocabolario"
                  >
                    <StrapiSearchHighlight attr="nome" :item="argomento" />
                  </NuxtLink>
                </template>
                <span>
                  {{ getDescription(argomento) }}
                </span>
              </Card>
            </CardWrapper>
          </div>
        </template>
        <template #fallback>
          <div class="p-4 text-center">Nessun argomento trovato</div>
        </template>
      </StrapiSearch>
    </section>
  </Page>
</template>

<style lang="scss" scoped>
.img-responsive a {
  @include on-event {
    .title {
      text-decoration: underline;
    }
  }
}
</style>
