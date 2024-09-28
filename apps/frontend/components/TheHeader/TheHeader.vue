<script lang="ts" setup>
import { useWindowScroll, useWindowSize } from '@vueuse/core';

export interface TheHeaderProvided {
  calcHeaderHeight(): void;
}

const { y: scrollPosition } = useWindowScroll();
const { width: windowWidth } = useWindowSize();

const header = ref<HTMLElement | null>(null);
const headerNav = ref<HTMLElement | null>(null);
const headerCenter = ref<HTMLElement | null>(null);

const headerHeight = useState<number>('header-height', () => 0);
const headerOffsetHeight = ref<number>(0);
const headerStickyTopValue = computed(() => -headerOffsetHeight.value + 'px');

const lgGridBreakpoint = 992; // bootstrap-italia grid-breakpoint 'lg'
const isDesktop = computed(() => windowWidth.value > lgGridBreakpoint);
const isSticky = computed(() => scrollPosition.value > headerOffsetHeight.value);

function calcHeaderHeight() {
  if (header.value) {
    if (isDesktop.value) {
      if (headerNav.value && 'navWrapper' in headerNav.value && headerNav.value.navWrapper instanceof HTMLElement) {
        headerHeight.value = headerNav.value.navWrapper.clientHeight;
      }
    } else if (
      headerCenter.value &&
      'centerWrapper' in headerCenter.value &&
      headerCenter.value.centerWrapper instanceof HTMLElement
    ) {
      headerHeight.value = headerCenter.value.centerWrapper.clientHeight;
    }

    headerOffsetHeight.value = header.value.clientHeight - headerHeight.value;
  }
}

onMounted(async () => {
  await nextTick();
  calcHeaderHeight();
});

watch(isDesktop, () => setTimeout(() => calcHeaderHeight(), 100));
</script>

<template>
  <header ref="header" :class="['it-header-wrapper', { 'header-sticky': isSticky }]">
    <TheHeaderSlim v-once />
    <div class="it-nav-wrapper">
      <TheHeaderCenter v-once ref="headerCenter" />
      <TheHeaderNav ref="headerNav" :is-desktop="isDesktop" :is-sticky="isSticky" />
    </div>
  </header>
</template>

<style lang="scss" scoped>
.it-header-wrapper {
  @include media-breakpoint-up(lg) {
    font-size: 18px;
  }

  &.header-sticky {
    position: sticky;
    top: v-bind(headerStickyTopValue);
  }
}
</style>
