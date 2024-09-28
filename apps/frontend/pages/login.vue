<script setup lang="ts">
const { login } = useStrapiAuth();
const user = useStrapiUser();

const router = useRouter();

onBeforeMount(() => {
  if (user.value) {
    router.push('/');
  }
});

const identifier = ref('');
const password = ref('');

const error = ref('');

const onSubmit = async () => {
  try {
    await login({ identifier: identifier.value, password: password.value });
    router.push('/');
  } catch (e: any) {
    console.error(e);
    if (e?.error && e.error.name === 'ValidationError') {
      error.value = 'Email, Nome utente o password non validi.';
    }
    error.value = 'Errore durante il login. Riprova più tardi.';
  }
};
</script>

<template>
  <Page title="Login" description="login page">
    <div class="col-md-8 offset-md-2 col-lg-4 offset-lg-4">
      <div class="mx-3">
        <div class="mb-5">
          <h1 class="text-center title pb-3">MuniMS Login</h1>
          <h2 class="text-center h5">Accedi con il tuo account Strapi</h2>

          <p class="text-center">Potrai visualizzare contenuti pubblicati in "Bozza" in MuniMS</p>
        </div>

        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <Input v-model="identifier" type="text" placeholder="Email o Nome utente" required />
            <Input v-model="password" type="password" placeholder="Password" required />
          </div>

          <Alert v-if="error" color="danger">
            <p>{{ error }}</p>
          </Alert>

          <div class="form-group text-center">
            <Button color="primary" type="submit" block>Login</Button>
          </div>
        </form>
        <hr />
        <div class="text-center mb-5">
          <NuxtLink to="/forgot-password">Hai dimenticato la password?</NuxtLink>
        </div>
      </div>
    </div>
  </Page>
</template>
