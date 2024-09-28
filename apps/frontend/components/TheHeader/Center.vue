<script lang="ts" setup>
const { settings } = useConfigStore();

const centerWrapper = ref<HTMLElement | null>(null);

defineExpose({ centerWrapper });
</script>

<template>
  <div ref="centerWrapper" class="it-header-center-wrapper">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="it-header-center-content-wrapper">
            <div class="it-brand-wrapper">
              <NuxtLink to="/" class="gap-2">
                <Logo class="it-brand-logo" :height="100" loading="eager" />

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

            <div class="it-right-zone">
              <div v-if="settings.socials?.length" class="it-socials d-none d-lg-flex">
                <span>Seguici su</span>
                <ul>
                  <li v-for="social in settings.socials" :key="social.name">
                    <NuxtLink :to="social.path" target="_blank">
                      <Icon :name="social.icon" size="sm" color="white" align="top" />
                      <span class="visually-hidden">{{ social.name }}</span>
                    </NuxtLink>
                  </li>
                </ul>
              </div>

              <TheHeaderSearch />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.it-header-wrapper .it-header-center-wrapper {
  .it-brand-wrapper {
    .it-brand-logo {
      @include media-breakpoint-down(lg) {
        height: 60px;
      }
    }

    .it-brand-text {
      @include media-breakpoint-down(sm) {
        padding: 0;
      }
    }
  }
}
</style>
