<script lang="ts" setup>
import { CarouselBI } from 'bootstrap-italia';
import { v4 as uuidv4 } from 'uuid';
import type { TitleTag } from '~/types/bootstrap-italia';

interface Props {
  id?: string;
  threeCols?: boolean;
  showArrows?: boolean;
  full?: boolean; // full page
  img?: 'standard' | 'big';
  arrowsClass?: string;
  trackClass?: string;
  listClass?: string;
  title?: string;
  titleTag?: TitleTag;
  titleClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  titleTag: 'h2',
});

const uuid = props?.id ?? uuidv4();

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

  if (props.showArrows) {
    classes.push('it-carousel-landscape-abstract-three-cols-arrow-visible');
  }

  return [...classes, landscapeClass, { 'it-full-carousel': props.full }];
});

const carousel = ref<HTMLElement | null>(null);
let bsCarousel: CarouselBI;

onMounted(async () => {
  await nextTick();
  if (carousel.value instanceof HTMLElement) {
    bsCarousel = new CarouselBI(carousel.value);
  }
});

onUnmounted(() => bsCarousel?.dispose());
</script>

<template>
  <div :id="`splide${uuid}`" ref="carousel" :class="classes">
    <div v-if="title" class="it-header-block">
      <div class="it-header-block-title">
        <component :is="titleTag" :class="titleClass">
          {{ title }}
        </component>
      </div>
    </div>
    <div v-if="showArrows" :class="['splide__arrows', arrowsClass]" style="display: flex">
      <Button
        class="splide__arrow splide__arrow--prev"
        :aria-controls="`splide${uuid}-track`"
        aria-label="Slide precedente"
        :data-focus-mouse="false"
      >
        <Icon name="it-chevron-left" />
      </Button>
      <Button
        class="splide__arrow splide__arrow--next"
        :aria-controls="`splide${uuid}-track`"
        aria-label="Slide successiva"
        :data-focus-mouse="false"
      >
        <Icon name="it-chevron-right" />
      </Button>
    </div>
    <div :id="`splide${uuid}-track`" :class="['splide__track', trackClass]">
      <ul :class="['splide__list it-carousel-all', listClass]">
        <!-- list of CarouselSlide components -->
        <slot />
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.it-carousel-wrapper {
  .splide__arrows {
    .splide__arrow {
      &.splide__arrow--prev {
        transform: none;
      }
      &.splide__arrow--next {
        transform: none;
      }
    }
  }
}
</style>
