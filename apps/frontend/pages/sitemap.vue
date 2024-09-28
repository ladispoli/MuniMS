<script lang="ts" setup>
import type { Evento, Incarico, Luogo, TaxArgomento, Taxonomy, UnitaOrganizzativa } from '~/types/strapi';

interface SiteMapItem {
  name: string;
  path: string;
  subNav?: Array<SiteMapItem>;
  subSubNav?: Record<string, any>;
}

const { settings } = useConfigStore();

definePageMeta({
  title: 'Mappa del sito',
  description: 'gerarchia di tutte le pagine del sito web.',
});

const siteMap = computed(() => {
  const nav: Array<SiteMapItem> = [
    {
      name: 'Homepage',
      path: '/',
      subNav: [
        {
          name: 'Ricerca globale',
          path: '/cerca',
          attrs: { 'data-element': 'search' },
        },
        ...settings.footer.primary,
        ...settings.footer.secondary,
      ],
    },
    {
      name: 'Amministrazione',
      path: '/amministrazione',
      subNav: settings.nav.amministrazione.menu ?? [],
      subSubNav: {
        [settings.nav.amministrazione.routes.organiDiGoverno]: [
          sindaco,
          consiglioComunale,
          giuntaComunale,
          {
            name: 'Commissioni',
            path: settings.nav.amministrazione.routes.commissioni,
            subNav: commissioni,
          },
          {
            name: 'Consulte',
            path: settings.nav.amministrazione.routes.consulte,
            subNav: consulte,
          },
          {
            name: 'Gruppi consiliari',
            path: settings.nav.amministrazione.routes.gruppiConsiliari,
            subNav: gruppiConsiliari,
          },
        ],
        [settings.nav.amministrazione.routes.areeAmministrative]: areeAmministrative,
        [settings.nav.amministrazione.routes.uffici]: uffici,
        [settings.nav.amministrazione.routes.altreStrutture]: altreStrutture,
      },
    },
    {
      name: 'Novità',
      path: '/novita',
      subNav: settings.nav.novita.menu ?? [],
    },
    {
      name: 'Servizi',
      path: '/servizi',
      subNav: serviziTaxonomies ?? [],
    },
    {
      name: 'Vivere il Comune',
      path: '/vivere-il-comune',
      subNav: settings.nav.vivereIlComune.menu ?? [],
      subSubNav: {
        [settings.nav.vivereIlComune.routes.eventi]: eventiAttuali,
        [settings.nav.vivereIlComune.routes.luoghi]: luoghi,
      },
    },
    {
      name: 'Argomenti',
      path: '/argomenti',
      subNav: argomenti ?? [],
    },
  ];

  return nav;
});

const { data: sindaco } = await useStrapiFetch<SiteMapItem>('sindaco', {
  contentType: 'incarichi',
  singleEntry: true,
  params: {
    filters: {
      slug: 'sindaco',
    },
    fields: ['dataInizio'],
    populate: {
      persona: {
        fields: ['slug'],
      },
    },
  },
  transform: (incarico: Incarico) => ({
    name: 'Sindaco',
    path: `${settings.nav.amministrazione.routes.persone}/${incarico?.persona.slug}`,
  }),
});

const { data: consiglioComunale } = await useStrapiFetch<SiteMapItem>('consiglio-comunale', {
  contentType: 'unita-organizzative',
  singleEntry: true,
  params: {
    filters: {
      slug: 'consiglio-comunale',
    },
    fields: ['slug', 'titolo'],
    sort: 'titolo',
  },
  transform: (consiglioComunale: UnitaOrganizzativa) => ({
    name: consiglioComunale.titolo,
    path: `${settings.nav.amministrazione.routes.organiDiGoverno}/${consiglioComunale.slug}`,
  }),
});

const { data: giuntaComunale } = await useStrapiFetch<SiteMapItem>('giunta-comunale', {
  contentType: 'unita-organizzative',
  singleEntry: true,
  params: {
    filters: {
      slug: 'giunta-comunale',
    },
    fields: ['slug', 'titolo'],
    sort: 'titolo',
  },
  transform: (giuntaComunale: UnitaOrganizzativa) => ({
    name: giuntaComunale.titolo,
    path: `${settings.nav.amministrazione.routes.organiDiGoverno}/${giuntaComunale.slug}`,
  }),
});

const { data: commissioni } = await useStrapiFetch<Array<SiteMapItem>>('commissioni', {
  contentType: 'unita-organizzative',
  params: {
    filters: {
      tax_unita_organizzativa: {
        slug: 'struttura-politica_commissione',
      },
    },
    fields: ['slug', 'titolo'],
    sort: 'titolo',
  },
  transform: (commissioni: Array<UnitaOrganizzativa>) =>
    commissioni.map((commissione) => ({
      name: commissione.titolo,
      path: `${settings.nav.amministrazione.routes.commissioni}/${commissione.slug}`,
    })),
});

const { data: consulte } = await useStrapiFetch<Array<SiteMapItem>>('consulte', {
  contentType: 'unita-organizzative',
  params: {
    filters: {
      tax_unita_organizzativa: {
        slug: 'struttura-politica_consulta',
      },
    },
    fields: ['slug', 'titolo'],
    sort: 'titolo',
  },
  transform: (consulte: Array<UnitaOrganizzativa>) =>
    consulte.map((consulta) => ({
      name: consulta.titolo,
      path: `${settings.nav.amministrazione.routes.consulte}/${consulta.slug}`,
    })),
});

const { data: gruppiConsiliari } = await useStrapiFetch<Array<SiteMapItem>>('gruppi-consiliari', {
  contentType: 'unita-organizzative',
  params: {
    filters: {
      tax_unita_organizzativa: {
        slug: {
          $startsWith: 'struttura-politica_gruppo',
        },
      },
    },
    fields: ['slug', 'titolo'],
    sort: 'titolo',
  },
  transform: (gruppiConsiliari: Array<UnitaOrganizzativa>) =>
    gruppiConsiliari.map((gruppoConsiliare) => ({
      name: gruppoConsiliare.titolo,
      path: `${settings.nav.amministrazione.routes.gruppiConsiliari}/${gruppoConsiliare.slug}`,
    })),
});

const { data: areeAmministrative } = await useStrapiFetch<Array<SiteMapItem>>('aree-amministrative', {
  contentType: 'unita-organizzative',
  params: {
    filters: {
      tax_unita_organizzativa: {
        slug: 'struttura-amministrativa_area',
      },
    },
    fields: ['slug', 'titolo'],
    sort: 'titolo',
  },
  transform: (areeAmministrative: Array<UnitaOrganizzativa>) =>
    areeAmministrative.map((area) => ({
      name: area.titolo,
      path: `${settings.nav.amministrazione.routes.areeAmministrative}/${area.slug}`,
    })),
});

const { data: uffici } = await useStrapiFetch<Array<SiteMapItem>>('uffici', {
  contentType: 'unita-organizzative',
  params: {
    filters: {
      tax_unita_organizzativa: {
        slug: 'struttura-amministrativa_ufficio',
      },
    },
    fields: ['slug', 'titolo'],
    sort: 'titolo',
  },
  transform: (uffici: Array<UnitaOrganizzativa>) =>
    uffici.map((ufficio) => ({
      name: ufficio.titolo,
      path: `${settings.nav.amministrazione.routes.uffici}/${ufficio.slug}`,
    })),
});

const { data: altreStrutture } = await useStrapiFetch<Array<SiteMapItem>>('altre-strutture', {
  contentType: 'unita-organizzative',
  params: {
    filters: {
      tax_unita_organizzativa: {
        slug: {
          $startsWith: 'altra-struttura',
        },
      },
    },
    fields: ['slug', 'titolo'],
    sort: 'titolo',
  },
  transform: (altreStrutture: Array<UnitaOrganizzativa>) =>
    altreStrutture.map((struttura) => ({
      name: struttura.titolo,
      path: `${settings.nav.amministrazione.routes.altreStrutture}/${struttura.slug}`,
    })),
});

const { data: serviziTaxonomies } = await useStrapiFetch<Array<SiteMapItem>>('tax-servizi', {
  contentType: 'tax-servizi',
  params: {
    filters: {
      disabilitato: {
        $ne: true,
      },
    },
    fields: ['slug', 'nome'],
    sort: 'nome',
  },
  transform: (taxonomies: Array<Taxonomy>) =>
    taxonomies.map((taxonomy) => ({
      name: taxonomy.nome,
      path: `/servizi/${taxonomy.slug}`,
    })),
});

const today = formatDate(new Date(), 'yyyy-MM-dd');

const { data: eventiAttuali } = await useStrapiFetch<Array<SiteMapItem>>('eventi-attuali', {
  contentType: 'eventi',
  params: {
    filters: {
      dataFine: {
        $gte: today,
      },
    },
    fields: ['slug', 'titolo'],
    populate: ['tax_evento'],
    sort: ['dataInizio:desc'],
  },
  transform: (eventi: Array<Evento>) =>
    eventi.map((evento) => ({
      name: evento.titolo,
      path: `${settings.nav.vivereIlComune.routes.eventi}/${evento.tax_evento.slug}/${evento.slug}`,
    })),
});

const { data: luoghi } = await useStrapiFetch<Array<SiteMapItem>>('luoghi', {
  contentType: 'luoghi',
  params: {
    fields: ['slug', 'nome'],
    populate: ['tax_luogo'],
    sort: ['nome:asc'],
  },
  transform: (luoghi: Array<Luogo>) =>
    luoghi.map((luogo) => ({
      name: luogo.nome,
      path: `${settings.nav.vivereIlComune.routes.luoghi}/${luogo.tax_luogo.slug}/${luogo.slug}`,
    })),
});

const { data: argomenti } = await useStrapiFetch<Array<SiteMapItem>>('argomenti', {
  contentType: 'argomenti',
  params: {
    fields: ['slug', 'nome'],
    sort: ['nome:asc'],
  },
  transform: (argomenti: Array<TaxArgomento>) =>
    argomenti.map((argomento) => ({
      name: argomento.nome,
      path: `argomenti/${argomento.slug}`,
    })),
});
</script>

<template>
  <Page>
    <PageHeading />

    <PageContent font="sans-serif">
      <List v-if="siteMap?.length" :link-list="[]">
        <template v-for="item in siteMap" :key="item.path">
          <li>
            <NuxtLink
              :to="item.path"
              class="list-item large medium"
              v-bind="settings.nav.primary.find((primaryItem) => primaryItem.path === item.path)?.attrs"
            >
              {{ item.name }}
            </NuxtLink>
            <List v-if="item.subNav?.length" class="link-sublist" :link-list="[]">
              <template v-for="subItem in item.subNav" :key="subItem.path">
                <li>
                  <NuxtLink :to="subItem.path" class="list-item fw-semibold">
                    {{ subItem.name }}
                  </NuxtLink>
                  <List v-if="item.subSubNav && item.subSubNav[subItem.path]" class="link-sublist" :link-list="[]">
                    <template
                      v-for="subSubItem in item.subSubNav[subItem.path].filter((subSubItem: any) => subSubItem != null)"
                      :key="subSubItem.path"
                    >
                      <li>
                        <NuxtLink :to="subSubItem.path" class="list-item fw-light">
                          {{ subSubItem.name }}
                        </NuxtLink>
                      </li>
                    </template>
                  </List>
                </li>
              </template>
            </List>
          </li>
          <li><span class="divider" /></li>
        </template>
      </List>
    </PageContent>
  </Page>
</template>
