<script lang="ts" setup>
import type { Persona } from '~/types/strapi';
import type { Size } from '~/types/bootstrap-italia';

interface Props {
  persona: Persona; // populate 'incarichi' and 'contatti.valori' from strapi query params to display inside the Card component
  titleClass?: string;
  avatarSize?: Size;
  avatarSizeSm?: number; // in px
}

const props = withDefaults(defineProps<Props>(), {
  titleClass: 'h5',
  avatarSize: 'xl',
  avatarSizeSm: 60,
});

const { settings } = useConfigStore();
const personaRoutePath = settings.nav.amministrazione.routes.persone + '/' + props.persona?.slug;

const avatarSmallerSize = computed(() => props.avatarSizeSm + 'px');
</script>

<template>
  <Card class="persona-card" :title-class="titleClass">
    <template #title>
      <Icon v-if="!persona?.immagine" name="it-user" class="me-2" />

      <NuxtLink :to="personaRoutePath" class="text-decoration-none">
        <slot name="cognome-nome">{{ persona.cognome }} {{ persona.nome }}</slot>
      </NuxtLink>

      <slot name="title" />
    </template>
    <template #text>
      <ul v-if="persona?.funzione || persona.incarichi?.length" class="list-comma-inline fs-6">
        <li v-if="persona?.funzione">
          <strong>{{ persona.funzione }}</strong>
        </li>
        <li v-for="incarico in persona.incarichi" :key="incarico.id">
          {{ incarico.titolo }}
        </li>
      </ul>

      <slot name="text" />

      <StrapiContacts v-if="persona?.contatti" :contacts="persona.contatti" show-icon no-label class="text-primary" />

      <slot name="text-after" />
    </template>

    <slot />

    <template #after-body>
      <slot name="after-body" />

      <Avatar
        v-if="persona.immagine"
        :to="personaRoutePath"
        :title="`${persona.cognome} ${persona.nome}`"
        :size="avatarSize"
        class="ms-2"
      >
        <StrapiMedia
          :data="persona.immagine"
          :simple-img="[80]"
          :img-attrs="{ alt: `${persona.cognome} ${persona.nome}` }"
          no-caption
        />
      </Avatar>
    </template>
  </Card>
</template>

<style lang="scss" scoped>
.persona-card {
  @include media-breakpoint-down(sm) {
    :deep(.avatar.size-xl) {
      width: v-bind(avatarSmallerSize);
      height: v-bind(avatarSmallerSize);
      min-width: v-bind(avatarSmallerSize);
    }
  }
}
</style>
