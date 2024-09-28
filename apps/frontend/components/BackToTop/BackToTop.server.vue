<script lang="ts" setup>
interface Props {
  small?: boolean;
  shadow?: boolean;
  dark?: boolean;
}

const classes = computed(() => {
  const classes: Array<any> = ['back-to-top'];

  return [...classes, { 'back-to-top-small': props.small, shadow: props.shadow, dark: props.dark }];
});

const props = defineProps<Props>();

const backToTop = ref<HTMLElement | null>(null);
</script>

<template>
  <NuxtLink ref="backToTop" href="#" aria-hidden="true" tabindex="-1" :class="classes">
    <Icon name="it-arrow-up" color="light" />
  </NuxtLink>
</template>
