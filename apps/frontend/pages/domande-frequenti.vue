<script lang="ts" setup>
import type { Faq } from '~/types/strapi';

const { settings } = useConfigStore();
const page = settings.nav.domandeFrequenti;

if (!page) showError({ statusCode: 404 });

const faqQuery = ref({
  contentType: 'faq',
  dataT: {} as Faq['domande'],
  singleEntry: true,
  params: {
    populate: 'domande',
  },
  transform: ({ domande }: Faq) => domande ?? [],
});
</script>

<template>
  <Page title="Domande frequenti" :description="page?.description">
    <PageHeading class="pb-4" show-actions />

    <StrapiFetch id="faq" :find="faqQuery" on="section" class="container pb-5">
      <template #response="{ data: faq }">
        <div class="row">
          <div class="col-12 col-lg-8 offset-lg-2 px-0 px-sm-3">
            <Accordion id="accordion-faq" keep-open>
              <AccordionItem v-for="domanda in faq" :key="domanda.id" :title="domanda.titolo">
                <StrapiRichText :html="domanda.contenuto" />
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </template>
      <template #fallback>
        <div class="p-4 text-center">Nessuna domanda trovata</div>
      </template>
    </StrapiFetch>
  </Page>
</template>
