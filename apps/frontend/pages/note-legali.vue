<script lang="ts" setup>
import type { NoteLegali } from '~/types/strapi';

const { settings } = useConfigStore();

const { data: noteLegali } = await useStrapiFetch<NoteLegali>('note-legali', {
  contentType: 'note-legali',
  singleEntry: true,
});
</script>

<template>
  <Page
    :title="settings.nav.noteLegali.name"
    :description="settings.nav.noteLegali.description"
    :updated-at="noteLegali?.updatedAt"
  >
    <PageHeading :title-data="{ element: 'legal-notes-section' }" />
    <PageContent no-index>
      <StrapiRichText v-if="noteLegali?.contenuto" :html="noteLegali.contenuto" data-element="legal-notes-body" />
    </PageContent>
  </Page>
</template>
