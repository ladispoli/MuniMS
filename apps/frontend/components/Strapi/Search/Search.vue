<script lang="ts" setup generic="ItemT">
import {
  AisInstantSearch,
  AisConfigure,
  AisPanel,
  AisHits,
  AisInfiniteHits,
  AisSearchBox,
  AisPagination,
  AisStats,
  AisRefinementList,
} from 'vue-instantsearch/vue3/es';

export interface StrapiSearchQueryObject<ItemT> {
  index: string;
  itemT?: ItemT; // utility variable to infer the type of item (results) object
  sort?: Array<string>; // pass meilisearch sort parameters, make sure to configure them first: https://www.meilisearch.com/docs/learn/fine_tuning_results/sorting
  filters?: string; // use filters syntax, make sure to configure filters first: https://www.algolia.com/doc/api-reference/api-parameters/filters/
  pageSize?: number; // pagination
  hideIfEmptyFetch?: StrapiFetchQueryObject<ItemT>; // hide the search if the fetch returns no results
  transform?: (items: Array<ItemT>) => Array<ItemT>;
}

export interface StrapiSearchResponse<ItemT> {
  data: Array<ItemT>;
}

interface Props {
  find: StrapiSearchQueryObject<ItemT>;
  placeholder?: string;
  autofocus?: boolean;
  noPagination?: boolean;
  noFallback?: boolean;
  filterAttr?: string;
  infiniteScroll?: boolean;
  infiniteScrollLabel?: string;
  hideStats?: boolean;
  statsLabel?: {
    singular: string;
    plural: string;
  };
  pageSize?: number; // overrides pageSize in find
  paginationPageCount?: number; // total pages to show in the pagination
  paginationPagesPerView?: number;
  showTotalResults?: boolean;
  on?: string; // wrapper component to render
  searchClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Cerca per parola chiave',
  infiniteScrollLabel: 'Carica altri risultati',
  statsLabel: () => ({
    singular: 'risultato trovato',
    plural: 'risultati trovati',
  }),
  paginationPagesPerView: 4,
  on: 'div',
});

const user = useStrapiUser();
const searchClient = useInstantSearch();

const indexSearch = computed(() => {
  const sortString = props.find.sort?.length ? ':' + props.find.sort.join(',') : '';
  return props.find.index + sortString;
});

const hitsPerPage = computed(() => props.pageSize ?? props.find.pageSize ?? 6); // default is 6

const firstFetchIsEmpty = ref(false);

const filters = computed(() => {
  const filters = [];
  if (props.find?.filters) {
    filters.push(props.find.filters);
  }
  if (!user.value) {
    filters.push('publishedAt IS NOT NULL');
  }

  return filters.join(' AND ');
});

onBeforeMount(async () => {
  if (props.find.hideIfEmptyFetch) {
    const { meta } = await useStrapiFetch(
      `${props.find.hideIfEmptyFetch.contentType}_count-for-search`,
      props.find.hideIfEmptyFetch,
      { immediate: true },
    );

    if (meta?.pagination.total === 0) {
      firstFetchIsEmpty.value = true;
    }
  }
});
</script>

<template>
  <component :is="on" v-show="!firstFetchIsEmpty">
    <slot name="header" />

    <AisInstantSearch :search-client="searchClient" :index-name="indexSearch" :class="['strapi-search', searchClass]">
      <AisConfigure :hits-per-page.camel="hitsPerPage" :filters="filters" />

      <AisPanel v-if="filterAttr">
        <template #default="{ hasRefinements }">
          <AisRefinementList v-if="hasRefinements" :attribute="filterAttr" limit="5">
            <template #default="{ items }">
              <fieldset>
                <legend>
                  <h3 class="visually-hidden">filtri da applicare</h3>
                </legend>

                <ul class="list-unstyled">
                  <li>
                    <Chip v-for="item in items" :key="item.value" simple>
                      {{ item.label }}
                    </Chip>
                  </li>
                </ul>
              </fieldset>
            </template>
          </AisRefinementList>
        </template>
      </AisPanel>

      <AisSearchBox
        :placeholder="placeholder"
        :autofocus="autofocus"
        :show-loading-indicator="false"
        submit-title="cerca"
        reset-title="cancella"
        class="strapi-search-box"
      >
        <template #submit-icon><Icon name="it-search" color="primary" size="sm" /></template>
        <template #reset-icon><Icon name="it-close" color="primary" /></template>
      </AisSearchBox>

      <AisStats v-if="!hideStats" class="my-2">
        <template #default="{ nbHits, processingTimeMS }">
          <strong>{{ nbHits }}</strong> {{ nbHits === 1 ? statsLabel.singular : statsLabel.plural }} in
          {{ processingTimeMS }}ms
        </template>
      </AisStats>

      <AisInfiniteHits v-if="infiniteScroll" :transform-items="find?.transform" class="strapi-search-results mt-4">
        <template #default="{ items: data, refineNext, isLastPage }">
          <slot v-if="data?.length" name="response" v-bind="{ data } as StrapiSearchResponse<ItemT>" />

          <slot v-else-if="!noFallback" name="fallback">
            <div class="p-4 text-center">Nessun risultato trovato</div>
          </slot>

          <div v-if="!isLastPage" class="d-flex justify-content-center pt-4 mt-2">
            <Button color="primary" outline data-element="load-other-cards" @click="refineNext">
              {{ infiniteScrollLabel }}
            </Button>
          </div>
        </template>
      </AisInfiniteHits>
      <AisHits v-else :transform-items="find?.transform" class="strapi-search-results mt-4">
        <template #default="{ items: data }">
          <slot v-if="data?.length" name="response" v-bind="{ data } as StrapiSearchResponse<ItemT>" />

          <slot v-else-if="!noFallback" name="fallback">
            <div class="p-4 text-center">Nessun risultato trovato</div>
          </slot>
        </template>
      </AisHits>

      <slot />

      <AisPagination
        v-if="!noPagination && !infiniteScroll"
        :padding="Math.ceil(paginationPagesPerView / 2 - 1)"
        class="my-4"
      >
        <template #default="{ currentRefinement, pages, nbHits, isFirstPage, isLastPage, refine }">
          <nav
            v-show="!(isFirstPage && isLastPage)"
            :class="['pagination-wrapper justify-content-center', { 'pagination-total': showTotalResults }]"
            label="Pagine dei risultati di ricerca"
          >
            <ul class="pagination mb-0">
              <li :class="['page-item', { disabled: isFirstPage }]">
                <NuxtLink
                  class="page-link text"
                  role="button"
                  :aria-current="undefined"
                  data-element="pager-link"
                  @click="refine(currentRefinement - 1)"
                  @keyup.left="refine(currentRefinement - 1)"
                >
                  <slot name="prev-page">
                    <Icon name="it-chevron-left" color="primary" />
                  </slot>
                  <span class="visually-hidden">Pagina precedente</span>
                </NuxtLink>
              </li>

              <li v-if="currentRefinement > 1" class="page-item">
                <span class="page-link">...</span>
              </li>

              <li v-for="page in pages" :key="`page-${page}`" class="page-item">
                <NuxtLink
                  class="page-link"
                  role="button"
                  :aria-current="page === currentRefinement ? 'page' : undefined"
                  data-element="pager-link"
                  @click="refine(page)"
                >
                  {{ page + 1 }}
                </NuxtLink>
              </li>

              <li v-if="Math.ceil(nbHits / hitsPerPage) > currentRefinement + 2 && !isLastPage" class="page-item">
                <span class="page-link">...</span>
              </li>

              <li :class="['page-item', { disabled: isLastPage }]">
                <NuxtLink
                  class="page-link text"
                  role="button"
                  :aria-current="undefined"
                  data-element="pager-link"
                  @click="refine(currentRefinement + 2)"
                  @keyup.right="refine(currentRefinement + 2)"
                >
                  <span class="visually-hidden">Pagina successiva</span>
                  <slot name="next-page">
                    <Icon name="it-chevron-right" color="primary" />
                  </slot>
                </NuxtLink>
              </li>
            </ul>

            <p v-if="showTotalResults && nbHits > 1">Totale {{ nbHits }} elementi</p>
          </nav>
        </template>
      </AisPagination>
    </AisInstantSearch>

    <slot name="footer" />
  </component>
</template>

<style lang="scss" scoped>
.strapi-search {
  :deep(.strapi-search-box) {
    input[type='search'] {
      padding-left: 2.5rem;
      padding-right: 2.5rem;
    }

    button[type='submit'] {
      left: 0.5rem;

      .icon {
        vertical-align: baseline;
        margin-top: -0.1rem;
      }
    }

    button[type='reset'] {
      right: 0.8rem;

      .icon {
        vertical-align: baseline;
        margin-top: -0.3rem;
      }
    }
  }
}
</style>
