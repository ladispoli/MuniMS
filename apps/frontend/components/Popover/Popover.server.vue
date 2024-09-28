<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import type { Color, Size } from '~/types/bootstrap-italia';

interface Props {
  title?: string;
  content?: string;
  container?: 'body' | false; // Specifica container: 'body' per evitare problemi di rendering in componenti più complessi (come nei gruppi di input, gruppi di pulsanti, etc)
  placement?: 'top' | 'right' | 'left' | 'bottom';
  // trigger popup
  click?: boolean;
  hover?: boolean;
  focus?: boolean;
  // button props
  color?: Color;
  size?: Size;
  outline?: boolean;
  disabled?: boolean;
  plain?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  content: '',
  container: false,
  placement: 'right',
  click: true,
  size: 'md',
});

const popover = ref<HTMLElement | null>(null);

const uuid = uuidv4();

const classes = computed(() => {
  const classes: Array<any> = ['btn', 'fade', 'show'];

  if (!!props.outline || !!props.color) {
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
      'btn-plain': props.plain,
      disabled: props.disabled,
    },
    'font-sans-serif',
  ];
});
</script>

<template>
  <button ref="popover" type="button" :title="title" :class="classes" :tabindex="focus ? 0 : undefined">
    <slot />

    <span v-if="$slots.title" v-show="false" :id="`title-${uuid}`" data-element="title">
      <slot name="title" />
    </span>

    <div v-if="$slots.html" :id="`content-${uuid}`" class="d-none">
      <slot name="html" />
    </div>
  </button>
</template>
