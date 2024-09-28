<script lang="ts" setup>
interface Props {
  wrapperClass?: string;
  lined?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <li :class="['splide__slide', { lined_slide: lined }]">
    <div :class="['it-single-slide-wrapper', wrapperClass]">
      <slot />
    </div>
  </li>
</template>
