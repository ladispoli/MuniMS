<script lang="ts" setup>
import type { NuxtError } from 'nuxt/app';

interface Props {
  error: Partial<NuxtError>;
}

const props = defineProps<Props>();

const message = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'Pagina non trovata';
    case 500:
      return 'Errore interno del server';
    default:
      return 'Errore nel caricamento della pagina';
  }
});
</script>

<template>
  <div>
    <NuxtLayout :breadcrumb="[{ title: 'Errore' }]">
      <div :key="$route.fullPath" class="container text-center mb-5">
        <div class="pb-4">
          <h1>{{ error.statusCode }}</h1>
          <h2 class="h5">{{ message }}</h2>

          <DevOnly>
            <div class="text-start my-4">
              <code>
                <span>{{ error.statusMessage || error.message }}</span>

                <div class="py-4">
                  <h3 class="h6">stack trace</h3>
                  <div v-html="error.stack" />
                </div>
              </code>
            </div>
          </DevOnly>
        </div>

        <Button color="primary" role="link" class="my-3" icon @click="clearError({ redirect: '/' })">
          Torna alla Home
        </Button>
      </div>
    </NuxtLayout>
  </div>
</template>
