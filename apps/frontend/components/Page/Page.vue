<script lang="ts" setup>
import type { SharedSeo } from '~/types/strapi';

export interface PageDataProvided {
  title?: string;
  description?: string;
  keywords?: string;
  robots?: string;
  viewport?: string;
  canonicalUrl?: string;
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
}

interface Props extends PageDataProvided {
  // override props defined in definePageMeta macro
  seo?: SharedSeo;
}

const props = defineProps<Props>();

const { settings } = useConfigStore();
const route = useRoute();
const { $warn } = useNuxtApp();

const siteName = settings.municipalityName;
const pageUrl = 'https://' + settings.domainName + route.path;

const pageData = ref<PageDataProvided>({
  title: getValueOf('title', true) ?? '',
  description: getValueOf('description', true),
  keywords: getValueOf('keywords'),
  robots: getValueOf('robots'),
  viewport: getValueOf('viewport'),
  canonicalUrl: getValueOf('canonicalUrl') ?? pageUrl,
  image: getValueOf('image'),
  publishedAt: getValueOf('publishedAt'),
  updatedAt: getValueOf('updatedAt'),
});

const meta = computed(() => {
  const metaImage = props.seo?.metaImage?.url;

  return {
    title: props.seo?.metaTitle ?? pageData.value.title,
    description: props.seo?.metaDescription ?? pageData.value.description,
    publishedAt: pageData.value.publishedAt,
    updatedAt: pageData.value.updatedAt,
    keywords: props.seo?.keywords ?? pageData.value.keywords,
    robots: props.seo?.metaRobots ?? pageData.value.robots,
    viewport: props.seo?.metaViewport ?? pageData.value.viewport,
    canonicalUrl: props.seo?.canonicalURL ?? pageData.value.canonicalUrl,
    image: metaImage ? useStrapiMediaUrl(metaImage) : pageData.value.image,
  };
});

useHeadSafe(() => {
  const metaData = [
    { name: 'description', content: meta.value.description },
    { name: 'datePublished', content: meta.value.publishedAt },
    { name: 'dateModified', content: meta.value.updatedAt },
    { name: 'author', content: settings.municipalityName },
  ];

  if (meta.value.keywords) {
    metaData.push({ name: 'keywords', content: meta.value.keywords });
  }
  if (meta.value.robots) {
    metaData.push({ name: 'robots', content: meta.value.robots });
  }
  if (meta.value.viewport) {
    metaData.push({ name: 'viewport', content: meta.value.viewport });
  }

  const linkData = [{ rel: 'canonical', href: meta.value.canonicalUrl }];

  return {
    title: meta.value.title,
    titleTemplate: `%s ${settings.metaTitleDivider} ${siteName}`,
    meta: metaData,
    link: linkData,
  };
});

// Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
useSeoMeta({
  title: meta.value.title,
  ogTitle: meta.value.title,
  description: meta.value.description,
  ogDescription: meta.value.description,
  ogImage: meta.value?.image,
  ogSiteName: siteName,
  ogUrl: pageUrl,
  ogType: 'article',
  twitterCard: 'summary_large_image',
});

// get a value from props or route metadata
function getValueOf(key: string, required?: boolean) {
  const value = props[key as never] ?? route.meta[key as never] ?? undefined;

  if (!value) {
    const message = `${key} is not defined in props or in route metadata. Use the definePageMeta macro to set the ${key} key.`;

    if (required) {
      throw new Error(message);
    }
    $warn(message, 'Page.vue');
  }

  return value;
}

provide('page-data', readonly(pageData));
</script>

<template>
  <div class="page">
    <slot />
  </div>
</template>
