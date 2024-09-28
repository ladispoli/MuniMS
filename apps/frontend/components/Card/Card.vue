<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';
import type { CardWrapperProvided } from './Wrapper.vue';
import type { Props as iconProps } from '~/components/Icon/Icon.vue';
import type { TitleTag } from '~/types/bootstrap-italia';
import type { TaxArgomento } from '~/types/strapi';

interface Props {
  bodyClass?: string;
  noBg?: boolean;
  big?: boolean;
  borderLeft?: boolean;
  borderBottom?: boolean;
  flexWrap?: boolean;
  rounded?: boolean;
  imgPanoramic?: boolean;
  date?: Date | string; // it correspond to the starting date
  dateEnd?: Date | string; // ending date, in case of an event or something active on multiple days
  dateNearCategory?: boolean;
  special?: boolean;
  title?: string;
  titleTag?: TitleTag;
  titleClass?: string;
  readMoreLink?: RouteLocationRaw;
  readMoreLabel?: string;
  flag?: boolean;
  label?: string;
  labelIcon?: string;
  tags?: Array<TaxArgomento>;
  category?: string;
  categoryIcon?: string;
  categoryIconColor?: iconProps['color'];
  to?: string;
  href?: string; // alias of 'to'
  attrs?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  titleTag: 'h3',
  readMoreLabel: 'Vai alla pagina',
  rounded: true,
});

const { teaser, teaserLarge } = inject<CardWrapperProvided>('card-wrapper', {
  teaser: false,
  teaserLarge: false,
});

const slots = useSlots();

const showBody = computed(
  () =>
    slots.default ||
    props.tags ||
    props.category ||
    slots.category ||
    props.title ||
    slots.title ||
    slots.text ||
    slots.footer ||
    props.readMoreLink,
);

const tagsRoutePath = '/argomenti/';

const datePosition = computed(() => {
  if (!props.date) return false;

  if (!props.dateNearCategory && slots.img) {
    return 'img';
  }
  if (props.dateNearCategory || (!slots.img && (props.category || slots.category))) {
    return 'category';
  }

  return 'body';
});

const link = computed(() => props.to ?? props.href);

const NuxtLink = resolveComponent('NuxtLink');
</script>

<template>
  <component
    :is="link ? NuxtLink : 'div'"
    :to="link"
    :class="[
      'card',
      {
        'card-bg': !noBg,
        'card-big': big,
        'border-bottom-card': borderBottom,
        'border-left-card': borderLeft,
        'card-img': !!$slots.img,
        'special-card': special,
        'card-teaser': teaser || teaserLarge,
        'card-teaser-large': teaserLarge,
        'card-label': label,
        'flex-nowrap': !flexWrap,
        rounded,
      },
    ]"
    :rel="isExternalLink(link) ? 'noopener noreferrer' : null"
    :target="isExternalLink(link) ? '_blank' : null"
  >
    <slot name="heading" />

    <div v-if="flag" class="flag-icon" />

    <div v-if="label" class="etichetta">
      <LazyIcon v-if="labelIcon" :name="labelIcon" />
      <span>{{ label }}</span>
    </div>

    <div v-if="!!$slots.img" class="img-responsive-wrapper">
      <div :class="['img-responsive', { 'img-responsive-panoramic': imgPanoramic }]">
        <figure class="img-wrapper">
          <slot name="img" />
        </figure>

        <template v-if="date && datePosition === 'img'">
          <span v-if="dateEnd" class="card-calendar card-calendar-double d-flex flex-column justify-content-center">
            <time class="card-day" :datetime="date instanceof Date ? formatDate(date, 'ISO') : date">
              <small>dal</small> {{ formatDate(date, 'dd MMM') }}
            </time>
            <time class="card-day" :datetime="dateEnd instanceof Date ? formatDate(dateEnd, 'ISO') : dateEnd">
              <small>al</small> {{ formatDate(dateEnd, 'dd MMM') }}
            </time>
          </span>
          <time
            v-else
            class="card-calendar d-flex flex-column justify-content-center"
            :datetime="date instanceof Date ? formatDate(date, 'ISO') : date"
          >
            <span class="card-date">{{ formatDate(date, 'dd') }}</span>
            <span class="card-day">{{ formatDate(date, 'MMMM') }}</span>
          </time>
        </template>
      </div>
    </div>

    <slot name="pre-body" />

    <div v-if="showBody" :class="['card-body', 'd-flex', 'flex-column', 'flex-nowrap', bodyClass]">
      <div v-if="tags?.length || (date && datePosition === 'body')" class="head-tags">
        <NuxtLink
          v-for="(tag, i) in tags"
          :key="tag.nome + i"
          class="card-tag"
          :to="tagsRoutePath + tag.slug"
          :data-attribute="tag?.vocabolario"
        >
          {{ tag.nome }}
        </NuxtLink>

        <template v-if="date && datePosition === 'body'">
          <span v-if="dateEnd" class="data">
            <time :datetime="date instanceof Date ? formatDate(date, 'ISO') : date">
              {{ formatDate(date, 'dd MMM') }}
            </time>
            -
            <time :datetime="dateEnd instanceof Date ? formatDate(dateEnd, 'ISO') : dateEnd">
              {{ formatDate(dateEnd, 'dd MMM') }}
            </time>
          </span>
          <time v-else class="data" :datetime="date instanceof Date ? formatDate(date, 'ISO') : date">
            {{ formatDate(date, 'PP') }}
          </time>
        </template>
      </div>

      <div v-if="category || !!$slots.category" :class="categoryIcon ? 'categoryicon-top' : 'category-top'">
        <Icon v-if="categoryIcon" :name="categoryIcon" :color="categoryIconColor" />
        <span class="category">
          <slot name="category">
            {{ category }}
          </slot>
        </span>

        <template v-if="date && datePosition === 'category'">
          <span v-if="dateEnd" class="data">
            <time :datetime="date instanceof Date ? formatDate(date, 'ISO') : date">
              {{ formatDate(date, 'dd MMM') }}
            </time>
            -
            <time :datetime="dateEnd instanceof Date ? formatDate(dateEnd, 'ISO') : dateEnd">
              {{ formatDate(dateEnd, 'dd MMM') }}
            </time>
          </span>
          <time v-else class="data" :datetime="date instanceof Date ? formatDate(date, 'ISO') : date">
            {{ formatDate(date, 'PP') }}
          </time>
        </template>
      </div>

      <component :is="titleTag" v-if="title || !!$slots.title" :class="['card-title', titleClass]">
        <slot name="title">{{ title }}</slot>
      </component>

      <div v-if="!!$slots.text" class="card-text font-sans-serif">
        <slot name="text" />
      </div>

      <slot />

      <div v-if="!!$slots.footer" class="it-card-footer">
        <slot name="footer" />
      </div>

      <NuxtLink v-if="readMoreLink" :to="readMoreLink" class="read-more">
        <span class="text">{{ readMoreLabel }}</span>
        <Icon name="it-arrow-right" />
      </NuxtLink>
    </div>

    <slot name="after-body" />
  </component>
</template>

<style lang="scss" scoped>
.card {
  &-body {
    .head-tags {
      margin-bottom: 16px;
    }
  }

  &-teaser-large {
    flex: 0 0 80% !important;
    min-width: 500px;
    min-width: 100%;
  }
  &.border-left-card {
    border-left: 8px solid $primary-a2;
  }

  &.card-label::before {
    content: '';
    display: block;
    margin-top: 48px;
    margin-left: 24px;
  }

  &-calendar-double {
    width: 100px;
    font-size: 1em;

    .card-day {
      line-height: 1.8;

      small {
        text-transform: lowercase;
        font-size: 0.889em;
      }
    }
  }
}
</style>
