<script lang="ts" setup>
import type { Size } from '~/types/bootstrap-italia';

interface Props {
  title: string;
  size?: Size;
  color?: 'primary' | 'secondary' | 'green' | 'orange' | 'red';
  to?: string;
  href?: string; // alias of 'to'
  presence?: 'active' | 'busy' | 'hidden';
  presenceIcon?: string;
  status?: 'approved' | 'declined' | 'notify';
  statusIcon?: string;
  avatarAttrs?: Record<string, string>;
}

const props = defineProps<Props>();

const link = computed(() => props.to ?? props.href);

const classes = computed(() => {
  const classes: Array<any> = ['avatar'];

  if (props.size) classes.push(`size-${props.size}`);
  if (props.color) classes.push(`avatar-${props.color}`);

  return classes;
});

const presenceLabel = computed(() => {
  switch (props.presence) {
    case 'active':
      return 'attivo';
    case 'busy':
      return 'non disponibile';
    case 'hidden':
      return 'invisibile';
    default:
      return 'non attivo';
  }
});

const statusLabel = computed(() => {
  switch (props.status) {
    case 'approved':
      return 'approvato';
    case 'declined':
      return 'respinto';
    case 'notify':
      return 'nuova notifica';
    default:
      return 'nessuno';
  }
});

const slots = useSlots();

// extract 2 initials letters from 'title' (the full name)
const initials = computed(() => {
  if (!slots.default) {
    const titleParts = props.title.split(' ');
    const firstLetter = titleParts.shift()?.charAt(0) ?? '';
    const lastLetter = titleParts.pop()?.charAt(0) ?? '';
    return (firstLetter + lastLetter).toUpperCase();
  }

  return '';
});

const { $warn } = useNuxtApp();

onMounted(() => {
  if (slots.default && slots.default()?.length > 1) {
    $warn(
      'multiple nodes found in default slot, there should be only a single element that renders an image',
      'Avatar.vue',
    );
  }
});

const NuxtLink = resolveComponent('NuxtLink');
</script>

<template>
  <div :class="['avatar-wrapper', { 'avatar-extra-text': !!$slots.text }]">
    <component :is="link ? NuxtLink : 'span'" :class="classes" :title="title" :to="link" v-bind="avatarAttrs">
      <slot />
      <p v-if="initials" aria-hidden="true">{{ initials }}</p>
      <span v-if="title" class="visually-hidden">{{ title }}</span>

      <div v-if="presence" :class="['avatar-presence', presence]">
        <Icon v-if="presenceIcon" :name="presenceIcon" color="white" />
        <span class="visually-hidden">Presenza: {{ presenceLabel }}</span>
      </div>

      <div v-if="status" :class="['avatar-status', status]">
        <Icon v-if="statusIcon" :name="statusIcon" color="white" />
        <span class="visually-hidden">Stato: {{ statusLabel }}</span>
      </div>
    </component>

    <div v-if="!!$slots.text" class="extra-text">
      <slot name="text" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  &-wrapper {
    max-width: max-content;
  }
}
</style>
