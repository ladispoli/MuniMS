<script lang="ts" setup>
import type { Color } from '~/types/bootstrap-italia';

interface Props {
  label?: string;
  color?: Color;
  pill?: boolean;
  to?: string;
  href?: string; // alias of 'to'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'secondary',
});

const link = computed(() => props.to ?? props.href);

const classes = computed(() => {
  const classes: Array<any> = ['badge'];

  if (props.color) classes.push(`bg-${props.color}`);
  return [...classes, { 'rounded-pill': props.pill }, { 'text-secondary': props.color === 'light' }];
});

const NuxtLink = resolveComponent('NuxtLink');
</script>

<template>
  <component :is="link ? NuxtLink : 'span'" :class="classes" :to="link">
    <slot>{{ label }}</slot>
  </component>
</template>
