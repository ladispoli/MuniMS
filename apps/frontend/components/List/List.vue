<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';

export interface LinkListItem {
  name: string;
  path?: RouteLocationRaw;
  action?: () => void;
  active?: boolean;
  disabled?: boolean;
  iconLeft?: string;
  iconRight?: string;
  title?: string;
  ariaLabel?: string;
  attrs?: Record<string, string>;
}

export type LinkList = Array<LinkListItem | '---'>;

interface Props {
  wrapperClass?: string;
  class?: string;
  linkList?: LinkList;
  listItemAttrs?: Record<string, string>;
  heading?: string;
  large?: boolean;
  dark?: boolean;
}

const props = defineProps<Props>();

const classes = computed(() => [props.linkList ? 'link-list' : 'it-list', props.class ?? '']);
</script>

<template>
  <div :class="[props.linkList ? 'link-list-wrapper' : 'it-list-wrapper', wrapperClass]">
    <ul :class="classes">
      <li v-if="heading || !!$slots.heading" class="link-list-heading">
        <slot name="heading">
          <h3 class="header p-0 pb-1">{{ heading }}</h3>
        </slot>
      </li>

      <!-- list of ListItem components -->
      <slot />

      <template v-if="linkList?.length">
        <li v-for="(listItem, index) in linkList" :key="`listItem${index}`">
          <span v-if="listItem === '---'" class="divider" />

          <NuxtLink
            v-else
            :class="['list-item', { active: listItem.active }, { disabled: listItem.disabled }, { large }]"
            :to="listItem.path"
            :aria-disabled="listItem.disabled"
            :title="listItem.title"
            :aria-label="listItem.ariaLabel"
            :rel="isExternalLink(listItem.path) ? 'noopener noreferrer' : null"
            :target="isExternalLink(listItem.path) ? '_blank' : null"
            v-bind="listItem.attrs ?? listItemAttrs"
            @click="listItem.action"
          >
            <Icon
              v-if="!!listItem.iconLeft"
              :name="listItem.iconLeft"
              size="sm"
              :color="dark ? 'light' : 'primary'"
              class="icon-left"
            />

            {{ listItem.name }}

            <Icon
              v-if="!!listItem.iconRight"
              :name="listItem.iconRight"
              size="sm"
              :color="dark ? 'light' : 'primary'"
              class="icon-right"
            />
            <span v-if="listItem.active" class="visually-hidden">attivo</span>
          </NuxtLink>
        </li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.link-list {
  :deep(.list-item) {
    line-height: 1.3em;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    cursor: pointer;
    display: inline-flex;
    align-items: baseline;

    @include on-event {
      color: $primary;
    }

    &.router-link-exact-active {
      font-weight: 600;
    }

    .icon-left {
      margin-right: 0.3em;
    }
    .icon-right {
      margin-left: 0.5em;
    }
  }
}
</style>
