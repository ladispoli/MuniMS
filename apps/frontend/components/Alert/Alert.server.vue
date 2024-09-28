<script lang="ts" setup>
import type { TitleTag } from '~/types/bootstrap-italia';

interface Props {
  color?: 'info' | 'success' | 'danger' | 'warning';
  dismissible?: boolean;
  closeLabel?: string;
  closeBtnClass?: string;
  btnDisabled?: boolean;
  title?: string;
  titleTag?: TitleTag;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'info',
  titleTag: 'h4',
  closeLabel: 'Chiudi avviso',
  closeBtnClass: 'btn-close',
});

const classes = computed(() => {
  const classes: Array<any> = ['alert'];

  return [
    ...classes,
    `alert-${props.color}`,
    { 'alert-dismissible': props.dismissible },
    { 'fade show': props.dismissible },
  ];
});

const alert = ref<HTMLElement | null>(null);
</script>

<template>
  <div ref="alert" :class="classes" role="alert">
    <component :is="titleTag" v-if="title" class="alert-heading">
      {{ title }}
    </component>
    <slot />
    <button v-if="dismissible" type="button" :class="closeBtnClass" :aria-label="closeLabel" :disabled="btnDisabled">
      <Icon name="it-close" />
      <span class="visually-hidden">{{ closeLabel }}</span>
    </button>
  </div>
</template>
