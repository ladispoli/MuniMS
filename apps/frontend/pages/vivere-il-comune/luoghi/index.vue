<script lang="ts" setup>
import type { LuoghiInEvidenza, Luogo } from '~/types/strapi';

const { settings } = useConfigStore();
const route = useRoute();

const page = settings.nav.vivereIlComune.menu.find(({ path }) => path === route.matched[0].path);
if (!page) showError({ statusCode: 404 });

const { data: luoghiInEvidenza } = await useStrapiFetch<Array<Luogo>>('luoghi-in-evidenza', {
  contentType: 'luoghi-in-evidenza',
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
});

const luoghiQuery = {
  index: 'luogo',
  itemT: {} as Luogo,
  sort: ['nome:asc'],
};
</script>

<template>
  <Page :title="page?.name" :description="page?.description">
    <PageHeading class="drop-shadow pb-4" show-actions />

    <section v-if="luoghiInEvidenza" class="section section-muted py-5">
      <h2 class="mb-4 text-black">Luoghi in evidenza</h2>

      <div class="container">
        <div class="row g-4">
          <CardWrapper v-for="luogo in luoghiInEvidenza" :key="luogo.id" class="col-lg-6 col-xl-4">
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
      </div>
    </section>

    <section class="section px-0 py-5">
      <div class="container">
        <StrapiSearch :find="luoghiQuery">
          <template #response="{ data: luoghi }">
            <div class="row g-4">
              <CardWrapper v-for="luogo in luoghi" :key="luogo.id" class="col-lg-6 col-xl-4">
                <Card
                  class="border border-light shadow-sm"
                  img-panoramic
                  :read-more-link="$route.path + `/${luogo.tax_luogo.slug}/${luogo.slug}`"
                  read-more-label="Leggi di più"
                >
                  <template v-if="luogo.immagine" #img>
                    <StrapiMedia :data="luogo.immagine" :simple-img="[800]" />
                  </template>
                  <template #category>
                    <NuxtLink :to="$route.path + `/${luogo.tax_luogo.slug}`" class="text-decoration-none">
                      <StrapiSearchHighlight attr="tax_luogo_nome" :item="luogo" />
                    </NuxtLink>
                  </template>
                  <template #title>
                    <NuxtLink :to="$route.path + `/${luogo.tax_luogo.slug}/${luogo.slug}`" class="text-decoration-none">
                      <StrapiSearchHighlight attr="nome" :item="luogo" />
                    </NuxtLink>
                  </template>
                  <template #text><StrapiSearchHighlight attr="descrizione" :item="luogo" /></template>
                </Card>
              </CardWrapper>
            </div>
          </template>
          <template #fallback>
            <div class="text-center p-4">Nessun luogo trovato</div>
          </template>
        </StrapiSearch>
      </div>
    </section>
  </Page>
</template>
