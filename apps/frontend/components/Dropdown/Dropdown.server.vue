<script lang="ts" setup>
import type { LinkList } from '~/components/List/List.vue';
import type { Color, Size } from '~/types/bootstrap-italia';

interface Props {
  toggleId?: string;
  toggleClass?: string;
  toggleColor?: Color;
  toggleOutline?: boolean;
  toggleDisabled?: boolean;
  toggleSize?: Size;
  toggleBlock?: boolean;
  toggleStyle?: 'button' | 'link';
  noToggleIcon?: boolean;
  toggleIconColor?: Color;
  toggleIconSize?: Size;
  toggleIconBefore?: boolean; // place the icon before the label
  toggleIconDirection?: 'up' | 'down' | 'start' | 'end';
  toggleAriaControls?: string;
  menu: LinkList;
  menuHeading?: string;
  menuLarge?: boolean;
  fullWidth?: boolean;
  dark?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  toggleStyle: 'button',
  noToggleIcon: false,
  toggleIconSize: 'sm',
  toggleIconDirection: 'down',
});

const classes = computed(() => [
  'dropdown',
  props.toggleIconDirection !== 'down' && `drop${props.toggleIconDirection}`,
]);

const toggleClasses = computed(() => [
  props.toggleClass,
  'dropdown-toggle',
  { 'btn-dropdown': !props.toggleColor && !props.toggleSize },
]);

const toggle = ref<HTMLElement | null>(null);
</script>

<template>
  <div :class="classes">
    <Button
      :id="toggleId"
      ref="toggle"
      :class="toggleClasses"
      type="button"
      :color="toggleColor"
      :outline="toggleOutline"
      :disabled="toggleDisabled"
      :size="toggleSize"
      :block="toggleBlock"
      aria-haspopup="true"
      aria-expanded="false"
      :aria-controls="toggleAriaControls"
    >
      <Icon
        v-if="!noToggleIcon && toggleIconBefore"
        name="it-expand"
        class="icon-expand"
        :size="toggleIconSize"
        :color="toggleIconColor"
      />
      <slot />
      <Icon
        v-if="!noToggleIcon && !toggleIconBefore"
        name="it-expand"
        class="icon-expand"
        :size="toggleIconSize"
        :color="toggleIconColor"
      />
    </Button>

    <div :class="['dropdown-menu', { 'full-width': fullWidth }, { dark }]" :aria-labelledby="toggleId">
      <List
        :link-list="menu"
        role="menu"
        :large="menuLarge"
        :list-item-attrs="{ class: 'dropdown-item', role: 'menuitem' }"
      >
        <template v-if="menuHeading" #heading>
          <span class="header list-item">{{ menuHeading }}</span>
        </template>
      </List>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  &-toggle {
    &[aria-expanded='true']:deep(.icon-expand) {
      transform: scaleY(-1);
    }
  }
}
</style>
