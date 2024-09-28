<script lang="ts" setup>
import type { Valutazione } from '~/types/strapi';

interface Props {
  maxRating?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxRating: 5,
});

const route = useRoute();

enum FormStatus {
  AVAILABLE = 0,
  PENDING = 1,
  SUBMITTED = 2,
}

const step = ref<number>(0); // 0 = don't show form options (start from there), 1 = rating, 2 = details
const status = ref<number>(FormStatus.AVAILABLE);

const formData = reactive({
  rating: 0,
  risposta: '',
  descrizione: '',
});

watch(
  () => route.path,
  (newPath) => {
    // reset form
    step.value = 0;
    formData.rating = 0;
    formData.risposta = '';
    formData.descrizione = '';
    setStatusBasedOnRoute(newPath);
  },
);

onMounted(() => setStatusBasedOnRoute());

const steps = computed(() => {
  const ratingQuestion =
    formData.rating < 4
      ? {
          title: 'Dove hai incontrato le maggiori difficoltà?',
          options: [
            'A volte le indicazioni non erano chiare',
            'A volte le indicazioni non erano complete',
            'A volte non capivo se stavo procedendo correttamente',
            'Ho avuto problemi tecnici',
            'Altro',
          ],
          dataElement: 'feedback-rating-negative',
        }
      : {
          title: 'Quali sono stati gli aspetti che hai preferito?',
          options: [
            'Le indicazioni erano chiare',
            'Le indicazioni erano complete',
            'Capivo sempre se stavo procedendo correttamente',
            'Non ho avuto problemi tecnici',
            'Altro',
          ],
          dataElement: 'feedback-rating-positive',
        };

  const detailsQuestion = {
    title: 'Vuoi aggiungere altri dettagli?',
    options: [],
    dataElement: 'feedback-details',
  };

  return [ratingQuestion, detailsQuestion];
});

const { create } = useStrapi();

async function submitFeedback() {
  status.value = FormStatus.PENDING;

  await create<Valutazione>('valutazioni', {
    url: route.path,
    ...formData,
  }).then((data) => {
    const submittedRoutes = JSON.parse(localStorage.getItem('submitted-feedback-routes') || '{}') || {};
    submittedRoutes[route.path] = true;
    localStorage.setItem('submitted-feedback-routes', JSON.stringify(submittedRoutes));
    status.value = FormStatus.SUBMITTED;
  });
}

function setStatusBasedOnRoute(routePath: string = route.path) {
  const submittedRoutes = JSON.parse(localStorage.getItem('submitted-feedback-routes') || '{}') || {};
  if (submittedRoutes[routePath]) {
    status.value = FormStatus.SUBMITTED;
  } else {
    status.value = FormStatus.AVAILABLE;
  }
}
</script>

<template>
  <CardWrapper class="p-0">
    <Card class="page-ratings-card w-100 shadow-sm no-after" :rounded="false" data-element="feedback">
      <Transition name="fade" mode="out-in">
        <form
          v-if="status === FormStatus.AVAILABLE"
          class="form-feedback d-block m-0"
          @submit.prevent="submitFeedback()"
        >
          <h2 class="fs-5 text-black mb-3" data-element="feedback-title">
            Quanto sono chiare le informazioni su questa pagina?
          </h2>

          <Rating id="page-feedback" v-model="formData.rating" :max="maxRating" @click="step = 1">
            <template #label>
              <span class="visually-hidden">
                Valuta da 1 a <span>{{ maxRating }} stelle</span> la pagina
              </span>
            </template>
          </Rating>

          <Transition name="fade" appear>
            <div v-if="step > 0">
              <fieldset class="page-feedback-options w-100" :data-element="steps[step - 1].dataElement">
                <legend class="header w-100 p-0" data-element="feedback-rating-question">
                  <h3
                    class="step-title fs-6 p-4 mb-4 d-flex flex-column flex-lg-row flex-wrap align-items-lg-center justify-content-between drop-shadow"
                  >
                    <span class="text-wrap">{{ steps[step - 1].title }}</span>
                    <span class="small">{{ step }}/{{ steps.length }}</span>
                  </h3>
                </legend>

                <Transition name="fade" mode="out-in">
                  <div v-if="step === 1" class="p-3">
                    <Radio
                      v-for="option in steps[0].options"
                      :key="`option-${option}`"
                      v-model="formData.risposta"
                      name="feedback-rating-options"
                      class="border-bottom border-light my-3 pb-2"
                      :value="option"
                      :label="option"
                      data-element="feedback-rating-answer"
                    />
                  </div>
                  <div v-else-if="step === 2" class="p-3">
                    <Input
                      v-model="formData.descrizione"
                      type="textarea"
                      label="Dettaglio"
                      info="Inserire massimo 200 caratteri"
                      :maxlength="200"
                      data-element="feedback-input-text"
                    />
                  </div>
                </Transition>
              </fieldset>

              <div class="w-100 pt-4 drop-shadow-up d-flex flex-nowrap justify-content-center">
                <Button color="primary" outline class="me-4" @click="--step < 1 ? (formData.rating = 0) : null">
                  Indietro
                </Button>
                <Button v-if="step < 2" color="primary" @click="step++">Avanti</Button>
                <Button v-else color="primary" type="submit">Invia</Button>
              </div>
            </div>
          </Transition>
        </form>
        <div v-else-if="status === FormStatus.PENDING" class="p-4 text-center">
          <Progress spinner double />
        </div>
        <div v-else-if="status === FormStatus.SUBMITTED">
          <h2 class="fs-5 text-black mb-0" data-element="rating-feedback">
            Grazie, il tuo parere ci aiuterà a migliorare il servizio!
          </h2>
        </div>
      </Transition>
    </Card>
  </CardWrapper>
</template>
