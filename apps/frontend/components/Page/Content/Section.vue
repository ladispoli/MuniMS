<script lang="ts" setup>
import type { PageContentDataProvided } from './Content.client.vue';
import type { Font } from '~/types/bootstrap-italia';

interface Props {
  title?: string;
  id?: string;
  attrs?: Record<string, string>;
  hideTitle?: boolean;
  // override injected pageContentData
  font?: Font;
}

const props = defineProps<Props>();

const sectionId = computed(() => props.id ?? slugify(props.title ?? ''));

const pageContentData = inject<Ref<PageContentDataProvided>>('page-content-data');
</script>

<template>
  <section
    :id="sectionId"
    class="it-page-section anchor-offset mb-5"
    data-audio
    :aria-describedby="`${sectionId}-title`"
  >
    <h2 v-if="title && !hideTitle" :id="`${sectionId}-title`" class="mb-3">{{ title }}</h2>

    <div :class="['it-page-section-content', `font-${font ?? pageContentData?.font}`]" v-bind="attrs">
      <slot />
    </div>
  </section>
</template>
