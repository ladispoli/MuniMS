<script lang="ts" setup>
import type { Privacy } from '~/types/strapi';

const { settings } = useConfigStore();

const { data: privacy } = await useStrapiFetch<Privacy>('privacy', {
  contentType: 'privacy',
  singleEntry: true,
});
</script>

<template>
  <Page
    :title="settings.nav.privacy.name"
    :description="settings.nav.privacy.description"
    :updated-at="privacy?.updatedAt"
  >
    <PageHeading />
    <PageContent no-index>
      <StrapiRichText v-if="privacy?.contenuto" :html="privacy.contenuto" />
    </PageContent>
  </Page>
</template>
