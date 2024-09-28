<template>
  <main>
    <section>
      <slot />
    </section>

    <section class="page-ratings-section section section-primary py-4 py-lg-5">
      <div class="container px-0">
        <div class="row d-flex justify-content-center p-contacts">
          <div class="col-12 col-lg-6">
            <TheFeedback />
          </div>
        </div>
      </div>
    </section>

    <section class="contacts-section section section-muted py-5">
      <div class="container">
        <div class="row d-flex justify-content-center p-contacts">
          <div class="col-12 col-lg-6">
            <TheContacts v-once />
          </div>
        </div>
      </div>
    </section>

    <BackToTop />
  </main>
</template>
