// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      htmlAttrs: {
        lang: 'it',
      },
    },
    pageTransition: { name: 'fade', mode: 'out-in' },
  },

  css: ['assets/scss/bootstrap-italia-custom.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$primary-h: ${process.env.COLOR_PRIMARY_H};
            $primary-s: ${process.env.COLOR_PRIMARY_S};
            $primary-b: ${process.env.COLOR_PRIMARY_B};
            @import "~/assets/scss/global";`,
        },
      },
    },
  },

  modules: ['@nuxtjs/strapi', '@nuxt/image', '@vueuse/nuxt', 'nuxt-meilisearch', '@pinia/nuxt', '@nuxtjs/sitemap'],

  meilisearch: {
    hostUrl: process.env.MEILISEARCH_HOST,
    searchApiKey: process.env.MEILISEARCH_SEARCH_API_KEY,
    adminApiKey: process.env.MEILISEARCH_ADMIN_API_KEY,
    serverSideUsage: false,
    instantSearch: {
      theme: 'algolia',
    },
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  runtimeConfig: {
    strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337',
  },

  ssr: false,

  nitro: {
    preset: 'node-server',
  },

  typescript: {
    strict: true,
  },

  devtools: {
    enabled: true,
  },
});
