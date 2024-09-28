<script lang="ts" setup>
import type { LinkListItem } from '~/components/List/List.vue';
import type { Taxonomy } from '~/types/strapi';

const { settings } = useConfigStore();
const user = useStrapiUser();

const serviziRoutePath = '/servizi/';

const { data: categorieServizi } = await useStrapiFetch<[Array<LinkListItem>, Array<LinkListItem>]>('taxServizio', {
  contentType: 'tax-servizi',
  params: {
    filters: {
      disabilitato: {
        $ne: true,
      },
    },
    sort: 'nome',
  },
  transform: (taxonomies: Array<Taxonomy>) => {
    const linkList = taxonomies.map(({ nome, slug }) => ({ name: nome, path: serviziRoutePath + slug }));
    const half = Math.ceil(linkList.length / 2);
    return [linkList.slice(0, half), linkList.slice(half)];
  },
});

const strapiAuth = computed(() => ({
  path: user.value ? '/logout' : '/login',
  text: user.value ? 'Logout' : 'Accesso operatori',
}));
</script>

<template>
  <footer id="footer" class="it-footer">
    <div v-once class="it-footer-main">
      <div class="container">
        <div class="row">
          <div class="col-12 footer-items-wrapper logo-wrapper">
            <img class="ue-logo" src="~/assets/icons/logo-eu-inverted.svg" alt="logo Unione Europea" />

            <div class="it-brand-wrapper">
              <NuxtLink to="/" class="gap-2">
                <Logo :height="50" loading="lazy" />

                <div class="it-brand-text">
                  <h2>{{ settings.municipalityName }}</h2>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 footer-items-wrapper">
            <h3 class="footer-heading-title">{{ settings.nav.amministrazione.name }}</h3>
            <List :link-list="settings.nav.amministrazione.menu" class="footer-list" />
          </div>

          <div v-if="categorieServizi?.length" class="col-md-6 footer-items-wrapper">
            <h3 class="footer-heading-title">Categorie di servizio</h3>
            <div class="row">
              <div class="col-md-6">
                <List :link-list="categorieServizi[0]" class="footer-list" />
              </div>
              <div class="col-md-6">
                <List :link-list="categorieServizi[1]" class="footer-list" />
              </div>
            </div>
          </div>

          <div class="col-md-3 footer-items-wrapper">
            <h3 class="footer-heading-title">{{ settings.nav.novita.name }}</h3>
            <List :link-list="settings.nav.novita.menu" class="footer-list" />

            <h3 class="footer-heading-title">{{ settings.nav.vivereIlComune.name }}</h3>
            <List :link-list="settings.nav.vivereIlComune.menu" class="footer-list" />
          </div>

          <div class="col-md-9 mt-md-4 footer-items-wrapper">
            <h3 class="footer-heading-title">Contatti</h3>
            <div class="row">
              <div class="col-md-8">
                <p class="footer-info">
                  <TheFooterInfo :title="settings.municipalityAddress" icon="it-pa" />
                  <TheFooterInfo
                    v-if="settings.municipalityFiscalCode"
                    :title="'Codice fiscale: ' + settings.municipalityFiscalCode"
                  />
                  <TheFooterInfo
                    v-if="settings.municipalityVatNumber"
                    :title="'P. IVA: ' + settings.municipalityVatNumber"
                  />
                  <TheFooterInfo
                    v-if="settings.municipalityUrpEmail"
                    title="Ufficio Relazioni con il Pubblico: "
                    :href="'mailto:' + settings.municipalityUrpEmail"
                    icon="it-mail"
                  >
                    {{ settings.municipalityUrpEmail }}
                  </TheFooterInfo>
                  <br />
                  <TheFooterInfo
                    v-if="settings.municipalityFreephone"
                    title="Numero verde: "
                    :href="'tel:' + settings.municipalityFreephone"
                    icon="it-hearing"
                  >
                    {{ settings.municipalityFreephone }}
                  </TheFooterInfo>
                  <TheFooterInfo
                    v-if="settings.municipalitySwitchboard"
                    title="Centralino unico: "
                    :href="'tel:' + settings.municipalitySwitchboard"
                    icon="it-telephone"
                  >
                    {{ settings.municipalitySwitchboard }}
                  </TheFooterInfo>
                  <TheFooterInfo
                    v-if="settings.municipalityWhatsapp"
                    title="Whatsapp: "
                    :href="'https://wa.me/' + settings.municipalityWhatsapp"
                    target="_blank"
                    icon="it-whatsapp"
                  >
                    {{ settings.municipalityWhatsapp }}
                  </TheFooterInfo>
                  <TheFooterInfo
                    v-if="settings.municipalityEmail"
                    :href="'mailto:' + settings.municipalityEmail"
                    icon="it-mail"
                  >
                    {{ settings.municipalityEmail }}
                  </TheFooterInfo>
                  <TheFooterInfo
                    v-if="settings.municipalityPec"
                    title="Posta Elettronica Certificata: "
                    :href="'mailto:' + settings.municipalityPec"
                    icon="it-mail"
                  >
                    {{ settings.municipalityPec }}
                  </TheFooterInfo>
                </p>
              </div>

              <div class="col-md-4">
                <List :link-list="settings.footer.primary" class="footer-list" />
              </div>
            </div>
          </div>

          <div v-if="settings.socials?.length" class="col-md-3 mt-md-4 footer-items-wrapper">
            <h3 class="footer-heading-title">Seguici su</h3>
            <ul class="list-inline text-start social">
              <li v-for="social in settings.socials" :key="social.name" class="list-inline-item">
                <NuxtLink :to="social.path" target="_blank" class="p-1 text-white">
                  <Icon :name="social.icon" size="sm" color="white" />
                  <span class="visually-hidden">{{ social.name }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <div class="row">
          <div class="col-12 footer-items-wrapper">
            <div class="footer-bottom">
              <List :link-list="settings.footer.secondary" class="footer-list" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="it-footer-secondary container text-secondary x-small mt-1 mb-1">
      <div class="row">
        <div class="col-12 text-right">
          <span class="text-paragraph-inline">
            <span>
              Cittadino informato,
              <NuxtLink :to="settings.github" class="auth-link">
                MuniMS
                <Icon name="it-github" size="xs" color="black" class="ms-1" />
              </NuxtLink>
            </span>
          </span>
          -
          <NuxtLink :to="strapiAuth.path" class="auth-link">
            {{ strapiAuth.text }}
            <Icon name="it-logout" size="xs" color="black" class="ms-1" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.it-footer {
  .footer-heading-title {
    font-size: 0.8rem;
    font-weight: 700;
    line-height: 1.5;
    text-transform: uppercase;

    @include media-breakpoint-up(md) {
      margin-bottom: 0.889rem;
      padding-bottom: 0.889rem;
      border-bottom: 1px solid rgba($color: $white, $alpha: 0.5);
    }
  }

  .footer-items-wrapper {
    @include media-breakpoint-down(sm) {
      & + .footer-items-wrapper {
        .footer-heading-title {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba($color: $white, $alpha: 0.5);
        }
      }
    }
  }

  .it-brand-wrapper {
    padding: 0;
    a {
      text-decoration: none;
    }
  }

  a {
    color: $white;
    font-size: 0.889rem;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
      color: $white;
    }
  }

  .logo-wrapper {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding-top: 32px;
    padding-bottom: 32px;

    @include media-breakpoint-up(sm) {
      flex-direction: row;
      align-items: flex-start;
    }

    .ue-logo {
      max-width: 50%;
    }
  }

  :deep(.footer-list) {
    a {
      color: $white;
      text-decoration: underline;
      padding: 0.3em;
      line-height: 1.3;

      @include on-event {
        color: $white;
      }
    }

    & + .footer-heading-title {
      margin-top: 2.667rem;
    }
  }

  .footer-info {
    font-size: 0.889rem;
    line-height: 1.5;
  }

  .footer-bottom {
    margin-top: 1.667rem;
    padding-top: 1.333rem;
    padding-bottom: 2.5rem;
    border-top: 1px solid rgba($color: $white, $alpha: 0.5);

    :deep(.footer-list) {
      li {
        display: inline;

        &:not(:last-child) {
          margin-right: 2em;
        }
      }
    }
  }

  .it-footer-secondary {
    background-color: $white;
    font-size: 0.777rem;

    .auth-link {
      color: $primary;
      text-decoration: underline;
    }
  }

  .text-right {
    text-align: right;
  }

  .text-paragraph-inline {
    display: inline-block;
  }
}
</style>
