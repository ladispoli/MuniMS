<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import type { Size } from '~/types/bootstrap-italia';

interface Props {
  id?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'textarea';
  modelValue?: string | number;
  name?: string;
  label?: string;
  title?: string;
  placeholder?: string;
  info?: string;
  disabled?: boolean;
  readonly?: boolean;
  size?: Size;
  maxlength?: number;
  min?: number;
  max?: number;
  step?: number;
  // type textarea
  rows?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  rows: 3,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void;
}>();

const uuid = props?.id ?? uuidv4();

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const classes = computed(() => {
  const classes: Array<any> = ['form-control'];

  if (props.size) {
    classes.push(`form-control-${props.size}`);
  }

  return classes;
});

const active = computed(() => !!props.placeholder || !!props.modelValue);
</script>

<template>
  <div class="form-group">
    <label v-if="!!$slots.default || label" :for="`input-${uuid}`" :class="{ active }">
      <slot>{{ label }}</slot>
    </label>
    <textarea
      v-if="type === 'textarea'"
      :id="`input-${uuid}`"
      v-model="localValue"
      v-bind="$attrs"
      :class="classes"
      :title="title"
      :rows="rows"
      :maxlength="maxlength"
    />
    <input
      v-else
      :id="`input-${uuid}`"
      v-model="localValue"
      v-bind="$attrs"
      :type="type"
      :class="classes"
      :name="name"
      :title="title"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-describedby="!!$slots.info || info ? `input-description-${uuid}` : undefined"
      :maxlength="maxlength"
      :min="min"
      :max="max"
      :step="max"
    />
    <small v-if="!!$slots.info || info" :id="`input-description-${uuid}`" class="form-text">
      <slot name="info">{{ info }}</slot>
    </small>
  </div>
</template>
