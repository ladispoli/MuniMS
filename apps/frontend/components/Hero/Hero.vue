<script lang="ts" setup>
import type { TitleTag } from '~/types/bootstrap-italia';

interface Props {
  small?: boolean;
  centered?: boolean;
  overlay?: 'primary' | 'dark';
  filter?: boolean;
  overlappingContent?: boolean;
  category?: string;
  title?: string;
  titleTag?: TitleTag;
  titleClass?: string;
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  titleTag: 'h2',
});

const classes = computed(() => {
  const classes: Array<any> = ['it-hero-wrapper'];

  if (props.overlay) classes.push(`it-overlay it-${props.overlay}`);

  return [
    ...classes,
    { 'it-hero-small-size': props.small },
    { 'it-text-centered': props.centered },
    { 'it-filter': props.filter },
    { 'it-filter': props.filter },
    { 'it-bottom-overlapping-content': props.overlappingContent },
  ];
});
</script>

<template>
  <section :class="classes" aria-label="In evidenza">
    <div v-if="!!$slots.img" class="img-responsive-wrapper">
      <div class="img-responsive">
        <div class="img-wrapper">
          <slot name="img" />
        </div>
      </div>
    </div>

    <div v-if="category || title || $slots.title || text || $slots.text || $slots.cta" class="container">
      <div class="row">
        <div class="col-12">
          <div :class="['it-hero-text-wrapper', { 'bg-dark': overlay }]">
            <span v-if="category" class="it-category">{{ category }}</span>
            <component :is="titleTag" v-if="title || !!$slots.title" :class="titleClass">
              <slot name="title">{{ title }}</slot>
            </component>

            <slot>
              <p class="d-none d-lg-block">{{ text }}</p>
            </slot>

            <div v-if="!!$slots.cta" class="it-btn-container">
              <slot name="cta"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>

    <slot name="after" />
  </section>
</template>
