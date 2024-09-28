<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core';
import type { DocumentoPubblico } from '~/types/strapi';

const route = useRoute();
const { settings } = useConfigStore();

const parentPage = settings.nav.amministrazione.menu.find(
  ({ path }) => path === settings.nav.amministrazione.routes.documenti,
);
const page = parentPage?.menu?.find(({ path }) => path.substring(path.lastIndexOf('/') + 1) === route.params.taxonomy);
if (!page) showError({ statusCode: 404 });

const documentiQuery = ref({
  index: 'documento-pubblico',
  itemT: {} as DocumentoPubblico,
  sort: ['titolo:asc', 'data:desc'],
  filters: `tax_documento.slug=${page?.taxonomySlug}`,
  pageSize: 10,
});

const { width: windowWidth } = useWindowSize();
const mdGridBreakpoint = 768; // bootstrap-italia grid-breakpoint 'md'
const isDesktop = computed(() => windowWidth.value > mdGridBreakpoint);
</script>

<template>
  <Page :title="page?.name" :description="page?.description">
    <PageHeading :nav="parentPage?.menu?.length ? parentPage : undefined" class="drop-shadow pb-4" />

    <section class="section px-0">
      <div class="container">
        <StrapiSearch :find="documentiQuery" show-total-results>
          <template #response="{ data: documenti }">
            <List class="pb-4">
              <ListItem
                v-for="documento in documenti"
                :key="documento.id"
                :img="documento.immagine"
                class="document-item"
              >
                <NuxtLink :to="`${page?.path}/${documento.slug}`" class="document-page-link">
                  <StrapiSearchHighlight attr="titolo" :item="documento" />
                  <small v-if="documento.identificativo">#{{ documento.identificativo }}</small>
                  <em v-if="documento.descrizione">
                    <StrapiSearchHighlight attr="descrizione" :item="documento" />
                  </em>
                </NuxtLink>
                <template #after>
                  <div v-if="isDesktop" class="list-item-info py-3">
                    <div v-if="documento.data"><b>Data pubblicazione</b>: {{ formatDate(documento.data, 'P') }}</div>
                    <div v-if="documento.dataFine"><b>Data scadenza</b>: {{ formatDate(documento.dataFine, 'P') }}</div>
                    <div v-if="documento.unita_organizzativa" class="pt-1 small">
                      <b>Area/Ufficio</b>:
                      <StrapiSearchHighlight attr="unita_organizzativa_titolo" :item="documento" />
                    </div>
                  </div>
                  <Popover v-else placement="top" hover focus plain>
                    <Icon name="it-more-actions" size="sm" color="primary" class="mx-2" />
                    <template #content>
                      <div class="list-item-info">
                        <div v-if="documento.data">
                          <b>Data pubblicazione</b>: {{ formatDate(documento.data, 'P') }}
                        </div>
                        <div v-if="documento.dataFine">
                          <b>Data scadenza</b>: {{ formatDate(documento.dataFine, 'P') }}
                        </div>
                        <div v-if="documento.unita_organizzativa" class="pt-1 small">
                          <b>Area/Ufficio</b>:
                          <StrapiSearchHighlight attr="unita_organizzativa_titolo" :item="documento" />
                        </div>
                      </div>
                    </template>
                  </Popover>
                </template>
              </ListItem>
            </List>
          </template>
          <template #fallback>
            <div class="p-4 text-center">Nessun documento trovato</div>
          </template>
        </StrapiSearch>
      </div>
    </section>
  </Page>
</template>

<style lang="scss" scoped>
:deep(.document-item) {
  .document-page-link {
    @include on-event {
      text-decoration: underline !important;
    }
  }

  .it-right-zone {
    width: 50%;
  }

  .list-item-info {
    color: $color-text-secondary;
    font-size: 0.77778rem;
    flex-grow: 1;

    @include media-breakpoint-down(md) {
      visibility: hidden;
    }
  }
}
</style>
