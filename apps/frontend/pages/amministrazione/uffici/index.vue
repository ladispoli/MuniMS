<script lang="ts" setup>
const { settings } = useConfigStore();
const route = useRoute();

const page = settings.nav.amministrazione.menu.find(({ path }) => path === route.matched[0].path);
if (!page) showError({ statusCode: 404 });

const filters = 'tax_unita_organizzativa.slug=struttura-amministrativa_ufficio';
</script>

<template>
  <Page :title="page?.name" :description="page?.description">
    <PageHeading :nav="settings.nav.amministrazione" class="pb-4" />

    <StrapiCollectionUnitaOrganizzative
      query-filters="tax_unita_organizzativa.slug=struttura-amministrativa_ufficio"
      :search-stats-label="{
        singular: 'ufficio trovato in ordine alfabetico',
        plural: 'uffici trovati in ordine alfabetico',
      }"
    />
  </Page>
</template>
