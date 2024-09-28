<script lang="ts" setup>
const route = useRoute();

const filters = ref({
  slug: route.params.slug,
  tax_unita_organizzativa: {
    slug: 'struttura-amministrativa_area',
  },
});

// 'uffici figli'
const children = {
  sectionTitle: 'Uffici',
  queryFilters: ref({
    tax_unita_organizzativa: {
      slug: 'struttura-amministrativa_ufficio',
    },
    unita_organizzativa_padre: {
      slug: route.params.slug,
    },
  }),
};
</script>

<template>
  <StrapiPageUnitaOrganizzativa :query-filters="filters" :children="children" />
</template>
