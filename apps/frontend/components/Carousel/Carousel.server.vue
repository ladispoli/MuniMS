<script lang="ts" setup>
import type { TitleTag } from '~/types/bootstrap-italia';

interface Props {
  threeCols?: boolean;
  showArrows?: boolean;
  full?: boolean;
  img?: 'standard' | 'big';
  trackClass?: string;
  listClass?: string;
  title?: string;
  titleTag?: TitleTag;
  titleClass?: TitleTag;
}

const props = withDefaults(defineProps<Props>(), {
  titleTag: 'h2',
});

const classes = computed(() => {
  const classes: Array<any> = ['splide', 'it-carousel-wrapper'];

  let landscapeClass = ' it-carousel-landscape-abstract';
  if (props.threeCols && props.showArrows) {
    landscapeClass += '-three-cols-arrow-visible';
  } else if (props.threeCols) {
    landscapeClass += '-three-cols';
  }

  if (props.img) {
    classes.push(props.img === 'big' ? 'it-big-img' : 'it-standard-image');
  }

  return [...classes, landscapeClass, { 'it-full-carousel': props.full }];
});

const carousel = ref<HTMLElement | null>(null);
</script>

<template>
  <div ref="carousel" :class="classes">
    <div v-if="title" class="it-header-block">
      <div class="it-header-block-title">
        <component :is="titleTag" :class="titleClass">
          {{ title }}
        </component>
      </div>
    </div>
    <div :class="['splide__track', trackClass]">
      <ul :class="['splide__list', listClass]">
        <!-- list of CarouselSlide components -->
        <slot />
      </ul>
    </div>
  </div>
</template>
