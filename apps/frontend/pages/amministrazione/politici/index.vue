<script lang="ts" setup>
import type { Persona, Incarico, UnitaOrganizzativa } from '~/types/strapi';

interface PersonaConIncarico extends Persona {
  titoloIncarico: string;
}

type ConsiglieriLists = Record<string, Array<Persona>>;

const { settings } = useConfigStore();
const route = useRoute();

const page = settings.nav.amministrazione.menu.find(({ path }) => path === route.matched[0].path);
if (!page) showError({ statusCode: 404 });

const gruppiRoutePath = settings.nav.amministrazione.routes.gruppiConsiliari + '/';

const sindacoQuery = ref({
  contentType: 'incarichi',
  dataT: {} as PersonaConIncarico,
  singleEntry: true,
  params: {
    filters: {
      slug: 'sindaco',
    },
    ...getPersonaParamsFromIncarico(['contatti.valori']),
  },
  transform: (incarico: Incarico) => ({ ...incarico?.persona, titoloIncarico: incarico.titolo }),
});

const vicesindacoQuery = ref({
  contentType: 'incarichi',
  dataT: {} as PersonaConIncarico,
  singleEntry: true,
  params: {
    filters: {
      $or: [{ slug: 'vicesindaco' }, { slug: 'vice-sindaco' }],
    },
    ...getPersonaParamsFromIncarico(['contatti.valori']),
  },
  transform: (incarico: Incarico) => ({ ...incarico?.persona, titoloIncarico: incarico.titolo }),
});

const assessoriQuery = ref({
  contentType: 'incarichi',
  dataT: {} as Array<Persona>,
  params: {
    filters: {
      slug: {
        $startsWith: 'assessor', // assessore, assessora, assessorato...
      },
      tax_incarico: {
        slug: 'politico',
      },
    },
    ...getPersonaParamsFromIncarico(['incarichi']),
  },
  transform: (incarichi: Array<Incarico>) => {
    const persone = incarichi.reduce((filtered: Array<Persona>, incarico) => {
      // extract 'persona'
      if (incarico.persona) {
        filtered.push(incarico.persona);
      }
      return filtered;
    }, []);

    return sortBy(persone, ['cognome', 'nome']) as Array<Persona>;
  },
});

const { data: presidenteDelConsiglio } = await useStrapiFetch<Persona>('presidente-del-consiglio', {
  contentType: 'incarichi',
  singleEntry: true,
  params: {
    filters: {
      slug: {
        $startsWith: 'presidente-del-consiglio',
      },
    },
    fields: ['slug', 'titolo'],
    populate: {
      persona: {
        fields: ['slug', 'nome', 'cognome'],
        populate: ['immagine'],
      },
    },
  },
  transform: (incarico: Incarico) => incarico.persona,
});

const { data: vicepresidenteDelConsiglio } = await useStrapiFetch<Persona>('vice-presidente-del-consiglio', {
  contentType: 'incarichi',
  singleEntry: true,
  params: {
    filters: {
      slug: {
        $startsWith: 'vice-presidente-del-consiglio',
      },
    },
    fields: ['slug', 'titolo'],
    populate: {
      persona: {
        fields: ['slug', 'nome', 'cognome'],
        populate: ['immagine'],
      },
    },
  },
  transform: (incarico: Incarico) => incarico.persona,
});

const consiglieriQuery = ref({
  contentType: 'unita-organizzative',
  dataT: {} as ConsiglieriLists,
  singleEntry: true,
  params: {
    filters: {
      slug: 'consiglio-comunale',
      tax_unita_organizzativa: {
        slug: 'struttura-politica',
      },
    },
    fields: ['slug', 'titolo'],
    populate: {
      tax_unita_organizzativa: {
        fields: ['slug'],
      },
      persone_componenti: {
        populate: ['immagine'],
        sort: ['cognome', 'nome'],
      },
    },
  },
  // split 'gruppi' based on taxonomy: 'maggioranza' and 'minoranza', 'misti' = not divided. Extract 'persone_componenti'
  transform: ({ persone_componenti: consiglieri }: UnitaOrganizzativa): ConsiglieriLists => {
    const consiglieriLists: ConsiglieriLists = {
      maggioranza: [],
      minoranza: [],
      misti: [],
    };

    if (consiglieri?.length) {
      for (const consigliere of consiglieri) {
        // remove "presidente" and "vicepresidente" from "consiglieri"
        if (consigliere.id === presidenteDelConsiglio?.id || consigliere.id === vicepresidenteDelConsiglio?.id) {
          continue;
        }

        if (consigliere.funzione === 'Consigliere di Maggioranza') {
          consiglieriLists.maggioranza.push(consigliere);
        } else if (consigliere.funzione === 'Consigliere di Minoranza') {
          consiglieriLists.minoranza.push(consigliere);
        } else {
          consiglieriLists.misti.push(consigliere);
        }
      }
    }

    // remove empty keys
    for (const key in consiglieriLists) {
      if (!consiglieriLists[key].length) delete consiglieriLists[key];
    }

    return consiglieriLists;
  },
});

// match 'consiglieri' keys
const titoliGruppi: Record<string, string> = {
  maggioranza: 'Consiglieri di Maggioranza',
  minoranza: 'Consiglieri di Minoranza',
  misti: 'Consiglieri',
};

// populate 'persona' on a query for 'incarichi'
function getPersonaParamsFromIncarico(populateFields?: Array<string>) {
  const populate = populateFields?.length ? populateFields : [];
  return {
    fields: ['dataInizio', 'titolo'],
    populate: {
      persona: {
        fields: ['slug', 'nome', 'cognome', 'funzione'],
        populate: [...populate, 'immagine'],
      },
    },
  };
}
</script>

<template>
  <Page :title="page?.name" :description="page?.description">
    <PageHeading :nav="settings.nav.amministrazione" class="drop-shadow pb-4">
      <p class="subtitle-small" data-audio>{{ page?.description }}</p>

      <Button :to="settings.nav.amministrazione.routes.persone" color="primary" outline icon>
        <Icon name="it-search" color="primary" class="me-1" />
        <span>Cerca dall'elenco delle persone</span>
      </Button>
    </PageHeading>

    <section class="page-section py-5">
      <div class="container">
        <div class="sindaco-vicesindaco-row row g-4">
          <StrapiFetch id="sindaco" :find="sindacoQuery" no-fallback class="col-md-6 col-lg-4 px-lg-3 my-0">
            <template #response="{ data: sindaco }">
              <h2 class="h3 pt-3 text-black">{{ sindaco.titoloIncarico }}</h2>
              <CardWrapper teaser-large>
                <StrapiBlockPersonaCard :persona="sindaco" class="shadow" />
              </CardWrapper>
            </template>
          </StrapiFetch>

          <StrapiFetch id="vicesindaco" :find="vicesindacoQuery" no-fallback class="col-md-6 col-lg-4 px-lg-3 my-0">
            <template #response="{ data: vicesindaco }">
              <h2 class="h3 pt-3 text-black">{{ vicesindaco.titoloIncarico }}</h2>
              <CardWrapper teaser-large>
                <StrapiBlockPersonaCard :persona="vicesindaco" />
              </CardWrapper>
            </template>
          </StrapiFetch>
        </div>
      </div>
    </section>

    <StrapiFetch id="assessori" :find="assessoriQuery" on="section" no-fallback class="page-section py-5">
      <template #response="{ data: assessori }">
        <div class="container">
          <h2 class="h3 pb-4 text-black">Assessori</h2>
          <div class="row g-4 mb-5">
            <CardWrapper
              v-for="assessore in assessori"
              :key="assessore.id"
              teaser-large
              class="col-md-6 col-lg-4 px-lg-3 mt-0 mb-3 pb-3"
            >
              <StrapiBlockPersonaCard :persona="assessore" class="shadow-sm border border-light h-100 pb-0" />
            </CardWrapper>
          </div>
        </div>
      </template>
    </StrapiFetch>

    <section v-if="presidenteDelConsiglio || vicepresidenteDelConsiglio" class="page-section py-5">
      <div class="container">
        <h2 class="h3 pb-4 text-black">Presidenza del Consiglio Comunale</h2>

        <div class="row g-4 mb-5">
          <CardWrapper v-if="presidenteDelConsiglio" teaser-large class="col-md-6 col-lg-4 px-lg-3 mt-0 mb-3 pb-3">
            <StrapiBlockPersonaCard :persona="presidenteDelConsiglio" class="shadow h-100 pb-0" />
          </CardWrapper>

          <CardWrapper v-if="vicepresidenteDelConsiglio" teaser-large class="col-md-6 col-lg-4 px-lg-3 mt-0 mb-3 pb-3">
            <StrapiBlockPersonaCard
              :persona="vicepresidenteDelConsiglio"
              class="shadow-sm border border-light h-100 pb-0"
            />
          </CardWrapper>
        </div>
      </div>
    </section>

    <StrapiFetch id="consiglieri" :find="consiglieriQuery" on="section" class="page-section py-5" no-fallback>
      <template #response="{ data: gruppiConsiliari }">
        <div v-for="(gruppoConsiliare, key) in gruppiConsiliari" :key="key" class="container">
          <h2 class="h3 pb-4 text-black">{{ titoliGruppi[key] }}</h2>

          <div class="row g-4 mb-5">
            <CardWrapper
              v-for="consigliere in gruppoConsiliare"
              :key="consigliere.id"
              teaser-large
              class="col-md-6 col-lg-4 px-lg-3 mt-0 mb-3 pb-3"
            >
              <StrapiBlockPersonaCard
                :key="consigliere.id"
                :persona="consigliere"
                class="shadow-sm border border-light no-after h-100 pb-0"
              />
            </CardWrapper>
          </div>
        </div>
      </template>
    </StrapiFetch>
  </Page>
</template>

<style lang="scss" scoped>
.sindaco-vicesindaco-row {
  :deep(.card-wrapper) {
    height: 70%;
  }
}
</style>
