<script lang="ts" setup>
definePageMeta({
  title: 'Consulte',
  description:
    'È lo strumento di collegamento diretto delle rappresentanze dei cittadini con gli Organi di governo locale al fine poter favorire il confronto e il dialogo.',
});

const { settings } = useConfigStore();
</script>

<template>
  <Page>
    <PageHeading :nav="settings.nav.amministrazione" class="pb-4" />

    <StrapiCollectionUnitaOrganizzative
      query-filters="tax_unita_organizzativa.slug=struttura-politica_consulta"
      :search-stats-label="{
        singular: 'consulta trovata in ordine alfabetico',
        plural: 'consulte trovate in ordine alfabetico',
      }"
    />
  </Page>
</template>
