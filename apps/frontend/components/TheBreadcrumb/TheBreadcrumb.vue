<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';

export type Crumbs = Array<{
  title: string;
  path?: RouteLocationRaw;
  icon?: string;
}>;

interface Props {
  separator?: '/' | '>';
  homeTitle?: string;
  crumbs?: Crumbs;
  label?: string;
  dark?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  separator: '/',
  homeTitle: 'Home',
  label: 'Percorso di navigazione',
});

const separatorChar = computed(() => {
  if (props.separator === '>') return '&gt;';
  return props.separator;
});

const route = useRoute();
const router = useRouter();

const breadcrumb = computed<Crumbs>(() => {
  const crumbs: Crumbs = [{ title: props.homeTitle, path: '/' }];

  if (props.crumbs?.length) {
    return [...crumbs, ...props.crumbs];
  }

  const pathParts = route.path.substring(1).split('/');
  let path = '';

  for (const part of pathParts) {
    if (!part.length) continue;

    path += '/' + part;
    const location = router.resolve(path);

    let title = '';
    if (typeof location.meta?.title === 'string') {
      title = location.meta.title;
    } else {
      title = unslugify(part);
    }

    crumbs.push({
      title,
      path: location.path,
    });
  }

  return crumbs;
});

const NuxtLink = resolveComponent('NuxtLink');
</script>

<template>
  <nav class="breadcrumb-container" :aria-label="label" data-element="breadcrumb">
    <ol :class="['breadcrumb', { 'dark px-3': dark }]">
      <li v-for="(crumb, i) in breadcrumb.slice(0, -1)" :key="crumb.title + i" class="breadcrumb-item">
        <component :is="crumb?.path ? NuxtLink : 'span'" :to="crumb?.path">
          {{ capitalize(crumb.title) }}
        </component>

        <span class="separator" v-html="separatorChar" />
      </li>
      <li class="breadcrumb-item active" aria-current="page">
        <span>{{ capitalize(breadcrumb[breadcrumb.length - 1].title) }}</span>
      </li>
    </ol>
  </nav>
</template>

<style lang="scss" scoped>
.breadcrumb-container {
  margin-top: 1.5rem;
  margin-bottom: 1rem;

  @include media-breakpoint-up(md) {
    margin-top: 2.22rem;
    margin-bottom: 1.333rem;
  }

  .breadcrumb {
    .breadcrumb-item {
      font-size: 0.889rem;
      font-weight: 400;
      line-height: 1.5;

      &.active {
        color: $color-text-secondary;
      }

      a {
        color: $primary;

        @include on-event {
          color: $primary-a10;
        }
      }
    }
  }
}
</style>
