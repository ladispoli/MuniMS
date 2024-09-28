<script lang="ts" setup>
const { settings } = useConfigStore();

interface Props {
  showContacts?: boolean;
  showProblems?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showContacts: true,
  showProblems: true,
});
</script>

<template>
  <CardWrapper class="p-0">
    <Card class="contacts-card w-100 shadow-sm no-after" :rounded="false">
      <template v-if="showContacts && settings.contacts?.length">
        <h2 class="contacts-title text-black">Contatta il comune</h2>
        <List :link-list="settings.contacts" class="contact-list p-0" />
      </template>

      <template v-if="showProblems && settings.problems?.length">
        <h2 class="contacts-title text-black mt-3">Problemi in città</h2>
        <List :link-list="settings.problems" class="contact-list p-0" />
      </template>
    </Card>
  </CardWrapper>
</template>

<style lang="scss" scoped>
.contacts-card {
  .contacts-title {
    font-size: 1.33rem;
  }

  :deep(.contact-list) {
    margin-bottom: 0;

    li a {
      padding-left: 0;

      .icon-left {
        margin-right: 10px;
      }
    }
  }
}
</style>
