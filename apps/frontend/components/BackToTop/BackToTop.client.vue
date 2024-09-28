<script lang="ts" setup>
import { BackToTop } from 'bootstrap-italia';

interface Props {
  small?: boolean;
  shadow?: boolean;
  dark?: boolean;
}

const classes = computed(() => {
  const classes: Array<any> = ['back-to-top'];

  return [...classes, { 'back-to-top-small': props.small, shadow: props.shadow, dark: props.dark }];
});

const props = defineProps<Props>();

const backToTop = ref<HTMLElement | null>(null);
let bsBackToTop: BackToTop;

onMounted(async () => {
  await nextTick();
  if (backToTop.value instanceof HTMLElement) {
    bsBackToTop = new BackToTop(backToTop.value);
  }
});

onUnmounted(() => bsBackToTop?.dispose());
</script>

<template>
  <a ref="backToTop" href="#" aria-hidden="true" tabindex="-1" :class="classes">
    <Icon name="it-arrow-up" color="light" />
  </a>
</template>
