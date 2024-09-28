<script lang="ts" setup>
import type { ListinoPrezzi } from '~/types/strapi';

interface Props {
  data: ListinoPrezzi;
}

const props = defineProps<Props>();

function convertInCurrency(price: number, currency = 'EUR', locale = 'it-IT') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
}
</script>

<template>
  <div class="listino-prezzi">
    <StrapiRichText v-if="data.contenuto" :html="data.contenuto" />

    <List class="font-sans-serif" data-element="prices-list">
      <ListItem v-for="prezzo in data.prezzi" :key="prezzo.id">
        <h3 class="lead mb-0">{{ prezzo.titolo }}</h3>

        <span v-if="prezzo.descrizione" class="text-muted fw-light">{{ prezzo.descrizione }}</span>

        <template #after>
          <Badge title="prezzo in Euro" color="light" class="fs-6">
            {{ convertInCurrency(prezzo.costo) }}
          </Badge>
        </template>
      </ListItem>
    </List>
  </div>
</template>
