<script lang="ts" setup>
import { ProgressDonut } from 'bootstrap-italia';
import type { Color } from '~/types/bootstrap-italia';

interface Props {
  value?: number;
  minValue?: number;
  maxValue?: number;
  label?: string;
  indeterminate?: boolean;
  color?: Color;
  // Spinner
  spinner?: boolean;
  active?: boolean;
  small?: boolean;
  double?: boolean;
  // Donut
  donut?:
    | boolean
    | {
        color?: string;
        trailColor?: string;
        strokeWidth?: number;
        trailWidth?: number;
        easing?: string;
        animate?: boolean;
      };
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  minValue: 0,
  maxValue: 100,
  active: true,
});

const progressValue = computed(() => Math.min(Math.max(props.value, props.minValue), props.maxValue)); // clamp the value between min and max
const progressValueScaled = computed(() => progressValue.value / props.maxValue);

const progressDonut = ref<HTMLElement | null>(null);
let bsProgressDonut: ProgressDonut;

onMounted(async () => {
  await nextTick();
  if (progressDonut.value instanceof HTMLElement) {
    bsProgressDonut = new ProgressDonut(progressDonut.value, {
      value: progressValueScaled.value,
      ...(props.donut instanceof Object ? props.donut : {}),
    });
  }
});

watch(
  () => props.value,
  () => {
    if (props.donut) {
      bsProgressDonut?.set(progressValueScaled.value);
    }
  },
);

onUnmounted(() => bsProgressDonut?.dispose());
</script>

<template>
  <div
    v-if="spinner"
    :class="[
      'progress-spinner',
      { 'progress-spinner-active': active, 'size-sm': small, 'progress-spinner-double': double },
    ]"
  >
    <template v-if="double">
      <div class="progress-spinner-inner" />
      <div class="progress-spinner-inner" />
    </template>
    <span class="visually-hidden">{{ label ?? 'Caricamento...' }}</span>
  </div>
  <div v-else-if="donut" ref="progressDonut" class="progress-donut-wrapper">
    <div class="progress-donut" />
    <span class="visually-hidden" />
  </div>
  <div v-else class="progress-bar-wrapper">
    <div v-if="label" class="progress-bar-label">
      <span class="visually-hidden">{{ label }} </span>
      <template v-if="progressValue">{{ progressValue }}%</template>
    </div>

    <div :class="['progress', { 'progress-indeterminate': indeterminate }]">
      <div
        :class="['progress-bar', color ? `bg-${color}` : '']"
        role="progressbar"
        :style="progressValue ? `width: ${progressValue}%` : undefined"
        :aria-valuenow="progressValue"
        :aria-valuemin="progressValue ? minValue : undefined"
        :aria-valuemax="progressValue ? maxValue : undefined"
      />
    </div>
  </div>
</template>
