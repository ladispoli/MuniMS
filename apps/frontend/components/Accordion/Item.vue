<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import type { AccordionProvided } from './Accordion.client.vue';
import type { TitleTag } from '~/types/bootstrap-italia';

interface Props {
  id?: string;
  title?: string;
  titleTag?: TitleTag;
  content?: string;
  isExpanded?: boolean;
  buttonClass?: string;
  toggle?: any;
}

const props = withDefaults(defineProps<Props>(), {
  titleTag: 'h2',
});

const { accordionState, initState, toggleState } = inject<AccordionProvided>('accordion') || {};

const uuid = props?.id ?? uuidv4();

const itemId = ref(`${uuid}accordion-item`);
const itemCollapse = ref<HTMLElement | null>(null);
const isOpen = ref(props.isExpanded);

onMounted(() => {
  if (!initState) {
    throw new Error(
      'no initState function provided, please use AccordionItem components only inside Accordion component',
    );
  }

  initState({ id: itemId.value, defaultOpened: props.isExpanded });
});

function toggleItem() {
  if (!toggleState) return;
  toggleState(itemId.value);
}

function isCollapsing() {
  if (itemCollapse.value && 'collapse' in itemCollapse.value) {
    const collapse = itemCollapse.value.collapse;
    if (collapse instanceof HTMLElement && collapse?.classList.contains('collapsing')) {
      return true;
    }
  }
  return false;
}

watch(
  () => accordionState?.value,
  (newState) => {
    if (typeof newState === 'object' && itemId.value in newState) {
      if (isCollapsing()) return;
      isOpen.value = newState[itemId.value];
    }
  },
);
</script>

<template>
  <div :id="uuid" class="accordion-item">
    <component :is="titleTag" :id="`${uuid}-heading`" class="accordion-header">
      <button
        :class="['accordion-button', buttonClass, { collapsed: !isOpen }]"
        :aria-expanded="isOpen"
        :aria-controls="`${uuid}-collapse`"
        @click="toggleItem()"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </button>
    </component>

    <slot name="after-title" />

    <Collapse
      v-if="content || !!$slots.default"
      :id="`${uuid}-collapse`"
      ref="itemCollapse"
      class="accordion-collapse"
      role="region"
      :aria-labelledby="`${uuid}-heading`"
      :is-expanded="isOpen"
    >
      <div class="accordion-body">
        <slot>{{ content }}</slot>
      </div>
    </Collapse>
  </div>
</template>
