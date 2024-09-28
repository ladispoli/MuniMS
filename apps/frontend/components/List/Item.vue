<script lang="ts" setup>
import type { Media } from '~/types/strapi';

interface Props {
  class?: string;
  text?: string;
  to?: string;
  href?: string; // alias of 'to'
  title?: string;
  ariaLabel?: string;
  icon?: string;
  img?: Media;
  arrow?: boolean;
  actions?: Array<{
    icon: string;
    path?: string;
    action?: () => void;
    title?: string;
    ariaLabel?: string;
    attrs?: Record<string, string>;
  }>;
  metadata?: string;
  attrs?: Record<string, string>;
}

const props = defineProps<Props>();

const classes = computed(() => ['list-item', props.class ?? '']);

const link = computed(() => props.to ?? props.href);

const NuxtLink = resolveComponent('NuxtLink');
</script>

<template>
  <li>
    <component
      :is="link ? NuxtLink : 'div'"
      :class="classes"
      :to="link"
      :title="title"
      :aria-label="ariaLabel"
      :rel="isExternalLink(link) ? 'noopener noreferrer' : null"
      :target="isExternalLink(link) ? '_blank' : null"
      v-bind="attrs"
    >
      <div v-if="icon" class="it-rounded-icon">
        <Icon :name="icon" />
      </div>

      <div v-if="img" class="it-thumb">
        <StrapiMedia :data="img" :simple-img="[500]" format="thumbnail" />
      </div>

      <slot name="before" />

      <div class="it-right-zone">
        <span v-if="text || !!$slots.default" class="text">
          <slot>{{ text }}</slot>
        </span>

        <span v-if="(metadata || !!$slots.metadata) && !actions" class="metadata">
          <slot name="metadata">{{ metadata }}</slot>
        </span>

        <div v-if="actions" class="it-multiple">
          <span v-if="metadata || !!$slots.metadata" class="metadata">
            <slot name="metadata">{{ metadata }}</slot>
          </span>

          <NuxtLink
            v-for="(action, index) in actions"
            :key="action.path ?? action.icon + index"
            :to="action.path"
            :title="action.title"
            :aria-label="action.ariaLabel"
            v-bind="action?.attrs"
            @click="action.action"
          >
            <Icon :name="action.icon" size="sm" color="primary" />
          </NuxtLink>
        </div>
      </div>

      <slot name="after" />

      <Icon v-if="arrow" name="it-chevron-right" />
    </component>
  </li>
</template>
