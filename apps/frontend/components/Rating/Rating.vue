<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';

interface Props {
  id?: string;
  modelValue?: number;
  max?: number;
  label?: string;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  max: 5,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void;
}>();

const uuid = props?.id ?? uuidv4();

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const stars = computed(() => Array.from({ length: props.max }, (_, i) => props.max - i));
</script>

<template>
  <fieldset
    :id="`fieldset-${uuid}`"
    :class="['rating', { 'rating-label': !!$slots.label || label, 'rating-read-only': readonly }]"
  >
    <legend v-if="!!$slots.label || label">
      <slot name="label">{{ label }}</slot>
    </legend>

    <template v-for="n in stars" :key="`star-${n}`">
      <input
        :id="`${uuid}-star${n}`"
        v-model="localValue"
        type="radio"
        :name="`${uuid}-rating`"
        :value="n"
        :checked="n === localValue"
        :aria-hidden="readonly"
        :disabled="readonly"
        :data-element="`feedback-rate-${n}`"
        v-bind="$attrs"
      />
      <label class="full" :for="`${uuid}-star${n}`">
        <Icon name="it-star-full" size="sm" />
        <span class="visually-hidden">Valuta {{ n }} stelle su 5</span>
      </label>
    </template>
  </fieldset>
</template>

<style lang="scss" scoped></style>
