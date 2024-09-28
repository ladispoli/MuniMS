<script lang="ts" setup>
import type { UnitaOrganizzativa } from '~/types/strapi';
import type { HtmlWrapperTag } from '~/types/bootstrap-italia';

interface Props {
  unitaOrganizzativa: UnitaOrganizzativa;
  wrapperTag?: HtmlWrapperTag;
  searchHighlight?: boolean; // highlight search item from StrapiSearch
}

const { settings } = useConfigStore();

const props = withDefaults(defineProps<Props>(), {
  wrapperTag: 'p',
});

const baseTaxonomyPath: Record<string, string> = {
  'struttura-amministrativa': settings.nav.amministrazione.routes.uffici,
  'struttura-amministrativa_ufficio': settings.nav.amministrazione.routes.uffici,
  'struttura-amministrativa_area': settings.nav.amministrazione.routes.areeAmministrative,
  'struttura-politica': settings.nav.amministrazione.routes.organiDiGoverno,
  'struttura-politica_commissione': settings.nav.amministrazione.routes.commissioni,
  'struttura-politica_consulta': settings.nav.amministrazione.routes.consulte,
  'struttura-politica_gruppo': settings.nav.amministrazione.routes.gruppiConsiliari,
  'struttura-politica_gruppo_gruppo-di-maggioranza': settings.nav.amministrazione.routes.gruppiConsiliari,
  'struttura-politica_gruppo_gruppo-di-minoranza': settings.nav.amministrazione.routes.gruppiConsiliari,
  'altra-struttura': settings.nav.amministrazione.routes.altraStruttura,
  'altra-struttura_azienda-municipalizzata': settings.nav.amministrazione.routes.altraStruttura,
  'altra-struttura_biblioteca': settings.nav.amministrazione.routes.altraStruttura,
  'altra-struttura_centro-culturale': settings.nav.amministrazione.routes.altraStruttura,
  'altra-struttura_ente': settings.nav.amministrazione.routes.altraStruttura,
  'altra-struttura_fondazione': settings.nav.amministrazione.routes.altraStruttura,
  'altra-struttura_museo': settings.nav.amministrazione.routes.altraStruttura,
  'altra-struttura_scuola': settings.nav.amministrazione.routes.altraStruttura,
};

const { $warn } = useNuxtApp();
const warnReference = `\nUnità organizzativa: ${props.unitaOrganizzativa.titolo} (id: ${props.unitaOrganizzativa.id})`;

// get base route path for 'unitaOrganizzativa' by taxonomy
const path = computed(() => {
  const tax = props.unitaOrganizzativa?.tax_unita_organizzativa?.slug;

  const { slug } = props.unitaOrganizzativa;

  if (!tax) {
    $warn(
      '"UnitaOrganizzativa" is not defined or has undefined taxonomy.' + warnReference,
      'StrapiBlockUnitaOrganizzativaLink.vue',
    );
    return undefined;
  }

  if (!(tax in baseTaxonomyPath)) {
    $warn(
      `"UnitaOrganizzativa" taxonomy has unexpected value: ${tax}.` + warnReference,
      'StrapiBlockUnitaOrganizzativaLink.vue',
    );
    return settings.nav.amministrazione.routes.areeAmministrative + slug; // default value
  }

  return `${baseTaxonomyPath[tax]}/${slug}`;
});
</script>

<template>
  <NuxtLink :to="path">
    <slot>
      <StrapiSearchHighlight v-if="searchHighlight" attr="titolo" :item="unitaOrganizzativa" />
      <template v-else>{{ unitaOrganizzativa.titolo }}</template>
    </slot>
  </NuxtLink>
</template>
