<script lang="ts" setup>
import { Accordion } from 'bootstrap-italia';

export type AccordionState = Record<string, boolean>;

export interface AccordionInitData {
  id: string;
  defaultOpened?: boolean;
}

export interface AccordionProvided {
  accordionState: AccordionState;
  initState(data: AccordionInitData): {
    id: string;
    isOpened: boolean;
  };
  toggleState(id: string): void;
}

interface Props {
  keepOpen?: boolean;
  background?: string;
  iconLeft?: boolean;
}

const props = defineProps<Props>();

const classes = computed(() => {
  const classes: Array<any> = ['accordion'];

  if (props.background) classes.push(`accordion-background-${props.background}`);

  return [...classes, { 'accordion-left-icon': props.iconLeft }];
});

const accordion = ref<HTMLElement | null>(null);
let bsAccordion: Accordion;

onMounted(async () => {
  await nextTick();
  if (accordion.value instanceof HTMLElement) {
    bsAccordion = new Accordion(accordion.value);
  }
});

const state = ref<AccordionState>({});

function onItemInit({ id, defaultOpened }: AccordionInitData) {
  state.value[id] = !!defaultOpened || false;
}

function onItemToggle(id: string) {
  const newState = { ...state.value };
  const newItemValue = !newState[id];

  if (!props.keepOpen) {
    for (const id in newState) {
      newState[id] = false;
    }
  }

  newState[id] = newItemValue;
  state.value = newState;
}

provide('accordion', {
  accordionState: state,
  toggleState: onItemToggle,
  initState: onItemInit,
});
</script>

<template>
  <div ref="accordion" :class="classes">
    <slot />
  </div>
</template>
