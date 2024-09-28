<script lang="ts" setup>
import '@fontsource/titillium-web';
import '@fontsource/lora';
import '@fontsource/roboto-mono';
import type { AvvisoGenerale } from './types/strapi';

const configStore = useConfigStore();

await callOnce(configStore.fetch);

const user = useStrapiUser();

useHeadSafe(() => {
  const { favicon, logo } = configStore.settings;
  const icon = favicon ?? logo;
  if (icon) {
    return {
      link: [{ rel: 'icon', type: icon.mime, href: useStrapiMediaUrl(icon.url) }],
    };
  }
  return {};
});

const { data: avviso } = await useStrapiFetch<AvvisoGenerale>('avviso', {
  contentType: 'avviso-generale',
  singleEntry: true,
});
</script>

<template>
  <div>
    <TheHeader />

    <article v-if="avviso?.attivo && avviso?.contenuto" class="bg-warning">
      <div class="container p-3">
        <div class="d-flex flex-column align-items-center flex-sm-row">
          <Icon name="it-error" color="white" size="lg" class="me-sm-4 mb-2 mb-sm-0" />
          <StrapiRichText :html="avviso?.contenuto" class="text-white" />
        </div>
      </div>
    </article>

    <NuxtLayout>
      <div :key="$route.fullPath">
        <NuxtLoadingIndicator color="var(--bs-teal, #0073E6)" />
        <NuxtPage />
      </div>
    </NuxtLayout>

    <TheFooter />

    <article v-if="user" class="logged-user-banner bg-info">
      <div class="container p-3">
        <div class="row">
          <span class="col-8 text-white">Benvenuto, {{ user?.username }}!</span>
          <span class="col-4">
            <NuxtLink to="/logout" class="text-white">
              <Icon name="it-logout" color="white" size="sm" class="me-1" />
              Logout
            </NuxtLink>
          </span>
        </div>
      </div>
    </article>
  </div>
</template>

<style lang="scss" scoped>
.logged-user-banner {
  position: sticky;
  bottom: 0;
}
</style>
