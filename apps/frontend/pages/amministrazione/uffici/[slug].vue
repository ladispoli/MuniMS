<script lang="ts" setup>
const route = useRoute();

const filters = ref({
  slug: route.params.slug,
  tax_unita_organizzativa: {
    slug: 'struttura-amministrativa_ufficio',
  },
});
</script>

<template>
  <StrapiPageUnitaOrganizzativa :query-filters="filters" />
</template>
