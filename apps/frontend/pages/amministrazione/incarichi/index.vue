<script lang="ts" setup>
import type { Incarico } from '~/types/strapi';

definePageMeta({
  title: 'Incarichi',
  description: "Cariche, incarichi e ruoli occupati dalle persone che compongono l'amministrazione comunale.",
});

const { settings } = useConfigStore();

const incarichiQuery = {
  index: 'incarico',
  itemT: {} as Incarico,
  sort: ['titolo:asc'],
};
</script>

<template>
  <Page>
    <PageHeading :nav="settings.nav.amministrazione" class="drop-shadow pb-4" />

    <section class="section py-2 px-0">
      <div class="container">
        <StrapiSearch :find="incarichiQuery" class="my-5">
          <template #response="{ data: incarichi }">
            <div class="row g-4">
              <CardWrapper
                v-for="incarico in incarichi"
                :key="incarico.id"
                teaser-large
                class="col-md-6 col-lg-4 px-lg-3 mt-0 mb-3 pb-3"
              >
                <Card title-class="h5" class="shadow-sm border border-light no-after h-100 pb-0">
                  <template #category>
                    <StrapiSearchHighlight attr="tax_incarico_nome" :item="incarico" />
                  </template>
                  <template #title>
                    <NuxtLink
                      :to="`${settings.nav.amministrazione.routes.incarichi}/${incarico.slug}`"
                      class="text-decoration-none"
                    >
                      <StrapiSearchHighlight attr="titolo" :item="incarico" />
                    </NuxtLink>
                  </template>
                  <template #text>
                    <div v-if="incarico.unita_organizzativa" class="mb-3 ms-2">
                      <strong>presso: </strong>
                      <StrapiSearchHighlight attr="unita_organizzativa_titolo" :item="incarico" />
                    </div>
                    <div v-if="incarico.persona">
                      <Icon name="it-user" size="sm" class="me-1" />
                      <NuxtLink :to="`${settings.nav.amministrazione.routes.persone}/${incarico.persona.slug}`">
                        <StrapiSearchHighlight attr="persona_nome" :item="incarico" />
                      </NuxtLink>
                    </div>
                  </template>
                </Card>
              </CardWrapper>
            </div>
          </template>
        </StrapiSearch>
      </div>
    </section>
  </Page>
</template>
