<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import { onClickOutside } from '@vueuse/core';
import { Popover } from 'bootstrap-italia';
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

const popover = ref<HTMLElement | null>(null);
let bsPopover: Popover;

const slots = useSlots();
const uuid = uuidv4();

const trigger = computed(() => {
  const triggers = [];
  if (props.click) triggers.push('click');
  if (props.hover) triggers.push('hover');
  if (props.focus) triggers.push('focus');

  return triggers.join(' ') as
    | 'click'
    | 'hover'
    | 'focus'
    | 'click hover'
    | 'click focus'
    | 'hover focus'
    | 'click hover focus';
});

onMounted(async () => {
  await nextTick();
  const content = slots.content ? document.getElementById(`content-${uuid}`)?.innerHTML : undefined;
  const title = slots.title ? document.getElementById(`title-${uuid}`)?.innerHTML : undefined;

  if (popover.value instanceof HTMLElement) {
    bsPopover = new Popover(popover.value, {
      title: title ?? props.title,
      content: content ?? props.content,
      container: props.container,
      placement: props.placement,
      html: !!content,
      sanitize: !!content,
      trigger: trigger.value,
    });
  }
});

onClickOutside(popover, () => bsPopover?.hide());

onUnmounted(() => bsPopover?.dispose());
</script>

<template>
  <button ref="popover" type="button" :title="title" :class="classes" :tabindex="focus ? 0 : undefined">
    <slot />

    <span v-if="$slots.title" v-show="false" :id="`title-${uuid}`" data-element="title">
      <slot name="title" />
    </span>

    <div v-if="$slots.content" v-show="false" :id="`content-${uuid}`" data-element="content">
      <slot name="content" />
    </div>
  </button>
</template>
