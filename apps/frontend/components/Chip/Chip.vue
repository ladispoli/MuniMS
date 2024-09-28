<script lang="ts" setup>
import type { Color } from '~/types/bootstrap-italia';

interface Props {
  label?: string;
  to?: string;
  href?: string; // alias of 'to'
  simple?: boolean;
  large?: boolean;
  dismissible?: boolean;
  disabled?: boolean;
  color?: Color;
}

const props = defineProps<Props>();

const link = computed(() => props.to ?? props.href);

const classes = computed(() => {
  const classes: Array<any> = ['chip'];

  if (props.color) classes.push(`chip-${props.color}`);

  return [...classes, { 'chip-simple': props.simple }, { 'chip-lg': props.large }, { 'chip-disabled': props.disabled }];
});

const NuxtLink = resolveComponent('NuxtLink');
</script>

<template>
  <Alert
    v-if="dismissible"
    :class="classes"
    dismissible
    close-label="Elimina label"
    close-btn-class=""
    :btn-disabled="disabled"
  >
    <span v-if="label || !!$slots.default" class="chip-label">
      <slot>{{ label }}</slot>
    </span>
  </Alert>
  <component
    :is="link ? NuxtLink : 'div'"
    v-else
    :to="link"
    :class="[classes, { 'text-decoration-none text-nowrap': link }]"
  >
    <span v-if="label || !!$slots.default" class="chip-label">
      <slot>{{ label }}</slot>
    </span>
  </component>
</template>

<style lang="scss" scoped>
a.chip {
  line-height: 1.5;

  @include on-event {
    text-decoration: none !important;
  }
}
</style>
