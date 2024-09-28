<script lang="ts" setup>
import { Forward } from 'bootstrap-italia';
import type { Color } from '~/types/bootstrap-italia';

interface Props {
  toId: string;
  label?: string;
  color?: Color;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
});

const forward = ref<HTMLElement | null>(null);
let bsForward: Forward;

onMounted(async () => {
  await nextTick();
  if (forward.value instanceof HTMLElement) {
    bsForward = new Forward(forward.value);
  }
});
</script>

<template>
  <NuxtLink class="forward" :aria-label="`Vai a: ${label || unslugify(toId)}`" :to="'#' + toId">
    <Icon name="it-expand" :color="color" />
  </NuxtLink>
</template>

<style lang="scss" scoped></style>
