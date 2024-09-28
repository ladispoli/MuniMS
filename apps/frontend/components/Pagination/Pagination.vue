<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core';

interface Props {
  pageCount: number;
  pageParam?: string;
  pagesPerView?: number;
  label?: string;
  justify?: 'start' | 'center' | 'end';
  more?: boolean;
  changer?: boolean | number; // show the changer dropdown to quick jump on every x pages. You can specify the pages interval as a number, default is 10
  simple?: boolean;
  showTotal?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pageParam: 'p',
  label: 'Pagine dei risultati di ricerca',
  justify: 'center',
  pagesPerView: 5, // how many pages are displayed in the list
});

const { width: windowWidth } = useWindowSize();
const mdGridBreakpoint = 768; // bootstrap-italia grid-breakpoint 'md'
const isDesktop = computed(() => windowWidth.value > mdGridBreakpoint);

const route = useRoute();

const currentPage = computed(() => {
  const queryPage = Number(route.query[props.pageParam] ?? 1);
  return Math.min(Math.max(queryPage, 1), props.pageCount); // clamp value between 1 and last page number
});

// shift the pages scale to display page numbers based on pagesPerView and currentPage params
const pageShift = computed(() => {
  if (props.pageCount < props.pagesPerView) {
    return 0; // don't need shifting at all
  }

  const mediumValue = Math.round(props.pagesPerView / 2);

  if (currentPage.value < mediumValue) {
    return 0; // don't shift for the first pages
  } else if (currentPage.value > props.pageCount - mediumValue) {
    return props.pageCount - props.pagesPerView; // shift for the last pages
  }
  return currentPage.value - mediumValue; // shift the scale following currentPage
});

const defaultChangerInterval = 10;

const changerMenu = computed(() => {
  if (!props.changer) {
    return [];
  }

  const pages = [];

  const changerInterval = Number(props.changer) > 1 ? Number(props.changer) : defaultChangerInterval;
  for (let i = changerInterval; i < props.pageCount; i += changerInterval) {
    pages.push({
      name: `${i}/pagina`,
      path: { query: { [props.pageParam]: i } },
    });
  }

  return pages;
});

const simpleChangerMenu = computed(() => {
  if (!props.simple && !isDesktop) {
    return [];
  }

  const pages = [];

  if (props.more) {
    pages.push({ name: '1/pagina', path: { query: { [props.pageParam]: 1 } }, title: '1' });
  }

  const changerInterval =
    Number(props.changer) > 1 ? Number(props.changer) : Math.min(10, Math.max(3, Math.round(props.pageCount / 3)));
  for (let i = changerInterval; i < props.pageCount; i += changerInterval) {
    pages.push({
      name: `${i}/pagina`,
      path: { query: { [props.pageParam]: i } },
      title: `${i}`,
    });
  }

  return pages;
});
</script>

<template>
  <nav
    :class="['pagination-wrapper', justify ? `justify-content-${justify}` : '', { 'pagination-total': showTotal }]"
    :aria-label="label"
  >
    <ul class="pagination" :aria-label="`Pagina ${currentPage} di ${pageCount}`">
      <li :class="['page-item', { disabled: currentPage <= 1 }]">
        <NuxtLink
          class="page-link text"
          :to="{ query: { ...$route.query, [pageParam]: currentPage - 1 } }"
          :tabindex="currentPage <= 1 ? -1 : undefined"
          :aria-current="undefined"
          data-element="pager-link"
        >
          <slot name="prev-page">
            <Icon name="it-chevron-left" color="primary" />
          </slot>
          <span class="visually-hidden">Pagina precedente</span>
        </NuxtLink>
      </li>

      <template v-if="simple || !isDesktop">
        <li class="page-item simple-changer">
          <span class="page-link" aria-current="page">
            <Dropdown v-if="simpleChangerMenu.length" :menu="simpleChangerMenu" no-toggle-icon>
              {{ currentPage }}
            </Dropdown>
            <template v-else>{{ currentPage }}</template>
          </span>
        </li>
        <li class="page-item">
          <span class="page-link">/</span>
        </li>
        <li class="page-item">
          <NuxtLink
            class="page-link"
            :to="{ query: { ...$route.query, [pageParam]: pageCount } }"
            :aria-current="undefined"
            data-element="pager-link"
          >
            {{ pageCount }}
          </NuxtLink>
        </li>
      </template>

      <template v-else>
        <template v-if="more && pageShift > 0">
          <li class="page-item">
            <NuxtLink
              class="page-link"
              :to="{ query: { ...$route.query, [pageParam]: 1 } }"
              :aria-current="undefined"
              data-element="pager-link"
            >
              1
            </NuxtLink>
          </li>
          <li class="page-item"><span class="page-link">...</span></li>
        </template>

        <li v-for="page in Math.min(pageCount, pagesPerView)" :key="`page-${page}`" class="page-item">
          <NuxtLink
            class="page-link"
            :to="{ query: { ...$route.query, [pageParam]: page + pageShift } }"
            :aria-current="page + pageShift === currentPage ? 'page' : undefined"
            data-element="pager-link"
          >
            {{ page + pageShift }}
          </NuxtLink>
        </li>

        <template v-if="more && pageShift < pageCount - pagesPerView">
          <li class="page-item"><span class="page-link">...</span></li>
          <li class="page-item">
            <NuxtLink
              class="page-link"
              :to="{ query: { ...$route.query, [pageParam]: pageCount } }"
              :aria-current="undefined"
              data-element="pager-link"
            >
              {{ pageCount }}
            </NuxtLink>
          </li>
        </template>
      </template>

      <li :class="['page-item', { disabled: currentPage >= pageCount }]">
        <NuxtLink
          class="page-link text"
          :to="{ query: { ...$route.query, [pageParam]: currentPage + 1 } }"
          :tabindex="currentPage >= pageCount ? -1 : undefined"
          :aria-current="undefined"
          data-element="pager-link"
        >
          <span class="visually-hidden">Pagina successiva</span>
          <slot name="next-page">
            <Icon name="it-chevron-right" color="primary" />
          </slot>
        </NuxtLink>
      </li>
    </ul>

    <Dropdown v-if="changerMenu.length && !simple" :menu="changerMenu">{{ currentPage }}/pagina</Dropdown>

    <p v-if="showTotal">Totale {{ pageCount }} elementi</p>
  </nav>
</template>

<style lang="scss" scoped>
.pagination-wrapper {
  .simple-changer {
    .page-link {
      pointer-events: all;
    }

    :deep(.dropdown) {
      margin: 0;

      .dropdown-toggle::after {
        margin: 0;
      }
    }
  }
}
</style>
