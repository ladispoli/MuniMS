<script lang="ts" setup>
import { AisHighlight } from 'vue-instantsearch/vue3/es';

interface Props {
  attr?: string;
  item?: any;
}

const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
  <AisHighlight
    :attribute="attr"
    :hit="item"
    :class-names="{
      'ais-Highlight': 'strapi-search-highlight',
      'ais-Highlight-highlighted': 'strapi-search-highlight-highlighted',
    }"
  />
</template>

<style lang="scss" scoped>
.strapi-search-highlight {
  font-size: inherit;

  :deep(.strapi-search-highlight-highlighted) {
    font-size: inherit;
    padding: 0;
    background-color: $color-background-highlight;
    color: inherit;
  }
}
</style>
