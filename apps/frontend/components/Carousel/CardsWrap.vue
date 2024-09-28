<script lang="ts" setup generic="T extends ContentType">
import type { ContentType } from '~/types/strapi';

interface Props {
  items: Array<T>;
  wrapIf?: Ref<boolean> | boolean;
  itemsPerColumn?: number;
  showArrows?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerColumn: 3,
});

const itemsChunks = computed(() => {
  const chunks = [];
  for (let i = 0; i < props.items.length; i += props.itemsPerColumn) {
    const chunk = props.items.slice(i, i + props.itemsPerColumn);
    chunks.push(chunk);
  }
  return chunks;
});
</script>

<template>
  <Carousel v-if="!wrapIf" three-cols full track-class="px-1" :show-arrows="showArrows">
    <CarouselSlide v-for="(item, index) in items" :key="item?.id ?? index" wrapper-class="h-100">
      <CardWrapper class="h-100">
        <slot name="item" v-bind="item" />
      </CardWrapper>
    </CarouselSlide>
  </Carousel>
  <Carousel v-else :show-arrows="showArrows">
    <CarouselSlide
      v-for="(itemsChunk, chunkIndex) in itemsChunks"
      :key="'chunk' + (itemsChunk[0].id ?? chunkIndex)"
      wrapper-class="bg-transparent"
    >
      <CardWrapper v-for="(item, index) in itemsChunk" :key="item.id ?? index" class="flex-column mx-1">
        <slot name="item" v-bind="item" />
      </CardWrapper>
    </CarouselSlide>
  </Carousel>
</template>
