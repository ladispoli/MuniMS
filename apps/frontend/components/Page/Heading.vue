<script lang="ts" setup>
import type { PageDataProvided } from './Page.vue';
import type { LinkList, LinkListItem } from '~/components/List/List.vue';
import type { Color, TitleTag } from '~/types/bootstrap-italia';
import type { TaxArgomento, Media } from '~/types/strapi';

interface Props {
  wrapperClass?: string;
  class?: string;
  titleTag?: TitleTag;
  titleClass?: string;
  titleData?: Record<string, string>; // data attributes data-*
  wordCountInside?: string; // word count to calculate read time
  icon?: string;
  iconColor?: Color;
  nav?: {
    menuHeading?: string;
    menu: LinkList;
  };
  showDate?: boolean;
  showActions?: boolean;
  tags?: Array<TaxArgomento>;
  tagsTitle?: string;
  tagsData?: Record<string, string>; // data attributes data-*
  media?: Media;
  avatar?: {
    title: string;
    img?: Media;
  };
  // override injected pageData
  title?: string;
  description?: string;
  publishedAt?: string;
  updatedAt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  titleTag: 'h1',
  tagsTitle: 'Argomenti',
});

const route = useRoute();

const pageData = inject<Ref<PageDataProvided>>('page-data');

const datePublished = computed(() => {
  if (props.showDate) {
    return props?.publishedAt ?? pageData?.value?.publishedAt;
  }
  return undefined;
});

const { settings } = useConfigStore();
const encodedPageUrl = encodeURIComponent('https://' + settings.domainName + route.path);
const encodedPageTitle = encodeURI(
  (props.title ?? pageData?.value.title ?? '') + ` ${settings.metaTitleDivider} ${settings.municipalityName}`,
);

const shareActions = computed(() => {
  if (!props.showActions) return [];

  const menu: Array<LinkListItem> = [
    {
      name: 'Facebook',
      path: `https://www.facebook.com/sharer/sharer.php?u=${encodedPageUrl}`,
      iconLeft: 'it-facebook',
    },
    {
      name: 'Twitter',
      path: `https://twitter.com/intent/tweet/?url=${encodedPageUrl}&text=${encodedPageTitle}`,
      iconLeft: 'it-twitter',
    },
    {
      name: 'Linkedin',
      path: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedPageUrl}&title=${encodedPageTitle}`,
      iconLeft: 'it-linkedin',
    },
    {
      name: 'Whatsapp',
      path: `https://api.whatsapp.com/send?phone=&text=${encodedPageTitle}%0A${encodedPageUrl}`,
      iconLeft: 'it-whatsapp',
    },
    {
      name: 'Telegram',
      path: `https://t.me/share/url?url=${encodedPageUrl}&text=${encodedPageTitle}`,
      iconLeft: 'it-telegram',
    },
  ];

  menu.forEach((menuItem) => {
    menuItem.ariaLabel = `Condividi su ${menuItem.name}`;
  });

  return menu;
});

const viewActions = computed(() => {
  if (!props.showActions) return [];

  const menu: Array<LinkListItem> = [
    {
      name: 'Stampa',
      action: () => {
        if (window) window.print();
      },
      iconLeft: 'it-print',
    },
    {
      name: 'Invia',
      path: `mailto:?subject=${encodedPageTitle}&body=${encodedPageUrl}`,
      iconLeft: 'it-mail',
      attrs: { target: '_blank' },
    },
  ];

  return menu;
});

const tagsRoutePath = '/argomenti/';

const readTime = computed(() => {
  if (!props.wordCountInside) {
    return undefined;
  }
  const wordCount = props.wordCountInside.split(/\s+/g).length;
  const wordsPerMinute = 200; // average
  const timeInMinute = Math.round(Math.abs(wordCount) / wordsPerMinute);

  if (timeInMinute < 1) {
    return 'meno di 1 min';
  }
  return `${timeInMinute} min`;
});

const showAside = computed(() => props.nav ?? props.showActions ?? props.tags?.length);

const classes = computed(() => ['row justify-content-center', props.class ?? '']);
</script>

<template>
  <div :class="['container', wrapperClass]">
    <div :class="classes">
      <div class="col-12 col-lg-10">
        <div class="row">
          <section :class="[`col-lg-${showAside ? '7' : '12'}`]">
            <div class="d-flex flex-column flex-md-row">
              <Avatar
                v-if="avatar?.img"
                :title="avatar.title"
                size="xxl"
                class="me-3"
                :avatar-attrs="{ class: 'shadow-sm' }"
              >
                <StrapiMedia :data="avatar.img" :img-attrs="{ alt: avatar.title }" no-caption />
              </Avatar>

              <div>
                <div v-if="icon" class="categoryicon-top d-flex gap-2">
                  <Icon :name="icon" :color="iconColor" />
                  <component
                    :is="titleTag"
                    :class="titleClass"
                    :data-element="titleData?.element"
                    itemprop="name headline"
                    data-audio
                  >
                    {{ title || pageData?.title }}
                  </component>
                </div>
                <component
                  :is="titleTag"
                  v-else
                  :class="titleClass"
                  :data-element="titleData?.element"
                  itemprop="name headline"
                  data-audio
                >
                  {{ title || pageData?.title }}
                </component>
                <slot>
                  <p v-if="description || pageData?.description" class="subtitle-small" data-audio>
                    {{ description || pageData?.description }}
                  </p>
                </slot>
              </div>
            </div>

            <div v-if="datePublished || readTime" class="row mt-5 mb-4">
              <div v-if="datePublished" :class="readTime ? 'col-6' : 'col'">
                <small>Data:</small>
                <p class="fw-semibold font-monospace">
                  <time :datetime="datePublished" pubdate>
                    {{ formatDate(datePublished) }}
                  </time>
                </p>
              </div>
              <div v-if="readTime" :class="datePublished ? 'col-6' : 'col'">
                <small>Tempo di lettura:</small>
                <p class="fw-semibold">{{ readTime }}</p>
              </div>
            </div>
          </section>

          <aside v-if="showAside" class="col-lg-4 offset-lg-1 mt-5 mt-lg-0">
            <nav v-if="nav" class="section-menu mb-4">
              <List :link-list="nav.menu" :heading="nav?.menuHeading" role="menu" />
            </nav>

            <template v-if="showActions">
              <Dropdown
                :menu="shareActions"
                class="d-inline"
                no-toggle-icon
                toggle-class="text-decoration-underline d-inline-flex align-items-center fs-0"
              >
                <Icon name="it-share" size="md" />
                <small>Condividi</small>
              </Dropdown>
              <Dropdown
                :menu="viewActions"
                class="d-inline"
                no-toggle-icon
                toggle-class="text-decoration-underline d-inline-flex align-items-center fs-0"
              >
                <Icon name="it-more-items" size="md" />
                <small>Vedi azioni</small>
              </Dropdown>
            </template>

            <div v-if="tags?.length" :class="['mb-4', { 'mt-4': showActions }]" :data-element="tagsData?.element">
              <div class="row">
                <span class="h6 text-secondary">{{ tagsTitle }}</span>
              </div>
              <ul class="list-unstyled d-flex flex-wrap gap-1 mt-2">
                <li v-for="tag in tags" :key="tag.id">
                  <Chip
                    :label="tag.nome"
                    :to="tagsRoutePath + tag.slug"
                    :data-attribute="tag?.vocabolario"
                    simple
                    color="primary"
                  />
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row justify-content-center">
      <div v-if="media" class="my-3 col-12 col-lg-10">
        <div class="row">
          <StrapiMedia :data="media" class="px-0 img-full" :caption-attrs="{ class: 'text-center pt-3' }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.categoryicon-top {
  .icon {
    position: relative;
    top: 12px;
    &.big-lg-icon {
      width: 1.75rem;
      @include media-breakpoint-up(md) {
        width: 1.833rem;
      }
    }
  }
}
</style>
