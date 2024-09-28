<script lang="ts" setup>
interface Props {
  small?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="it-search-wrapper">
    <span class="d-none d-md-block label">Cerca</span>
    <Button
      :class="['search-link', 'rounded-icon', { small }]"
      icon
      plain
      to="/cerca"
      color="primary"
      aria-label="Cerca nel sito"
    >
      <Icon name="it-search" />
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.it-search-wrapper {
  display: flex;
  align-items: center;
  font-size: $header-center-text-size;
  box-shadow: none;

  @include on-event(true) {
    box-shadow: none;
    background-color: inherit;
  }

  @include media-breakpoint-up(md) {
    margin-left: $header-center-search-distance * 0.5;
  }

  .label {
    color: $header-center-text-color;
  }

  .search-link {
    width: $header-center-search-size;
    height: $header-center-search-size;
    border-radius: $header-center-search-radius;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: $v-gap * 2;
    transition: all 0.3s;

    @include on-event {
      background-color: transparent;
    }

    @include media-breakpoint-up(sm) {
      padding: 0;
      width: 2.67rem;
      height: 2.67rem;
      background-color: transparent;
    }

    @include media-breakpoint-up(md) {
      margin-left: $v-gap;
    }

    @include media-breakpoint-up(lg) {
      background-color: $header-center-text-color;
      @include on-event {
        background: darken($header-center-text-color, 5%);
      }
    }

    @include media-breakpoint-down(sm) {
      margin-right: -1.33rem;
    }

    &.small {
      width: 2rem;
      height: 2rem;

      @include on-event {
        background: darken($header-center-text-color, 5%);
      }
    }

    .icon :deep(svg) {
      fill: $header-center-bg-color;
      width: $header-center-search-icon-size;
      height: $header-center-search-icon-size;
    }
  }
}
</style>
