<script lang="ts" setup>
import type { UnitaOrganizzativa } from '~/types/strapi';

const { settings } = useConfigStore();
const route = useRoute();

const page = settings.nav.amministrazione.menu.find(({ path }) => path === route.matched[0].path);
if (!page) showError({ statusCode: 404 });

const routePath = route.path + '/';

const { data: aree } = await useStrapiFetch<Array<UnitaOrganizzativa>>('aree', {
  contentType: 'unita-organizzative',
  dataT: {} as Array<UnitaOrganizzativa>,
  params: {
    fields: ['slug', 'titolo', 'descrizione'],
    filters: {
      tax_unita_organizzativa: {
        slug: 'struttura-amministrativa_area',
      },
    },
    populate: ['logo'],
    sort: ['order', 'titolo'],
  },
});
</script>

<template>
  <Page :title="page?.name" :description="page?.description">
    <PageHeading :nav="settings.nav.amministrazione" class="pb-4" />

    <div v-for="(area, index) in aree" :key="area.id" class="container pt-5 pb-1">
      <div class="row">
        <div class="col-12 col-lg-10 d-lg-flex justify-content-between align-items-top">
          <div class="me-2">
            <h2>{{ area.titolo }}</h2>
            <p>{{ area.descrizione }}</p>
          </div>

          <NuxtLink :to="routePath + area.slug" class="read-more align-items-start py-3">
            <span>Vai all'area</span>
            <Icon name="it-arrow-right" size="xs" color="primary" />
          </NuxtLink>
        </div>
      </div>

      <StrapiCollectionUnitaOrganizzative
        :id="`uffici_${area.slug}`"
        :query-filters="`unita_organizzativa_padre.slug=${area.slug}`"
        :search-stats-label="{
          singular: 'ufficio trovato in ordine alfabetico',
          plural: 'uffici trovati in ordine alfabetico',
        }"
        wrapper-class="my-3"
        hide-parent
        :page-size="3"
        :page-param="`p${index + 1}`"
        no-fallback
      />
    </div>
  </Page>
</template>

<style lang="scss" scoped>
.read-more {
  white-space: nowrap;
}
</style>
