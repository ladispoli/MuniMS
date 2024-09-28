<script lang="ts" setup>
import type { Taxonomy } from '~/types/strapi';

const filters = ref({
  slug: 'consiglio-comunale',
  tax_unita_organizzativa: {
    slug: 'struttura-politica',
  },
});

const { settings } = useConfigStore();

const amministrazioneRoutes = settings.nav.amministrazione.routes;

const documenti = settings.nav.amministrazione.menu.find(({ path }) => path === amministrazioneRoutes.documenti);
const convocazioniConsigliComunali = documenti?.menu?.find(
  ({ path }) => path === amministrazioneRoutes.documenti + '/convocazioni-consigli-comunali',
);
const convocazioniCommissioniConsiliari = documenti?.menu?.find(
  ({ path }) => path === amministrazioneRoutes.documenti + '/convocazioni-commissioni-consiliari',
);
const convocazioniConferenzeCapigruppo = documenti?.menu?.find(
  ({ path }) => path === amministrazioneRoutes.documenti + '/convocazioni-conferenze-capigruppo',
);

const { data: convocazioniConsigliComunaliTax } = convocazioniConsigliComunali
  ? await useStrapiFetch(convocazioniConsigliComunali.taxonomySlug, {
      contentType: 'tax-documenti',
      singleEntry: true,
      dataT: {} as Taxonomy,
      params: {
        filters: {
          slug: convocazioniConsigliComunali?.taxonomySlug,
          disabilitato: {
            $ne: true,
          },
        },
        fields: ['nome'],
      },
    })
  : { data: undefined };

const { data: convocazioniCommissioniConsiliariTax } = convocazioniCommissioniConsiliari
  ? await useStrapiFetch(convocazioniCommissioniConsiliari.taxonomySlug, {
      contentType: 'tax-documenti',
      singleEntry: true,
      dataT: {} as Taxonomy,
      params: {
        filters: {
          slug: convocazioniCommissioniConsiliari?.taxonomySlug,
          disabilitato: {
            $ne: true,
          },
        },
        fields: ['nome'],
      },
    })
  : { data: undefined };

const { data: convocazioniConferenzeCapigruppoTax } = convocazioniConferenzeCapigruppo
  ? await useStrapiFetch(convocazioniConferenzeCapigruppo.taxonomySlug, {
      contentType: 'tax-documenti',
      singleEntry: true,
      dataT: {} as Taxonomy,
      params: {
        filters: {
          slug: convocazioniConferenzeCapigruppo?.taxonomySlug,
          disabilitato: {
            $ne: true,
          },
        },
        fields: ['nome'],
      },
    })
  : { data: undefined };
</script>

<template>
  <div>
    <StrapiPageUnitaOrganizzativa :query-filters="filters" persone-section-before />

    <section class="section section-muted py-5" aria-describedby="related-content">
      <div class="container">
        <h2 id="related-content" class="text-center text-muted h3 mb-4">Contenuti correlati</h2>

        <div class="row g-4 pt-5 mb-5">
          <CardWrapper class="col-md-6 col-lg-4 px-lg-3 pb-lg-3 my-0">
            <Card :read-more-link="amministrazioneRoutes.commissioni" class="shadow-sm" title-class="h4">
              <template #title>
                <NuxtLink :to="amministrazioneRoutes.commissioni" class="text-decoration-none">
                  Commissioni consiliari
                </NuxtLink>
              </template>
            </Card>
          </CardWrapper>

          <CardWrapper class="col-md-6 col-lg-4 px-lg-3 pb-lg-3 my-0">
            <Card :read-more-link="amministrazioneRoutes.gruppiConsiliari" class="shadow-sm" title-class="h4">
              <template #title>
                <NuxtLink :to="amministrazioneRoutes.gruppiConsiliari" class="text-decoration-none">
                  Gruppi consiliari
                </NuxtLink>
              </template>
            </Card>
          </CardWrapper>

          <CardWrapper class="col-md-6 col-lg-4 px-lg-3 pb-lg-3 my-0">
            <Card :read-more-link="amministrazioneRoutes.consulte" class="shadow-sm" title-class="h4">
              <template #title>
                <NuxtLink :to="amministrazioneRoutes.consulte" class="text-decoration-none">Consulte</NuxtLink>
              </template>
            </Card>
          </CardWrapper>

          <CardWrapper v-if="convocazioniConsigliComunaliTax" class="col-md-6 col-lg-4 px-lg-3 pb-lg-3 my-0">
            <Card :read-more-link="convocazioniConsigliComunali?.path" class="shadow-sm" title-class="h4">
              <template #title>
                <NuxtLink :to="convocazioniConsigliComunali?.path" class="text-decoration-none">
                  {{ convocazioniConsigliComunaliTax.nome }}
                </NuxtLink>
              </template>
            </Card>
          </CardWrapper>

          <CardWrapper v-if="convocazioniCommissioniConsiliariTax" class="col-md-6 col-lg-4 px-lg-3 pb-lg-3 my-0">
            <Card :read-more-link="convocazioniCommissioniConsiliari?.path" class="shadow-sm" title-class="h4">
              <template #title>
                <NuxtLink :to="convocazioniCommissioniConsiliari?.path" class="text-decoration-none">
                  {{ convocazioniCommissioniConsiliariTax.nome }}
                </NuxtLink>
              </template>
            </Card>
          </CardWrapper>

          <CardWrapper v-if="convocazioniConferenzeCapigruppoTax" class="col-md-6 col-lg-4 px-lg-3 pb-lg-3 my-0">
            <Card :read-more-link="convocazioniConferenzeCapigruppo?.path" class="shadow-sm" title-class="h4">
              <template #title>
                <NuxtLink :to="convocazioniConferenzeCapigruppo?.path" class="text-decoration-none">
                  {{ convocazioniConferenzeCapigruppoTax.nome }}
                </NuxtLink>
              </template>
            </Card>
          </CardWrapper>
        </div>
      </div>
    </section>
  </div>
</template>
