<script lang="ts" setup>
import type { Color, Size } from '~/types/bootstrap-italia';

export interface Props {
  name: string;
  color?: Color;
  bg?: 'light' | 'dark';
  align?: 'bottom' | 'middle' | 'top';
  size?: Size;
  padded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const icon = ref('');

async function getIcon() {
  const isBsIcon = props.name.startsWith('it-'); // bootstrap-italia icon

  const iconPath = isBsIcon
    ? `/node_modules/bootstrap-italia/src/svg/${props.name}.svg`
    : `/assets/icons/${props.name}.svg`;

  try {
    // import bootstrap-italia icons
    const bsIcons = import.meta.glob('~/node_modules/bootstrap-italia/src/svg/*.svg', {
      as: 'raw',
      eager: false,
    });
    // import local icons
    const localIcons = import.meta.glob('~/assets/icons/**/*.svg', {
      as: 'raw',
      eager: false,
    });

    const rawIcon = await (isBsIcon ? bsIcons : localIcons)?.[iconPath]();
    icon.value = rawIcon;
  } catch {
    throw new Error(`Failed to load icon '${iconPath}'. Does the file exist?`);
  }
}

await getIcon();

watchEffect(getIcon);

const classes = computed(() => {
  const classes: Array<any> = ['icon'];

  if (props.size) classes.push(`icon-${props.size}`);
  if (props.color) classes.push(`icon-${props.color}`);
  if (props.bg) classes.push(`bg-${props.bg}`);
  if (props.align) classes.push(`align-${props.align}`);

  return [...classes, { 'icon-padded': props.padded }];
});
</script>

<template>
  <span v-if="name && icon" :class="classes" aria-hidden="true" v-html="icon" />
</template>

<style lang="scss" scoped>
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  :deep(svg) {
    width: inherit;
    height: inherit;
    fill: inherit;
  }
}
</style>
