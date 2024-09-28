<script lang="ts" setup>
import { NavScroll } from 'bootstrap-italia';

interface Props {
  title?: string;
  sections?: Array<string>;
  accordionId?: string;
  // bootstrap italia NavScroll configs
  scrollPadding?: number;
  duration?: number;
  easing?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'INDICE DELLA PAGINA',
  scrollPadding: 10,
  duration: 800,
  easing: 'easeInOutSine',
});

const navScroll = ref<HTMLElement | null>(null);
let bsNavScroll: NavScroll;

onMounted(async () => {
  await nextTick();
  if (navScroll.value instanceof HTMLElement) {
    const { scrollPadding, duration, easing } = props;
    bsNavScroll = new NavScroll(navScroll.value, { scrollPadding, duration, easing });
  }
});

onUnmounted(() => bsNavScroll?.dispose());
</script>

<template>
  <nav ref="navScroll" class="navbar it-navscroll-wrapper navbar-expand-lg" :aria-label="title">
    <div id="navbarNavProgress" class="navbar-custom">
      <div class="menu-wrapper">
        <div class="link-list-wrapper">
          <Accordion>
            <AccordionItem :id="accordionId" title-tag="span" is-expanded>
              <template #title>
                <slot>{{ title }}</slot>
              </template>
              <template #after-title>
                <div class="progress">
                  <div
                    class="progress-bar it-navscroll-progressbar"
                    role="progressbar"
                    aria-valuenow="0"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </template>
              <ul v-if="sections?.length" class="link-list" data-element="page-index">
                <li v-for="(heading, i) in sections" :key="heading + i" class="nav-item">
                  <NuxtLink class="nav-link" :to="'#' + slugify(heading)">
                    <span class="title-medium">{{ heading }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.it-navscroll-wrapper {
  display: block;
  flex-wrap: unset;
  align-items: unset;
  justify-content: unset;

  .menu-wrapper {
    padding-top: unset;
    padding-bottom: unset;
  }

  :deep(.accordion) {
    border-bottom: unset;

    .accordion {
      &-collapse {
        padding: 0;
      }

      &-header .accordion-button {
        font-size: 0.778rem;
        font-weight: 600;
        line-height: 1.6;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: unset;

        &:after {
          width: 1rem;
        }
      }

      &-body {
        padding: 0;
      }
    }
  }

  .progress {
    background-color: $neutral-1-a1;
  }

  .link-list-wrapper {
    ul {
      padding: 0.5rem 0;

      @include media-breakpoint-up(sm) {
        padding: 14px 0;
      }

      li {
        & + li {
          margin-top: 0.75rem;

          @include media-breakpoint-up(sm) {
            margin-top: 0.67rem;
          }
        }

        &:first-child {
          margin-top: 0.375rem;

          @include media-breakpoint-up(sm) {
            margin-top: 0.33rem;
          }
        }

        &:not(:last-child) {
          margin-bottom: 0.75rem;

          @include media-breakpoint-up(sm) {
            margin-bottom: 0.67rem;
          }
        }

        a {
          padding: 0 24px;
          line-height: 1.5;
          color: #000;

          &.active {
            padding: 0 24px 0 22px;
            border-left: 2px solid $primary;
          }
        }
      }
    }
  }
}
</style>
