<script lang="ts" setup generic="ItemT">
// Multi-index search: https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/multi-index-search/vue/#build-a-multi-source-autocomplete-experience

import { AisIndex, AisInfiniteHits } from 'vue-instantsearch/vue3/es';
import type { StrapiSearchQueryObject, StrapiSearchResponse } from '~/components/Strapi/Search/Search.vue';

interface Props {
  find: StrapiSearchQueryObject<ItemT>;
  noFallback?: boolean;
  more?: boolean;
  moreLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  moreLabel: 'Carica altri risultati',
});

const indexSearch = computed(() => {
  const sortString = props.find.sort?.length ? ':' + props.find.sort.join(',') : '';
  return props.find.index + sortString;
});
</script>

<template>
  <AisIndex :index-name="indexSearch" class="strapi-search-index">
    <AisInfiniteHits :transform-items="find?.transform" class="mt-4">
      <template #default="{ items: data, refineNext, isLastPage }">
        <slot v-if="data?.length" name="response" v-bind="{ data } as StrapiSearchResponse<ItemT>" />

        <slot v-else-if="!noFallback" name="fallback">
          <div class="p-4 text-center">Nessun risultato trovato</div>
        </slot>

        <div v-if="more && !isLastPage" class="d-flex justify-content-center pt-4 mt-2">
          <Button color="primary" outline data-element="load-other-cards" @click="refineNext">{{ moreLabel }}</Button>
        </div>
      </template>
    </AisInfiniteHits>
  </AisIndex>
</template>
