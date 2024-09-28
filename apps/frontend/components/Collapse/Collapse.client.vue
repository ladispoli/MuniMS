<script lang="ts" setup>
import { Collapse } from 'bootstrap-italia';

const props = defineProps<{
  isExpanded?: boolean;
}>();

const collapse = ref<HTMLElement | null>(null);
let bsCollapse: Collapse;

onMounted(async () => {
  await nextTick();
  if (collapse.value instanceof HTMLElement) {
    bsCollapse = new Collapse(collapse.value, {
      toggle: props.isExpanded,
    });
  }
});

onUnmounted(() => bsCollapse?.dispose());

watch(
  () => props.isExpanded,
  () => bsCollapse?.toggle(),
);

defineExpose({ collapse });
</script>

<template>
  <div ref="collapse" class="collapse">
    <slot />
  </div>
</template>
