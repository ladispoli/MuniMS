<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';
import type { Color, Size } from '~/types/bootstrap-italia';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  color?: Color;
  outline?: boolean;
  disabled?: boolean;
  value?: string;
  size?: Size;
  block?: boolean;
  mobileBlock?: boolean;
  icon?: boolean;
  to?: RouteLocationRaw;
  href?: string; // alias of 'to'
  target?: string;
  plain?: boolean;
  progress?: boolean; // has a progress bar inside
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  size: 'md',
});

const link = computed(() => props.to ?? props.href);

const classes = computed(() => {
  const classes: Array<any> = ['btn'];

  if (props.outline || props.color) {
    let className = 'btn';
    if (props.outline) className += '-outline';
    if (props.color) className += `-${props.color}`;
    classes.push(className);
  }

  if (props.size) {
    classes.push(`btn-${props.size}`);
  }

  return [
    ...classes,
    {
      'btn-block': props.block || props.mobileBlock,
      'btn-mobile-block': props.mobileBlock,
      'btn-icon': props.icon,
      'btn-plain': props.plain,
      'btn-progress': props.progress,
      disabled: props.disabled,
    },
    'font-sans-serif',
  ];
});

const button = ref<HTMLElement | null>(null);

defineExpose({ button });
</script>

<template>
  <NuxtLink
    v-if="link"
    ref="button"
    :class="classes"
    :type="type"
    :aria-disabled="disabled ? true : false"
    :to="link"
    :target="target"
  >
    <slot />
  </NuxtLink>
  <input
    v-else-if="value"
    ref="button"
    :class="classes"
    :type="type"
    :value="value"
    :aria-disabled="disabled ? true : false"
  />
  <button v-else ref="button" :class="classes" :type="type" :aria-disabled="disabled ? true : false">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.btn {
  &-block {
    display: block;
    width: 100%;
  }
  &-mobile-block {
    @include media-breakpoint-up(md) {
      width: 50%;
    }
  }

  &-plain {
    &:not(:disabled):not(.disabled) {
      box-shadow: none;

      @include on-event {
        box-shadow: none;
      }
    }
  }
}
</style>
