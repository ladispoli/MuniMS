<script lang="ts" setup>
const route = useRoute();

const filters = ref({
  slug: route.params.slug,
  tax_unita_organizzativa: {
    slug: 'struttura-politica_commissione',
  },
});
</script>

<template>
  <StrapiPageUnitaOrganizzativa :query-filters="filters" persone-section-before />
</template>
