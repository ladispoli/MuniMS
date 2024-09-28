<script lang="ts" setup>
const route = useRoute();

const filters = ref({
  slug: route.params.slug,
  tax_unita_organizzativa: {
    slug: {
      $startsWith: 'altra-struttura',
    },
  },
});
interface Props {}

const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
  <StrapiPageUnitaOrganizzativa :query-filters="filters" />
</template>
