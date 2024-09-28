<script lang="ts" setup>
import type { LinkList } from '~/components/List/List.vue';

const { settings } = useConfigStore();

const navTopBar = computed(() =>
  settings.navTopBar?.map((item) => ({
    name: item.titolo,
    path: item.link,
    title: item.descrizione,
    attrs: item.attrs,
  })),
);

const topBarLinksIsOpen = ref(false);

function toggleTopBarLinks() {
  topBarLinksIsOpen.value = !topBarLinksIsOpen.value;
}
</script>

<template>
  <div class="it-header-slim-wrapper">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="it-header-slim-wrapper-content">
            <NuxtLink
              class="navbar-brand"
              :to="settings.ownerUrl"
              target="_blank"
              :aria-label="`Vai al portale: ${settings.ownerName} - link esterno - apertura nuova scheda`"
              :title="`Vai al portale: ${settings.ownerName}`"
            >
              <span class="visually-hidden">Ente appartenenza:</span>
              {{ settings.ownerName }}
            </NuxtLink>

            <template v-if="navTopBar?.length">
              <nav class="nav-mobile d-lg-none" aria-label="Navigazione accessoria">
                <Button
                  id="top-bar-links-toggle"
                  class="navbar-toggler text-white"
                  size="xs"
                  :aria-expanded="topBarLinksIsOpen"
                  aria-controls="top-bar-links-collapse"
                  @click="toggleTopBarLinks()"
                >
                  Links
                  <Icon name="it-expand" class="icon-expand" size="xs" color="white" />
                </Button>
                <Collapse
                  id="top-bar-links-collapse"
                  aria-labelledby="top-bar-links-toggle"
                  :is-expanded="topBarLinksIsOpen"
                >
                  <List :link-list="navTopBar" wrapper-class="top-bar-links" />
                </Collapse>
              </nav>
              <nav class="nav-desktop d-none d-lg-block" aria-label="Navigazione accessoria">
                <List :link-list="navTopBar" wrapper-class="top-bar-links" />
              </nav>
            </template>

            <div class="it-header-slim-right-zone" role="navigation">
              <Dropdown
                v-if="settings.locales?.length"
                class="nav-item"
                toggle-class="nav-link btn-link text-white"
                toggle-size="sm"
                toggle-icon-size="xs"
                toggle-icon-color="white"
                toggle-aria-controls="languages"
                :menu="settings.locales as LinkList"
              >
                <span class="visually-hidden">Lingua attiva:</span>
                <span>ITA</span>
              </Dropdown>

              <CittadinoAttivoLogin />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.it-header-wrapper .it-header-slim-wrapper {
  @include media-breakpoint-down(sm) {
    padding-top: 0;
    padding-bottom: 0;
  }

  .navbar-brand {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-mobile {
    width: 100%;
    margin: 0 1.5em;
  }

  .nav-desktop {
    flex-grow: 2;
    justify-content: flex-end;
    height: 100%;

    &:deep(.top-bar-links) {
      padding: 0 24px;
      margin-right: 16px;
      display: flex;
      justify-content: flex-end;
      height: 100%;

      .link-list {
        display: flex;
        margin-bottom: 0;
        border-left: 1px solid rgba(255, 255, 255, 0.2);
        border-right: 1px solid rgba(255, 255, 255, 0.2);
      }
    }
  }

  &:deep(.top-bar-links) {
    .list-item {
      line-height: inherit;
      height: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @include on-event {
        color: $white;
        background-color: transparent;
        text-decoration: underline;
      }
    }
  }

  &:deep(.dropdown) {
    .dropdown-toggle {
      background-color: transparent;

      .icon {
        margin-left: 4px;
      }

      @include on-event {
        background-color: transparent;
        text-decoration: underline;
      }
    }

    .dropdown-item {
      color: $dropdown-link-color;
    }
  }
}
</style>
