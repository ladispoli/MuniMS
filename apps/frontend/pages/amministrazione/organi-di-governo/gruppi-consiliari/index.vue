<script lang="ts" setup>
definePageMeta({
  title: 'Gruppi consiliari',
  description:
    'I consiglieri possono organizzarsi in gruppi qualora abbiano sostenuto il medesimo candidato sindaco o siano sotto lo stesso contrassegno di lista.',
});

const { settings } = useConfigStore();
</script>

<template>
  <Page>
    <PageHeading :nav="settings.nav.amministrazione" class="pb-4" />

    <StrapiCollectionGruppiConsiliari on="section" wrapper-class="page-section py-5" />
  </Page>
</template>
