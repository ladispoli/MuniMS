<script lang="ts" setup>
interface Props {
  isDesktop?: boolean;
  isSticky?: boolean;
}

const props = defineProps<Props>();

const { settings } = useConfigStore();

const mobileMenuWidth = '250px';

const navWrapper = ref<HTMLElement | null>(null);

defineExpose({ navWrapper });
</script>

<template>
  <div
    id="header-nav-wrapper"
    ref="navWrapper"
    :class="['it-header-navbar-wrapper', { 'is-desktop': isDesktop }, { 'is-sticky': isSticky }]"
  >
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="navbar navbar-expand-lg has-megamenu">
            <Button
              class="custom-navbar-toggler"
              plain
              aria-controls="header-nav"
              aria-label="Mostra/Nascondi la navigazione"
            >
              <Icon name="it-burger" size="sm" color="white" />
            </Button>

            <div id="header-nav" ref="nav" class="navbar-collapsable">
              <div class="overlay"></div>
              <div class="close-div">
                <Button class="close-menu" plain>
                  <span class="visually-hidden"> Nascondi la navigazione </span>
                  <Icon name="it-close-big" />
                </Button>
              </div>
              <div class="menu-wrapper">
                <div v-show="isSticky && isDesktop" class="it-brand-wrapper cloned-element">
                  <NuxtLink to="/">
                    <Logo :height="45" loading="lazy" />

                    <div class="it-brand-text">
                      <div class="it-brand-title">
                        {{ settings.municipalityName }}
                      </div>
                      <div v-if="settings.municipalityTagline" class="it-brand-tagline d-none d-md-block">
                        {{ settings.municipalityTagline }}
                      </div>
                    </div>
                  </NuxtLink>
                </div>

                <nav v-if="settings.nav.primary?.length" class="nav-primary-wrapper" aria-label="Principale">
                  <ul class="navbar-nav navbar-primary" data-element="main-navigation">
                    <li v-for="navItem in settings.nav.primary" :key="navItem.path" class="nav-item">
                      <NuxtLink
                        :class="['nav-link', { active: $route.path.startsWith(navItem.path) }]"
                        :to="navItem.path"
                        v-bind="navItem.attrs"
                      >
                        <span>{{ navItem.name }}</span>
                      </NuxtLink>
                    </li>
                  </ul>
                </nav>

                <nav v-if="settings.nav.secondary?.length" class="nav-secondary-wrapper" aria-label="Secondaria">
                  <ul v-show="!isSticky || !isDesktop" class="navbar-nav navbar-secondary">
                    <li v-for="navItem in settings.nav.secondary" :key="navItem.path" class="nav-item">
                      <NuxtLink
                        :class="['nav-link', { active: $route.path.startsWith(navItem.path) }]"
                        :to="navItem.path"
                        v-bind="navItem.attrs"
                      >
                        <span
                          :class="{
                            'fw-bold': navItem.path === '/argomenti',
                          }"
                        >
                          {{ navItem.name }}
                        </span>
                      </NuxtLink>
                    </li>
                  </ul>
                </nav>

                <div v-if="settings.socials?.length" class="it-socials">
                  <span>Seguici su</span>
                  <ul class="list-unstyled">
                    <li v-for="social in settings.socials" :key="social.name">
                      <NuxtLink :to="social.path" target="_blank">
                        <Icon :name="social.icon" size="sm" color="primary" align="top" />
                        <span class="visually-hidden">{{ social.name }}</span>
                      </NuxtLink>
                    </li>
                  </ul>
                </div>

                <TheHeaderSearch v-show="isSticky && isDesktop" class="search cloned-element" small />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.it-header-wrapper .it-nav-wrapper .it-header-navbar-wrapper {
  nav {
    padding-left: 0;
    padding-right: 0;
  }

  .navbar .navbar-collapsable {
    .navbar-nav {
      &.dropdown {
        button {
          display: flex;
          align-items: center;
          background-color: transparent;
          color: $white;

          svg {
            fill: $white;
            width: 18px;
            height: 18px;
            margin-left: 4px;
            transition: all 0.3s;
            transform-origin: center;
          }

          &:hover {
            background-color: transparent;
            text-decoration: underline;
          }

          &[aria-expanded='true'] {
            svg {
              transform: scaleY(-1);
            }
          }
        }
      }
      .nav-item {
        .nav-link {
          font-size: 1rem;

          @include media-breakpoint-up(xl) {
            padding: 0.89rem 1.33rem;
          }

          &.active {
            background-color: rgba($color: $primary, $alpha: 0.05);
          }
        }
      }

      &.navbar-secondary li {
        &:not(:last-child) {
          @include media-breakpoint-between(lg, lg) {
            display: none;
          }
        }
      }
    }

    .menu-wrapper {
      width: v-bind(mobileMenuWidth);
      min-width: max-content;

      .navbar-primary .nav-item {
        font-size: 1.12rem;
        font-weight: bold;
      }

      .it-brand-wrapper.cloned-element {
        .it-brand-text {
          display: none;
        }
      }
    }

    .close-div {
      right: auto;
      left: calc(v-bind(mobileMenuWidth) + 1rem);
    }

    .logo-hamburger {
      display: flex;
      align-items: center;
      color: $primary;
      padding: 32px 50px 16px 24px;

      @include media-breakpoint-up(sm) {
        padding: 32px 65px 16px 24px;
      }

      .icon {
        fill: $primary;
        margin-right: 16px;
      }

      .it-brand-title {
        font-weight: bold;
        font-size: 24px;
        line-height: 1.167;
        max-width: 200px;
      }
    }

    .dropdown-menu {
      .link-list {
        a {
          &:hover {
            color: inherit;
          }
        }
      }
    }

    .it-socials {
      margin-top: 30px;
      padding: 0 24px;
      color: $navigation-link-color;

      ul {
        display: flex;
        align-items: center;
        margin-top: 10px;

        li {
          & + li {
            margin-left: 15px;
          }

          a {
            .icon :deep(svg) {
              color: $navigation-link-color !important;
            }
          }
        }
      }
    }
  }

  .custom-navbar-toggler {
    padding: 0;
  }

  &.is-desktop {
    .navbar .navbar-collapsable {
      .logo-hamburger {
        display: none;
      }

      .it-socials {
        display: none;
      }

      .menu-wrapper {
        width: auto;
        background: transparent;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .navbar-nav {
          padding: 0;
        }
      }
    }
  }
}
</style>
