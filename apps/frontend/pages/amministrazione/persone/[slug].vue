<script lang="ts" setup>
import type { Persona } from '~/types/strapi';

const route = useRoute();

const { settings } = useConfigStore();

const query = ref({
  contentType: 'persone',
  singleEntry: true,
  dataT: {} as Persona,
  params: {
    filters: {
      slug: route.params.slug,
    },
    populate: {
      immagine: true,
      galleria: true,
      contatti: {
        populate: ['valori'],
      },
      incarichi: {
        fields: ['slug', 'titolo', 'dataInizio', 'dataFine', 'dataInsediamento'],
      },
      responsabile_unita_organizzative: {
        fields: ['slug', 'titolo', 'descrizione'],
        populate: ['tax_unita_organizzativa', 'logo'],
      },
      assessore_unita_organizzative: {
        fields: ['slug', 'titolo', 'descrizione'],
        populate: ['tax_unita_organizzativa', 'logo'],
      },
      componente_unita_organizzative: {
        fields: ['slug', 'titolo', 'descrizione'],
        populate: ['tax_unita_organizzativa', 'logo'],
      },
      cv: true,
      dichiarazioneRedditi: true,
      speseElettorali: true,
      variazioniSituazionePatrimoniale: true,
      altreCariche: true,
      seo: {
        populate: ['metaImage', 'metaSocial'],
      },
    },
  },
});

function getDescription(persona: Persona, short = false, maxLength = 150) {
  let text = '';

  if (persona?.funzione) {
    if (short) {
      return persona.funzione;
    } else {
      text += persona.funzione + ', ';
    }
  }
  if (persona.incarichi?.length) {
    if (short) {
      return persona.incarichi[0].titolo;
    } else {
      const incarichiList = persona.incarichi.map((incarico) => incarico.titolo);
      text += incarichiList.join(', ');
    }
  }
  if (persona.responsabile_unita_organizzative?.length) {
    if (short) {
      return 'Responsabile ' + persona.responsabile_unita_organizzative[0].titolo;
    } else {
      const responsabileList = persona.responsabile_unita_organizzative.map((item) => item.titolo);
      text += `Responsabile di: ${responsabileList.join(', ')}. `;
    }
  }
  if (persona.assessore_unita_organizzative?.length) {
    if (short) {
      return 'Assessore di riferimento ' + persona.assessore_unita_organizzative[0].titolo;
    } else {
      const assessoreList = persona.assessore_unita_organizzative.map((item) => item.titolo);
      text += `Assessore di riferimento di: ${assessoreList.join(', ')}. `;
    }
  }
  if (persona.componente_unita_organizzative?.length) {
    if (short) {
      if (persona.componente_unita_organizzative[0].slug === 'consiglio-comunale') {
        return 'Consigliere comunale';
      }
      return 'Componente ' + persona.componente_unita_organizzative[0].titolo;
    } else {
      const componenteList = persona.componente_unita_organizzative.map((item) => item.titolo);
      text += `Fa parte di: ${componenteList.join(', ')}. `;
    }
  }

  return text.substring(0, maxLength) + '...';
}
</script>

<template>
  <StrapiFetch id="persona" :find="query" fallback-error="404">
    <template #response="{ data }">
      <Page
        :title="`${data.cognome} ${data.nome}`"
        :description="data.seo?.metaDescription || getDescription(data)"
        :published-at="data.publishedAt"
        :updated-at="data.updatedAt"
        :image="data.immagine?.url"
        :seo="data.seo"
      >
        <PageHeading
          :avatar="data.immagine ? { title: `${data.nome} ${data.cognome}`, img: data.immagine } : undefined"
          class="pb-4"
        >
          <h2 class="h4 text-muted">{{ getDescription(data, true) }}</h2>
        </PageHeading>

        <PageContent font="sans-serif">
          <section v-if="data.galleria?.length" class="mb-4">
            <h2 class="h4 mb-0">Galleria</h2>

            <Carousel three-cols>
              <CarouselSlide v-for="image in data.galleria" :key="image.hash">
                <StrapiMedia :data="image" :img-attrs="{ class: 'img-fluid' }" />
              </CarouselSlide>
            </Carousel>
          </section>

          <section font="sans-serif">
            <div v-if="data.funzione || data.incarichi?.length">
              <h2 id="ruolo-title" class="mb-3">Ruolo</h2>

              <ul>
                <li v-if="data.funzione" class="pb-1">
                  <h4 class="h6 m-0">
                    {{ data.funzione }}
                  </h4>
                </li>
                <li v-for="incarico in data.incarichi" :key="incarico.id" class="pb-1">
                  <h4 class="h6 m-0">
                    <NuxtLink :to="`${settings.nav.amministrazione.routes.incarichi}/${incarico.slug}`">
                      {{ incarico.titolo }}
                    </NuxtLink>
                  </h4>
                  <small class="text-muted">
                    <span v-if="incarico.dataInizio"> dal {{ formatDate(incarico.dataInizio, 'P') }} </span>
                    <span v-if="incarico.dataFine"> al {{ formatDate(incarico.dataFine, 'P') }} </span>
                    <span v-if="incarico.dataInsediamento" style="margin-left: -0.4ch">
                      , <b>insediamento</b>: {{ formatDate(incarico.dataInsediamento, 'P') }}
                    </span>
                  </small>
                </li>
              </ul>
            </div>

            <div v-if="data.competenze">
              <h3 class="h4">Competenze</h3>
              <StrapiRichText :html="data.competenze" class="font-sans-serif fs-6" />
            </div>

            <div v-if="data.deleghe">
              <h3 class="h4">Deleghe</h3>
              <StrapiRichText :html="data.deleghe" class="font-sans-serif fs-6" />
            </div>

            <div>
              <div v-if="data.responsabile_unita_organizzative?.length">
                <h3 class="h5 mt-4">Responsabile di</h3>

                <CardWrapper
                  v-for="unitaOrganizzativa in data.responsabile_unita_organizzative"
                  :key="unitaOrganizzativa.id"
                  teaser
                >
                  <Card title-class="h5 mb-1">
                    <template #pre-body>
                      <Avatar v-if="unitaOrganizzativa.logo" :title="unitaOrganizzativa.titolo" size="lg" class="me-3">
                        <StrapiMedia
                          :data="unitaOrganizzativa.logo"
                          :simple-img="[80]"
                          :img-attrs="{ alt: unitaOrganizzativa.titolo }"
                          no-caption
                        />
                      </Avatar>
                      <Icon v-else name="it-pa" />
                    </template>
                    <template #title>
                      <StrapiBlockUnitaOrganizzativaLink
                        :unita-organizzativa="unitaOrganizzativa"
                        class="text-decoration-none"
                      />
                    </template>
                    <template #text>
                      <p class="mb-2">{{ unitaOrganizzativa.descrizione }}</p>
                    </template>
                    <small class="mt-auto mb-0">
                      <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="unitaOrganizzativa">
                        Ulteriori dettagli
                      </StrapiBlockUnitaOrganizzativaLink>
                    </small>
                  </Card>
                </CardWrapper>
              </div>

              <div v-if="data.assessore_unita_organizzative?.length">
                <h3 class="h5 mt-4">Assessore di riferimento di</h3>

                <CardWrapper
                  v-for="unitaOrganizzativa in data.assessore_unita_organizzative"
                  :key="unitaOrganizzativa.id"
                  teaser
                >
                  <Card title-class="h5 mb-1">
                    <template #pre-body>
                      <Avatar v-if="unitaOrganizzativa.logo" :title="unitaOrganizzativa.titolo" size="lg" class="me-3">
                        <StrapiMedia
                          :data="unitaOrganizzativa.logo"
                          :simple-img="[80]"
                          :img-attrs="{ alt: unitaOrganizzativa.titolo }"
                          no-caption
                        />
                      </Avatar>
                      <Icon v-else name="it-pa"
                    /></template>
                    <template #title>
                      <StrapiBlockUnitaOrganizzativaLink
                        :unita-organizzativa="unitaOrganizzativa"
                        class="text-decoration-none"
                      />
                    </template>
                    <template #text>
                      <p class="mb-2">{{ unitaOrganizzativa.descrizione }}</p>
                    </template>
                    <small class="mt-auto mb-0">
                      <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="unitaOrganizzativa">
                        Ulteriori dettagli
                      </StrapiBlockUnitaOrganizzativaLink>
                    </small>
                  </Card>
                </CardWrapper>
              </div>

              <div v-if="data.componente_unita_organizzative?.length">
                <h3 class="h5 mt-4">Fa parte di</h3>

                <CardWrapper
                  v-for="unitaOrganizzativa in data.componente_unita_organizzative"
                  :key="unitaOrganizzativa.id"
                  teaser
                >
                  <Card title-class="h5 mb-1">
                    <template #pre-body>
                      <Avatar v-if="unitaOrganizzativa.logo" :title="unitaOrganizzativa.titolo" size="lg" class="me-3">
                        <StrapiMedia
                          :data="unitaOrganizzativa.logo"
                          :simple-img="[80]"
                          :img-attrs="{ alt: unitaOrganizzativa.titolo }"
                          no-caption
                        />
                      </Avatar>
                      <Icon v-else name="it-pa" />
                    </template>
                    <template #title>
                      <StrapiBlockUnitaOrganizzativaLink
                        :unita-organizzativa="unitaOrganizzativa"
                        class="text-decoration-none"
                      />
                    </template>
                    <template #text>
                      <p class="mb-2">{{ unitaOrganizzativa.descrizione }}</p>
                    </template>
                    <small class="mt-auto mb-0">
                      <StrapiBlockUnitaOrganizzativaLink :unita-organizzativa="unitaOrganizzativa">
                        Ulteriori dettagli
                      </StrapiBlockUnitaOrganizzativaLink>
                    </small>
                  </Card>
                </CardWrapper>
              </div>
            </div>
          </section>

          <LazyPageContentSection v-if="data.contatti?.length" title="Contatti">
            <CardWrapper teaser-large>
              <Card>
                <StrapiContacts show-icon :contacts="data.contatti" />
              </Card>
            </CardWrapper>
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.biografia" title="Biografia" font="serif">
            <StrapiRichText :html="data.biografia" />
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.situazionePatrimoniale" title="Situazione patrimoniale" font="serif">
            <StrapiRichText :html="data.situazionePatrimoniale" />
          </LazyPageContentSection>

          <LazyPageContentSection title="Documenti">
            <CardWrapper v-if="data.cv" teaser>
              <Card class="p-3" title-tag="h4" title-class="h6 mb-0">
                <template #pre-body>
                  <Icon name="it-file" />
                </template>
                <template #title>
                  <StrapiMedia :data="data.cv" title="Curriculum vitae" info-after />
                </template>
              </Card>
            </CardWrapper>

            <div v-if="data.dichiarazioneRedditi?.length">
              <h3 class="h5 font-sans-serif">Dichiarazione dei redditi</h3>

              <CardWrapper teaser>
                <Card
                  v-for="file in data.dichiarazioneRedditi"
                  :key="file.hash"
                  class="p-3"
                  title-tag="h4"
                  title-class="h6 mb-0"
                >
                  <template #pre-body>
                    <Icon name="it-clip" />
                  </template>
                  <template #title>
                    <StrapiMedia :data="file" info-after />
                  </template>
                </Card>
              </CardWrapper>
            </div>

            <div v-if="data.speseElettorali?.length">
              <h3 class="h5 font-sans-serif">Spese elettorali</h3>

              <CardWrapper teaser>
                <Card v-for="file in data.speseElettorali" :key="file.hash" class="p-3" title-class="h6">
                  <template #pre-body>
                    <Icon name="it-clip" />
                  </template>
                  <template #title>
                    <StrapiMedia :data="file" info-after />
                  </template>
                </Card>
              </CardWrapper>
            </div>

            <div v-if="data.variazioniSituazionePatrimoniale?.length">
              <h3 class="h5 font-sans-serif">Variazione situazione patrimoniale</h3>

              <CardWrapper teaser>
                <Card
                  v-for="file in data.variazioniSituazionePatrimoniale"
                  :key="file.hash"
                  class="p-3"
                  title-class="h6"
                >
                  <template #pre-body>
                    <Icon name="it-clip" />
                  </template>
                  <template #title>
                    <StrapiMedia :data="file" info-after />
                  </template>
                </Card>
              </CardWrapper>
            </div>

            <div v-if="data.altreCariche?.length">
              <h3 class="h5 font-sans-serif">Altre cariche</h3>

              <CardWrapper teaser>
                <Card v-for="file in data.altreCariche" :key="file.hash" class="p-3" title-class="h6">
                  <template #pre-body>
                    <Icon name="it-clip" />
                  </template>
                  <template #title>
                    <StrapiMedia :data="file" info-after />
                  </template>
                </Card>
              </CardWrapper>
            </div>
          </LazyPageContentSection>

          <LazyPageContentSection v-if="data.info" title="Ulteriori informazioni" font="serif">
            <StrapiRichText :html="data.info" />
          </LazyPageContentSection>
        </PageContent>
      </Page>
    </template>
  </StrapiFetch>
</template>
