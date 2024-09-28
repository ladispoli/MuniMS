<script lang="ts" setup>
import type { Persona } from '~/types/strapi';

definePageMeta({
  title: 'Persone',
  description: "L'elenco di tutte le persone che compongono l'amministrazione comunale.",
});

const { settings } = useConfigStore();

const personeQuery = {
  index: 'persona',
  itemT: {} as Persona,
  sort: ['cognome:asc', 'nome:asc'],
};
</script>

<template>
  <Page>
    <PageHeading :nav="settings.nav.amministrazione" class="drop-shadow pb-4" />

    <section class="section py-2 px-0">
      <div class="container">
        <StrapiSearch
          :find="personeQuery"
          :stats-label="{
            singular: 'persona trovata in ordine alfabetico',
            plural: 'persone trovate in ordine alfabetico',
          }"
          class="my-5"
        >
          <template #response="{ data: persone }">
            <div class="row g-4">
              <CardWrapper
                v-for="persona in persone"
                :key="persona.id"
                teaser-large
                class="col-md-6 col-lg-4 px-lg-3 mt-0 mb-3 pb-3"
              >
                <StrapiBlockPersonaCard :persona="persona" class="shadow-sm border border-light no-after h-100 pb-0">
                  <template #cognome-nome>
                    <StrapiSearchHighlight attr="cognome" :item="persona" />&nbsp;<StrapiSearchHighlight
                      attr="nome"
                      :item="persona"
                    />
                  </template>
                  <template #text-after>
                    <div class="pt-2">
                      <div v-if="persona.responsabile_unita_organizzative?.length" class="mb-2">
                        <ul class="list-comma-inline fs-6">
                          <strong>responsabile di: </strong>
                          <li
                            v-for="unitaOrganizzativa in persona.responsabile_unita_organizzative"
                            :key="unitaOrganizzativa.id"
                          >
                            {{ unitaOrganizzativa.titolo }}
                          </li>
                        </ul>
                      </div>
                      <div v-if="persona.componente_unita_organizzative?.length" class="mb-2">
                        <ul class="list-comma-inline fs-6">
                          <strong>fa parte di: </strong>
                          <li
                            v-for="unitaOrganizzativa in persona.componente_unita_organizzative"
                            :key="unitaOrganizzativa.id"
                          >
                            {{ unitaOrganizzativa.titolo }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </template>
                </StrapiBlockPersonaCard>
              </CardWrapper>
            </div>
          </template>
          <template #fallback>
            <div class="p-4 text-center">Nessuna persona trovata</div>
          </template>
        </StrapiSearch>
      </div>
    </section>

    <section class="section py-5" aria-describedby="related-content">
      <div class="container">
        <h2 id="related-content" class="text-center text-muted h3 mb-4">Contenuti correlati</h2>

        <div class="row g-4 pt-5 mb-5">
          <CardWrapper class="col-md-6 px-lg-3 pb-lg-3 my-0">
            <Card :read-more-link="settings.nav.amministrazione.routes.politici">
              <template #title>
                <NuxtLink :to="settings.nav.amministrazione.routes.politici" class="text-decoration-none">
                  Politici
                </NuxtLink>
              </template>
            </Card>
          </CardWrapper>

          <CardWrapper class="col-md-6 px-lg-3 pb-lg-3 my-0">
            <Card :read-more-link="settings.nav.amministrazione.routes.personaleAmministrativo">
              <template #title>
                <NuxtLink
                  :to="settings.nav.amministrazione.routes.personaleAmministrativo"
                  class="text-decoration-none"
                >
                  Personale amministrativo
                </NuxtLink>
              </template>
            </Card>
          </CardWrapper>
        </div>
      </div>
    </section>
  </Page>
</template>
