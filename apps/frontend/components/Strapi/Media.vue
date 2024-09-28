<script lang="ts" setup>
import type { Media, MediaFormats } from '~/types/strapi';

interface Props {
  data: Media;
  // image props
  format?: MediaFormats; // set a specific strapi image format
  simpleImg?: [width?: number, height?: number]; // without caption and variations, pass additional width and height if needed
  loading?: 'lazy' | 'eager';
  imgAttrs?: Record<string, string>;
  caption?: string; // override data.caption
  alt?: string; // override data.alternativeText
  noCaption?: boolean;
  captionAttrs?: Record<string, string>;
  overlay?: boolean | 'full' | 'black' | 'black full' | 'full black';
  overlayIcon?: string;
  noPlaceholder?: boolean;
  // video props
  noControls?: boolean;
  // file props
  title?: string;
  icon?: string;
  noInfo?: boolean;
  infoAfter?: boolean;
  fileLinkAttrs?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  noControls: false,
});

const src = computed(() => {
  let url;

  if (props.format && props.data.formats) {
    // forced format
    url = props.data.formats[props.format].url;
  } else if (props.simpleImg && props.data.formats) {
    // find the smallest fitting format based on fixed img width and height
    const [imgWidth = 0, imgHeight = 0] = props.simpleImg;

    let prevFormat: { width: number; height: number; url: string } = props.data;
    for (const [_key, format] of Object.entries(props.data.formats)) {
      if (
        format.width >= imgWidth &&
        format.height >= imgHeight &&
        format.width < prevFormat.width &&
        format.height < prevFormat.height
      ) {
        url = format.url;
        prevFormat = format;
      }
    }
  }
  return useStrapiMediaUrl(url ?? props.data.url);
});

const alt = computed(() => {
  let altText = props.alt ?? props.data.alternativeText ?? '';
  if (!altText) {
    const fileName = props.data.name;

    altText = capitalize(
      unslugify(
        // remove file extension
        fileName.substring(0, fileName.lastIndexOf('.')) || fileName,
      ),
    );
  }

  return altText;
});

/** image */

const variants = computed(() => {
  if (!props.data?.formats) return [];

  const variants = Object.values(props.data.formats)
    .filter((format) => format?.hash && format?.url && format?.width > 300)
    .map((format) => ({
      hash: format.hash,
      media: `(max-width: ${format.width}px)`,
      srcset: useStrapiMediaUrl(format.url),
    }));

  return variants;
});

// inline image placeholder as background-image (style)
const placeholderInline = computed(() => {
  if (props.noPlaceholder || !props.data?.placeholder) return {};

  return {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100%',
    backgroundImage: `url(${props.data?.placeholder})`,
  };
});

const overlayClasses = computed(() => {
  const classes = [];

  if (props.overlay) {
    classes.push('overlay-panel');

    if (typeof props.overlay === 'string') {
      classes.push({
        'overlay-black': props.overlay.includes('black'),
        'overlay-panel-fullheight': props.overlay.includes('full'),
      });
    }

    if (props.overlayIcon) {
      classes.push('overlay-icon');
    }
  }

  return classes;
});

/** file */

const formatAndSize = computed(() => {
  const format = props.data.ext.substring(1).toUpperCase();

  if (!+props.data.size) return `(${format} 0 KB)`;

  const decimals = 2;
  const k = 1024;
  const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const unitsIndex = Math.floor(Math.log(props.data.size) / Math.log(k));

  const size = parseFloat((props.data.size / Math.pow(k, unitsIndex)).toFixed(decimals));
  const unit = units[unitsIndex];

  return `(${format} ${size} ${unit})`;
});
</script>

<template>
  <NuxtImg
    v-if="simpleImg && data.mime.startsWith('image')"
    :src="src"
    :alt="alt"
    :width="simpleImg[0]"
    :height="simpleImg[1]"
    :loading="loading"
    :style="placeholderInline"
    v-bind="imgAttrs"
    decoding="async"
  />
  <figure v-else-if="data.mime.startsWith('image')" :class="['figure', { 'overlay-wrapper': overlay }]">
    <picture class="figure-img" itemprop="image">
      <source v-for="variant in variants" :key="variant.hash" :media="variant.media" :srcset="variant.srcset" />
      <NuxtImg
        :src="src"
        :alt="alt"
        :width="data?.width"
        :height="data?.height"
        :style="placeholderInline"
        :loading="loading"
        v-bind="imgAttrs"
        decoding="async"
      />
    </picture>
    <figcaption
      v-if="!noCaption && (!!$slots.default || caption || data.caption)"
      :class="['figure-caption', ...overlayClasses]"
      itemprop="caption"
      v-bind="captionAttrs"
    >
      <span :class="{ 'visually-hidden': overlayIcon }">
        <slot>{{ caption ?? data.caption }}</slot>
      </span>
      <LazyIcon v-if="overlayIcon" :name="overlayIcon" />
    </figcaption>
  </figure>
  <video
    v-else-if="data.mime.startsWith('video')"
    :alt="alt"
    :width="data?.width"
    :height="data?.height"
    :controls="!noControls"
  >
    <source :src="src" />
  </video>
  <div v-else-if="data.mime.startsWith('audio')"></div>
  <article v-else>
    <Icon v-if="icon" :name="icon" size="sm" color="primary" />
    <NuxtLink
      :to="src"
      :title="`${data.name} ${formatAndSize}`"
      target="_blank"
      :download="data.name"
      v-bind="fileLinkAttrs"
    >
      {{ title || alt }} {{ !noInfo && !infoAfter ? formatAndSize : '' }}
    </NuxtLink>
    <small v-if="!noInfo && infoAfter" class="d-block">{{ formatAndSize }}</small>
  </article>
</template>

<style lang="scss" scoped>
.figure {
  margin: 0;
  height: 100%;
}
</style>
