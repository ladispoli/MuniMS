<script lang="ts" setup>
import type { PageDataProvided } from '../Page.vue';
import type { Font } from '~/types/bootstrap-italia';

export interface PageContentDataProvided {
  font: Font;
}

interface Props {
  sections?: Array<string>; // override PageContentSection child components' title props
  indexTitle?: string;
  indexWidth?: 2 | 3 | 4 | 5 | 6;
  noIndex?: boolean;
  font?: Font;
  // override injected pageData
  updatedAt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  indexWidth: 3,
  font: 'serif',
});

const headerHeight = useState<number>('header-height');
const headerHeightPx = computed(() => headerHeight.value + 'px');

const pageData = inject<Ref<PageDataProvided>>('page-data');

const dateUpdated = computed(() => props?.updatedAt ?? pageData?.value?.updatedAt);

const slots = useSlots();
const slotSections = ref<Array<string>>([]);

onMounted(() => {
  if (!props.sections && slots.default) {
    for (const section of slots.default()) {
      const title = section.props?.title;
      if (title) {
        // the slot is a section only if it has the title prop
        slotSections.value.push(title);
      }
    }
  }
});

provide('page-content-data', ref<PageContentDataProvided>({ font: props.font }));
</script>

<template>
  <div class="container">
    <div v-if="noIndex" class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="row">
          <article class="it-page-sections-container col-lg-12 my-4" itemprop="content">
            <slot />

            <section v-if="dateUpdated" id="ultimo-aggiornamento" class="anchor-offset">
              <h4 class="h6">
                Ultimo aggiornamento:
                <time class="h6 fw-normal" :datetime="dateUpdated">
                  {{ formatDate(dateUpdated, 'P, p') }}
                </time>
              </h4>
            </section>
          </article>
        </div>
      </div>
    </div>
    <div v-else class="row border-top border-light row-column-border row-column-menu-left">
      <aside
        :class="['col-12 mb-4 border-col py-0', `col-lg-${indexWidth}`]"
        aria-labelledby="accordion-page-index-header"
      >
        <Navscroll
          :title="indexTitle"
          :sections="sections || slotSections"
          accordion-id="accordion-page-index-header"
          class="page-content-navscroll"
        />
      </aside>

      <div :class="[`col-lg-${12 - indexWidth}`, 'border-light']">
        <article class="it-page-sections-container ps-lg-4" itemprop="content">
          <slot />

          <section v-if="dateUpdated" id="ultimo-aggiornamento" class="anchor-offset">
            <h4 class="h6">
              Ultimo aggiornamento:
              <time class="h6 fw-normal" :datetime="dateUpdated">
                {{ formatDate(dateUpdated, 'P, p') }}
              </time>
            </h4>
          </section>
        </article>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-content-navscroll {
  position: sticky;
  top: v-bind('headerHeightPx');
}
</style>
