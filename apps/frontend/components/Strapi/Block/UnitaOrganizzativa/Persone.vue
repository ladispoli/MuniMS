<script lang="ts" setup>
import type { Persona } from '~/types/strapi';

interface Props {
  responsabilePadre?: Persona; // of the parent "unità organizzativa"
  responsabile?: Persona;
  assessore?: Persona;
  componenti?: Array<Persona>;
  responsabilePadreTitle?: string;
  responsabileTitle?: string;
  assessoreTitle?: string;
  componentiTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  responsabilePadreTitle: 'Responsabile',
  responsabileTitle: 'Responsabile',
  assessoreTitle: 'Assessore di riferimento',
  componentiTitle: 'Persone che compongono la struttura',
});

// if responsabile and responsabilePadre have both the same title, merge the section in one
const mergeResponsabiliTitle = computed(() => {
  if (props.responsabilePadreTitle !== props.responsabileTitle) {
    return undefined;
  }

  if (props.responsabileTitle === 'Responsabile') {
    return 'Responsabili';
  } else if (props.responsabileTitle === 'Dirigente') {
    return 'Dirigenti';
  }
});
</script>

<template>
  <div v-if="responsabilePadre && responsabile && !!mergeResponsabiliTitle">
    <h3 class="h4 font-sans-serif">{{ mergeResponsabiliTitle }}</h3>

    <CardWrapper teaser-large>
      <StrapiBlockPersonaCard :persona="responsabilePadre" />
    </CardWrapper>

    <CardWrapper teaser-large>
      <StrapiBlockPersonaCard :persona="responsabile" />
    </CardWrapper>
  </div>
  <template v-else>
    <div v-if="responsabilePadre">
      <h3 class="h4 font-sans-serif">{{ responsabilePadreTitle }}</h3>

      <CardWrapper teaser-large>
        <StrapiBlockPersonaCard :persona="responsabilePadre" />
      </CardWrapper>
    </div>

    <div v-if="responsabile">
      <h3 class="h4 font-sans-serif">{{ responsabileTitle }}</h3>

      <CardWrapper teaser-large>
        <StrapiBlockPersonaCard :persona="responsabile" />
      </CardWrapper>
    </div>
  </template>

  <div v-if="assessore" class="mt-4">
    <h3 class="h4 font-sans-serif">{{ assessoreTitle }}</h3>

    <CardWrapper teaser-large>
      <StrapiBlockPersonaCard :persona="assessore" />
    </CardWrapper>
  </div>

  <div v-if="componenti?.length" class="mt-4">
    <h3 class="h4 font-sans-serif">{{ componentiTitle }}</h3>

    <CardWrapper teaser>
      <StrapiBlockPersonaCard v-for="componente in componenti" :key="componente.id" :persona="componente" />
    </CardWrapper>
  </div>
</template>
