<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';

interface Props {
  id?: string;
  title?: string;
  type?: 'success' | 'warning' | 'danger' | 'important' | 'note';
  icon?: string; // override default icon
  highlight?: boolean;
  more?: boolean;
  moreLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  moreLabel: 'Leggi tutto',
});

const slots = useSlots();

const uuid = props?.id ?? uuidv4();

const classes = computed(() => {
  const classes: Array<any> = ['callout'];

  return [
    ...classes,
    props.type,
    { 'callout-highlight': props.highlight },
    { 'callout-more': props.more || slots.more },
  ];
});

const innerRequired = computed(() => {
  if (props.highlight || props.more || slots.more) return false;
  return true;
});

const iconName = computed(() => {
  if (props.icon) return props.icon;
  if (props.more || slots.more) return 'it-zoom-in';
  switch (props.type) {
    case 'success':
      return 'it-check-circle';
    case 'warning':
      return 'it-help-circle';
    case 'danger':
      return 'it-close-circle';
    case 'important':
    case 'note':
      return 'it-info-circle';
    default:
      return null;
  }
});

const moreIsOpen = ref<boolean>(false);

function toggleMore() {
  moreIsOpen.value = !moreIsOpen.value;
}
</script>

<template>
  <div :id="id" :class="classes">
    <div :class="{ 'callout-inner': innerRequired }">
      <div class="callout-title">
        <slot name="title">
          <Icon v-if="iconName" :name="iconName" />
          <span class="text">{{ title }}</span>
        </slot>
      </div>

      <p>
        <slot />
      </p>

      <div v-if="!!$slots.more" class="collapse-div">
        <div :id="`${uuid}heading`" class="collapse-header">
          <button
            type="button"
            class="callout-more-toggle"
            :aria-controls="`${uuid}collapse`"
            :aria-expanded="moreIsOpen"
            @click="toggleMore()"
          >
            {{ moreLabel }}
          </button>
        </div>

        <Collapse :id="`${uuid}collapse`" role="tabpanel" :area-labelledby="`${uuid}heading`" :is-expanded="moreIsOpen">
          <div class="collapse-body">
            <slot name="more" />
          </div>
        </Collapse>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.callout {
  &-more {
    .callout-title {
      :deep(.icon) {
        border-bottom: none;
      }
    }
  }
}
</style>
