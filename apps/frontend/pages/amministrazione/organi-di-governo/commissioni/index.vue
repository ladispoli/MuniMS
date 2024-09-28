<script lang="ts" setup>
definePageMeta({
  title: 'Commissioni',
  description:
    'Il Consiglio istituisce al suo interno Commissioni consiliari con funzioni propositive, consultive e referenti in ordine agli atti di sua competenza.',
});

const { settings } = useConfigStore();
</script>

<template>
  <Page>
    <PageHeading :nav="settings.nav.amministrazione" class="pb-4" />

    <StrapiCollectionUnitaOrganizzative
      query-filters="tax_unita_organizzativa.slug=struttura-politica_commissione"
      :search-stats-label="{
        singular: 'commissione trovata in ordine alfabetico',
        plural: 'commissioni trovate in ordine alfabetico',
      }"
    />
  </Page>
</template>
