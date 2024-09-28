<script lang="ts" setup>
import { Alert } from 'bootstrap-italia';
import type { TitleTag } from '~/types/bootstrap-italia';

interface Props {
  color?: 'info' | 'success' | 'danger' | 'warning';
  dismissible?: boolean;
  closeLabel?: string;
  btnDisabled?: boolean;
  title?: string;
  titleTag?: TitleTag;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'info',
  titleTag: 'h4',
  closeLabel: 'Chiudi avviso',
});

const classes = computed(() => {
  const classes: Array<any> = ['alert'];

  return [
    ...classes,
    `alert-${props.color}`,
    {
      'alert-dismissible': props.dismissible,
      'fade show': props.dismissible,
    },
  ];
});

const alert = ref<HTMLElement | null>(null);
let bsAlert: Alert;

onMounted(async () => {
  await nextTick();
  if (alert.value instanceof HTMLElement) {
    bsAlert = new Alert(alert.value);
  }
});

const close = () => bsAlert?.close();

onUnmounted(() => bsAlert?.dispose());
</script>

<template>
  <div ref="alert" :class="classes" role="alert">
    <component :is="titleTag" v-if="title" class="alert-heading">
      {{ title }}
    </component>

    <slot />

    <button
      v-if="dismissible"
      type="button"
      class="btn-close"
      :aria-label="closeLabel"
      :disabled="btnDisabled"
      @click="close()"
    >
      <Icon name="it-close" />
      <span class="visually-hidden">{{ closeLabel }}</span>
    </button>
  </div>
</template>
