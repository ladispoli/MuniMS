<script lang="ts" setup>
import { AisRefinementList, AisClearRefinements } from 'vue-instantsearch/vue3/es';

interface Item {
  value: string;
  label: string;
  isRefined: boolean;
}

interface Props {
  attr?: string;
  operator?: 'and' | 'or';
  sort?: Array<string>; // pass meilisearch sort parameters, make sure to configure them first: https://www.meilisearch.com/docs/learn/fine_tuning_results/sorting
  limit?: number;
  items?: Array<Item>; // override Facets list (values must correspond to original facets values), to display facets with no matches: https://www.algolia.com/doc/guides/building-search-ui/widgets/customize-an-existing-widget/js/?language=js#display-facets-with-no-matches
  heading?: string;
  clearLabel?: string;
  showCurrent?: boolean;
  hideCount?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  operator: 'or',
  clearLabel: 'Rimuovi tutti i filtri',
  itemsSort: 'desc',
});

const includedAttrs = computed(() => (props.attr ? [props.attr] : []));
const sortBy = props.sort ? props.sort : [];

function clearRefinements(refine: () => any) {
  refine();

  if (props.items?.length) {
    for (const item of props.items) {
      item.isRefined = false;
    }
  }
}

function toggleRefinement(refine: (value: string) => any, item: Item) {
  refine(item.value);

  if (props.items?.length) {
    item.isRefined = !item.isRefined;
  }
}
</script>

<template>
  <fieldset>
    <h3 class="visually-hidden">filtri da applicare</h3>

    <legend>
      <slot name="heading">
        <h3 class="header small fw-bold text-uppercase">{{ heading }}</h3>
      </slot>
    </legend>

    <AisClearRefinements :included-attributes="includedAttrs" class="ms-auto">
      <template #default="{ refine }">
        <Button class="p-2" size="xs" @click="clearRefinements(refine)">
          {{ clearLabel }}
        </Button>
      </template>
    </AisClearRefinements>

    <AisRefinementList
      :attribute="attr"
      :sort-by="sortBy"
      :operator="operator"
      :limit="limit"
      show-more
      :show-more-limit="500"
    >
      <template #default="{ items: filteredItems, refine, toggleShowMore, canToggleShowMore, isShowingMore }">
        <ul v-if="items?.length" class="list-unstyled">
          <li v-for="item in items" :key="item.value">
            <div class="form-check">
              <input
                :id="`checkbox-${item.value}`"
                v-model="item.isRefined"
                type="checkbox"
                @click="toggleRefinement(refine, item)"
              />
              <label :for="`checkbox-${item.value}`">
                <span class="h6">{{ item.label }}</span>
              </label>
            </div>
          </li>
        </ul>
        <ul v-else class="list-unstyled">
          <li v-for="item in filteredItems" :key="`${item.value}-filtered`">
            <div class="form-check">
              <input
                :id="`checkbox-${item.value}`"
                v-model="item.isRefined"
                type="checkbox"
                @click="refine(item.value)"
              />
              <label :for="`checkbox-${item.value}`">
                <span class="h6">{{ item.label }}</span>
                <span v-if="!hideCount"> ({{ item.count.toLocaleString() }})</span>
              </label>
            </div>
          </li>
        </ul>

        <LazyButton v-if="canToggleShowMore && !items?.length" color="primary" outline @click="toggleShowMore()">
          {{ !isShowingMore ? 'Mostra altri' : 'Mostra meno' }}
        </LazyButton>
      </template>
    </AisRefinementList>
  </fieldset>
</template>
