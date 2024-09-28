<script lang="ts" setup>
import { Tooltip } from 'bootstrap-italia';
import { v4 as uuidv4 } from 'uuid';
import type { Color, Size } from '~/types/bootstrap-italia';

interface Props {
  title?: string;
  container?: 'body' | false; // Specifica container: 'body' per evitare problemi di rendering in componenti più complessi (come nei gruppi di input, gruppi di pulsanti, etc)
  placement?: 'top' | 'right' | 'left' | 'bottom';
  button?: boolean; // the tooltip should render on an button tag, default is an anchor tag
  nowrap?: boolean; // set whitespace-nowrap to avoid centered tooltips on multi-line anchor tags
  // button props
  color?: Color;
  size?: Size;
  outline?: boolean;
  disabled?: boolean;
  plain?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  container: false,
  placement: 'top',
});

const classes = computed(() => {
  const classes: Array<any> = ['btn'];

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

const tooltip = ref<HTMLElement | null>(null);
let bsTooltip: Tooltip;

const slots = useSlots();
const uuid = uuidv4();

onMounted(async () => {
  await nextTick();
  const title = slots.title ? document.getElementById(`title-${uuid}`)?.innerHTML : undefined;

  if (tooltip.value instanceof HTMLElement) {
    bsTooltip = new Tooltip(tooltip.value, {
      title: title ?? props.title,
      container: props.container,
      placement: props.placement,
      html: !!slots.title,
    });
  }
});

onUnmounted(() => bsTooltip?.dispose());
</script>

<template>
  <component
    :is="button ? 'button' : 'a'"
    ref="tooltip"
    :href="!button ? '#' : undefined"
    :title="title"
    :style="nowrap ? 'white-space: nowrap' : undefined"
    :class="button ? classes : []"
  >
    <slot />

    <span v-if="$slots.title" v-show="false" :id="`title-${uuid}`" data-element="title">
      <slot name="title" />
    </span>
  </component>
</template>
