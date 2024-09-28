<script lang="ts" setup>
const route = useRoute();

const filters = ref({
  slug: route.params.slug,
  tax_unita_organizzativa: {
    slug: {
      $startsWith: 'struttura-politica_gruppo', // includes 'gruppo di maggioranza' and 'gruppo di minoranza'
    },
  },
});
</script>

<template>
  <StrapiPageUnitaOrganizzativa :query-filters="filters" persone-section-before />
</template>
