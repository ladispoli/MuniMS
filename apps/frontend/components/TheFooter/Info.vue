<script lang="ts" setup>
import type { Color } from '~/types/bootstrap-italia';

interface Props {
  title?: string;
  href?: string; // alias of 'to'
  to?: string;
  target?: string;
  icon?: string;
  iconColor?: Color;
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'white',
});

const link = computed(() => props.to ?? props.href);
</script>

<template>
  <span class="footer-info-item">
    <Icon v-if="icon" :name="icon" :color="iconColor" size="sm" class="me-1" />
    <span v-if="title">{{ title }}</span>

    <NuxtLink v-if="link" :to="link" class="text-white" :target="target">
      <slot />
    </NuxtLink>
    <slot v-else />

    <br />
  </span>
</template>

<style lang="scss" scoped>
.footer-info-item {
  a {
    @include on-event {
      text-decoration: none;
    }
  }
}
</style>
