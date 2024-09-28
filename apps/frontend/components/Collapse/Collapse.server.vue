<script lang="ts" setup>
const props = defineProps<{
  isExpanded?: boolean;
}>();

const collapse = ref<HTMLElement | null>(null);

defineExpose({ collapse });
</script>

<template>
  <div ref="collapse" class="collapse">
    <slot />
  </div>
</template>
