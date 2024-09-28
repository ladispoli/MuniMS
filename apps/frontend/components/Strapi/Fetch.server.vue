<script lang="ts" setup generic="DataT">
import type { NuxtError } from 'nuxt/app';
import type { StrapiFetchOptions, StrapiFetchQueryObject } from '~/composables/useStrapiFetch';

export type StrapiFetchFallbackError = '404' | Partial<NuxtError>;

interface Props extends StrapiFetchOptions<DataT> {
  id: string; // key to ensure multiple fetches in the same route path
  find: StrapiFetchQueryObject<DataT>;
  fallbackError?: StrapiFetchFallbackError;
  noFallback?: boolean;
  on?: string; // wrapper component to render
  paginationAttrs?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  on: 'div',
  lazy: false,
  server: true,
  immediate: true,
});

const container = ref<HTMLElement>();

const route = useRoute();

const query = props.find;

const options = {
  lazy: props?.lazy,
  default: props?.default,
  server: props?.server,
  immediate: props?.immediate,
  watch: props?.watch,
};

const response = ref(await useStrapiFetch<DataT>(props.id, query, options));

if (query.pagination?.pageParam) {
  const { pageParam } = query.pagination;

  watch(
    () => route.query[pageParam],
    async (newQueryPage) => {
      if (query.params?.pagination && 'page' in query.params.pagination && !Array.isArray(newQueryPage)) {
        query.params.pagination.page = Number(newQueryPage);

        // @ts-ignore
        response.value = await useStrapiFetch<DataT>(props.id, query, options);
      }
    },
  );
}

const fallbackErrorData = computed(() => {
  if (props.fallbackError === '404') {
    // default 404 message
    return { statusCode: 404 };
  }

  return props.fallbackError;
});
</script>

<template>
  <component :is="on" ref="container">
    <slot v-if="response.pending" name="loading">
      <div class="p-4 text-center">
        <Progress spinner double />
      </div>
    </slot>

    <div v-else-if="response.error">
      <div class="p-4 text-center">Errore {{ response.error?.statusCode ?? response.error?.status }}</div>
      <DevOnly>
        <code>
          <pre class="mx-3">"error": {{ response.error }}</pre>
        </code>
      </DevOnly>
    </div>

    <template v-else-if="response.data">
      <slot name="response" v-bind="{ data: response.data, meta: response.meta }" />

      <Pagination
        v-if="query.pagination?.pageParam && response.meta?.pagination.pageCount"
        :page-param="query.pagination?.pageParam"
        :page-count="response.meta?.pagination.pageCount"
        :pages-per-view="5"
        more
        v-bind="paginationAttrs"
        class="pt-4"
      />
    </template>

    <!-- status 204 -->
    <slot v-else-if="!noFallback" name="fallback">
      {{ fallbackErrorData && showError(fallbackErrorData) }}
      <div class="p-4 text-center">Nessun risultato trovato</div>
    </slot>
  </component>
</template>
