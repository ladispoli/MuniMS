<script lang="ts" setup>
const { settings } = useConfigStore();
</script>

<template>
  <Page :title="settings.nav.amministrazione.name" :description="settings.nav.amministrazione.description">
    <PageHeading :nav="settings.nav.amministrazione" class="pb-4" />

    <section class="container py-5">
      <h2 class="h3 mb-5">Esplora l'amministrazione</h2>

      <div class="row g-4">
        <CardWrapper
          v-for="item in settings.nav.amministrazione.menu"
          :key="item.path"
          class="col-12 col-md-6 col-lg-4 pb-0"
        >
          <Card class="shadow-sm border border-light no-after" no-bg>
            <template #title>
              <NuxtLink :to="item.path" class="text-decoration-none">
                {{ item.name }}
              </NuxtLink>
            </template>
            <span v-if="item?.description">{{ item.description }}</span>
          </Card>
        </CardWrapper>
      </div>
    </section>
  </Page>
</template>
