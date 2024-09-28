<script lang="ts" setup>
interface Props {
  defaultLogo?: string;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  defaultLogo: '/img/logo.png',
});

const { settings } = useConfigStore();

const strapiMediaDimensions = computed(() => {
  if (props.width && !props.height) {
    return [props.width];
  } else if (!props.width && props.height) {
    return [undefined, props.height];
  }
  return [props.width, props.height];
});
</script>

<template>
  <StrapiMedia
    v-if="settings?.logo"
    :data="settings.logo"
    :simple-img="strapiMediaDimensions"
    no-placeholder
    alt="logo"
  />
  <NuxtImg v-else :src="defaultLogo" alt="logo" :width="width" :height="height" />
</template>
