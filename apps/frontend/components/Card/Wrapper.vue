<script lang="ts" setup>
export interface CardWrapperProvided {
  teaser: boolean;
  teaserLarge: boolean;
}

interface Props {
  spacing?: boolean;
  teaser?: boolean;
  teaserLarge?: boolean;
  stretch?: boolean;
}

const props = defineProps<Props>();

provide('card-wrapper', {
  teaser: props?.teaser || false,
  teaserLarge: props?.teaserLarge || false,
});
</script>

<template>
  <div
    :class="[
      'card-wrapper font-sans-serif',
      { 'card-space': spacing, 'card-teaser-wrapper': teaser || teaserLarge, stretch },
    ]"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.card-wrapper {
  &.stretch {
    align-items: stretch;
  }
}
</style>
