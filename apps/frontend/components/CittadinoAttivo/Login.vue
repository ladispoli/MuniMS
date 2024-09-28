<script lang="ts" setup>
const { settings } = useConfigStore();
</script>

<template>
  <Button
    :to="`${settings.cittadinoAttivoBaseUrl}/login`"
    target="_blank"
    class="btn-full"
    color="primary"
    icon
    data-element="personal-area-login"
  >
    <span class="rounded-icon" aria-hidden="true">
      <Icon name="it-user" color="primary" />
    </span>
    <span class="d-none d-lg-block">Accedi all'area personale</span>
  </Button>
</template>

<style lang="scss" scoped>
.login-menu {
  :deep(.dropdown-menu) {
    a.dropdown-item.list-item {
      color: $primary;
    }

    .icon-sm {
      // override icon size set from .it-header-slim-wrapper
      width: 24px;
      height: 24px;
    }
  }
}
</style>
