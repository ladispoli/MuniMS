<script lang="ts" setup>
import type { UnitaOrganizzativa } from '~/types/strapi';

interface Props {
  on?: string; // wrapper component to render
  showAllLink?: boolean;
  wrapperClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  on: 'div',
});

const { settings } = useConfigStore();

const { data: gruppi } = await useStrapiFetch<Record<string, Array<UnitaOrganizzativa>>>('gruppi', {
  contentType: 'unita-organizzative',
  params: {
    filters: {
      tax_unita_organizzativa: {
        slug: {
          $startsWith: 'struttura-politica_gruppo',
        },
      },
    },
    fields: ['slug', 'titolo', 'descrizione'],
    populate: {
      tax_unita_organizzativa: {
        fields: ['slug'],
      },
      logo: true,
    },
    sort: 'titolo',
  },
  // split 'gruppi' based on taxonomy: 'maggioranza' and 'minoranza', 'misti' = not divided
  transform: (gruppi: Array<UnitaOrganizzativa>) => {
    if (!gruppi?.length) return {};

    const gruppiLists: Record<string, Array<UnitaOrganizzativa>> = {
      misti: [],
      maggioranza: [],
      minoranza: [],
    };

    for (const gruppo of gruppi) {
      if (gruppo.tax_unita_organizzativa?.slug === 'struttura-politica_gruppo') {
        gruppiLists.misti.push(gruppo);
      } else if (gruppo.tax_unita_organizzativa?.slug === 'struttura-politica_gruppo_gruppo-di-maggioranza') {
        gruppiLists.maggioranza.push(gruppo);
      } else if (gruppo.tax_unita_organizzativa?.slug === 'struttura-politica_gruppo_gruppo-di-minoranza') {
        gruppiLists.minoranza.push(gruppo);
      }
    }

    for (const key in gruppiLists) {
      if (!gruppiLists[key]?.length) delete gruppiLists[key];
    }

    return gruppiLists;
  },
});

// match 'gruppiLists' keys
const titoliGruppi: Record<string, string> = {
  misti: 'Gruppi Consiliari',
  maggioranza: 'Gruppi Consiliari di Maggioranza',
  minoranza: 'Gruppi Consiliari di Minoranza',
};
</script>

<template>
  <component :is="on" v-for="(sottogruppi, key) in gruppi" :key="key" :class="wrapperClass">
    <div class="container">
      <h2 class="h3 mb-4 text-black">{{ titoliGruppi[key] }}</h2>

      <div class="row g-4 pt-4">
        <CardWrapper
          v-for="gruppo in sottogruppi"
          :key="gruppo.id"
          class="col-md-6 col-lg-4 px-lg-3 pb-lg-3 my-0"
          teaser-large
        >
          <Card class="shadow-sm border border-light my-0" title-class="h5">
            <template #pre-body>
              <Avatar v-if="gruppo.logo" :title="gruppo.titolo" size="lg" class="me-3">
                <StrapiMedia :data="gruppo.logo" :simple-img="[80]" :img-attrs="{ alt: gruppo.titolo }" no-caption />
              </Avatar>
              <Icon v-else name="it-pa" />
            </template>
            <template #title>
              <NuxtLink
                :to="`${settings.nav.amministrazione.routes.gruppiConsiliari}/${gruppo.slug}`"
                class="text-decoration-none"
              >
                {{ gruppo.titolo }}
              </NuxtLink>
            </template>
            <template #text>
              {{ gruppo.descrizione }}
            </template>
          </Card>
        </CardWrapper>
      </div>

      <div v-if="showAllLink" class="text-center">
        <Button :to="settings.nav.amministrazione.routes.gruppiConsiliari" color="primary" class="mt-4">
          Mostra tutti
        </Button>
      </div>
    </div>
  </component>
</template>
