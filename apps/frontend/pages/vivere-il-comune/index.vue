<script lang="ts" setup>
import type { Evento, Luogo, LuoghiInEvidenza, EventiInEvidenza } from '~/types/strapi';

const { settings } = useConfigStore();

const eventiQuery = {
  contentType: 'eventi-in-evidenza',
  dataT: {} as Array<Evento>,
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
};

const luoghiQuery = {
  contentType: 'luoghi-in-evidenza',
  dataT: {} as Array<Luogo>,
  singleEntry: true,
  params: {
    populate: {
      luoghi: {
        fields: ['slug', 'nome', 'descrizione'],
        populate: ['immagine', 'tax_luogo'],
      },
    },
  },
  transform: ({ luoghi }: LuoghiInEvidenza) => luoghi ?? [],
};
</script>

<template>
  <Page :title="settings.nav.vivereIlComune.name" :description="settings.nav.vivereIlComune.description">
    <PageHeading :nav="settings.nav.vivereIlComune" class="pb-4" />

    <section class="section section-muted py-5">
      <h2 class="mb-4 text-black">Eventi in evidenza</h2>

      <StrapiFetch id="eventi" :find="eventiQuery">
        <template #response="{ data: eventi }">
          <div v-if="eventi?.length" class="row g-4">
            <CardWrapper v-for="evento in eventi" :key="evento.id" class="col-lg-6 col-xl-4">
              <Card
                class="border border-light shadow-sm"
                img-panoramic
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
                <template #text>{{ evento.descrizione }}</template>
              </Card>
            </CardWrapper>
          </div>
          <div v-else class="text-center p-4">Nessun evento trovato</div>

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
        </template>
        <template #fallback>
          <div class="text-center p-4">Nessun evento trovato</div>
        </template>
      </StrapiFetch>
    </section>

    <section class="section py-5">
      <h2 class="mb-4 text-black">Luoghi in evidenza</h2>

      <StrapiFetch id="luoghi-evidenza" :find="luoghiQuery">
        <template #response="{ data: luoghi }">
          <div v-if="luoghi?.length" class="row g-4">
            <CardWrapper v-for="luogo in luoghi" :key="luogo.id" class="col-lg-6 col-xl-4">
              <Card
                class="border border-light shadow-sm"
                img-panoramic
                :read-more-link="`${settings.nav.vivereIlComune.routes.luoghi}/${luogo.tax_luogo.slug}/${luogo.slug}`"
                read-more-label="Leggi di più"
              >
                <template v-if="luogo.immagine" #img>
                  <StrapiMedia :data="luogo.immagine" :simple-img="[800]" />
                </template>
                <template #category>
                  <NuxtLink
                    :to="`${settings.nav.vivereIlComune.routes.luoghi}/${luogo.tax_luogo.slug}`"
                    class="text-decoration-none"
                  >
                    {{ luogo.tax_luogo.nome }}
                  </NuxtLink>
                </template>
                <template #title>
                  <NuxtLink
                    :to="`${settings.nav.vivereIlComune.routes.luoghi}/${luogo.tax_luogo.slug}/${luogo.slug}`"
                    class="text-decoration-none"
                  >
                    {{ luogo.nome }}
                  </NuxtLink>
                </template>
                <template #text>{{ luogo.descrizione }}</template>
              </Card>
            </CardWrapper>
          </div>
          <div v-else class="text-center p-4">Nessun luogo in evidenza trovato</div>

          <div class="d-flex justify-content-end mt-4">
            <Button
              :to="settings.nav.vivereIlComune.routes.luoghi"
              color="primary"
              class="show-all-btn"
              data-element="live-button-locations"
            >
              Tutti i luoghi
            </Button>
          </div>
        </template>
        <template #fallback>
          <div class="text-center p-4">Nessun luogo in evidenza trovato</div>
        </template>
      </StrapiFetch>
    </section>
  </Page>
</template>

<style lang="scss" scoped>
:deep(.show-all-btn) {
  @include media-breakpoint-down(md) {
    display: block;
    width: 100%;
  }
}
</style>
