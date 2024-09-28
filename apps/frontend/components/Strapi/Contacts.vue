<script lang="ts" setup>
import type { Size, TitleTag } from '~/types/bootstrap-italia';
import type { Contatto, ContattoLink } from '~/types/strapi';

interface Props {
  contacts: Array<Contatto>;
  noLabel?: boolean;
  showIcon?: boolean;
  iconSize?: Size;
  titleTag?: TitleTag;
  titleClass?: string;
  showTitle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  iconSize: 'sm',
  titleTag: 'h3',
  titleClass: 'h5',
  showTitle: false,
});

const linkIcons: Record<ContattoLink['tipo'], string> = {
  URL: 'it-link',
  Whatsapp: 'it-whatsapp',
  Telegram: 'it-telegram',
  Skype: 'it-link',
  Linkedin: 'it-linkedin-square',
  Twitter: 'it-twitter',
};

function formatPhoneNumber(text: string) {
  return text.trim().replace(/\s+/g, '').replace(/-/g, '');
}
</script>

<template>
  <div class="contacts-list">
    <div v-for="contactEntry in contacts" :key="contactEntry.id + contactEntry.createdAt" class="pb-3">
      <component :is="titleTag" v-if="showTitle || contacts.length > 1" :class="titleClass">
        {{ contactEntry.titolo }}
      </component>

      <article v-for="contact in contactEntry.valori" :key="contact.id">
        <span v-if="contact.__component === 'contatti.email'">
          <Icon v-if="showIcon" name="it-mail" :size="iconSize" />
          <strong v-if="!noLabel"> {{ contact.isPec ? 'PEC' : 'Email' }}: </strong>
          <NuxtLink :to="`mailto:${contact.valore}`">
            {{ contact.valore }}
          </NuxtLink>
        </span>
        <span v-if="contact.__component === 'contatti.telefono'">
          <Icon v-if="showIcon" name="it-telephone" :size="iconSize" />
          <strong v-if="!noLabel">Telefono: </strong>
          <NuxtLink :to="`tel:${formatPhoneNumber(contact.prefisso + contact.numero)}`">
            {{ contact.prefisso }} {{ contact.numero }}
          </NuxtLink>
        </span>
        <span v-if="contact.__component === 'contatti.link'">
          <Icon v-if="showIcon" :name="linkIcons[contact.tipo] || 'it-link'" :size="iconSize" />
          <strong v-if="!noLabel">{{ capitalize(contact.tipo) }}: </strong>
          <NuxtLink :to="`mailto:${contact.valore}`">
            {{ contact.valore }}
          </NuxtLink>
        </span>
      </article>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contacts-list {
  word-break: break-all;
  white-space: normal;
}
</style>
