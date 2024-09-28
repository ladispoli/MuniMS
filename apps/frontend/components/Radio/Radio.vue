<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';

interface Props {
  id?: string;
  modelValue?: string | number;
  value?: string | number;
  name?: string;
  label?: string;
  inline?: boolean;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  grouped?: boolean;
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void;
}>();

const uuid = props?.id ?? uuidv4();

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<template>
  <div
    :class="[
      'form-check',
      {
        'form-check-inline': inline,
        'form-check-group': grouped,
        disabled,
      },
    ]"
  >
    <input
      :id="`radio-${uuid}`"
      v-model="localValue"
      type="radio"
      :name="name ?? `group-${uuid}`"
      :value="value"
      v-bind="$attrs"
      :checked="checked"
      :disabled="disabled"
      :required="required"
    />
    <label :for="`radio-${uuid}`" :class="{ disabled }">
      <slot>{{ label }}</slot>
    </label>
    <small v-if="!!$slots.text || text" :id="`radio-${uuid}-help`" class="form-text">
      <slot name="text">{{ text }}</slot>
    </small>
  </div>
</template>

<style lang="scss" scoped></style>
