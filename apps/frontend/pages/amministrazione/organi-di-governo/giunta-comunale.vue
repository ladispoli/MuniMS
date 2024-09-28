<script lang="ts" setup>
const filters = ref({
  slug: 'giunta-comunale',
  tax_unita_organizzativa: {
    slug: 'struttura-politica',
  },
});
</script>

<template>
  <StrapiPageUnitaOrganizzativa :query-filters="filters" persone-section-before />
</template>
