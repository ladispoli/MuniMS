<script lang="ts" setup>
import type { Timeline } from '~/types/strapi';

interface Props {
  data: Timeline;
}

const props = defineProps<Props>();

function getTime(timestamp?: string) {
  if (!timestamp) return '';

  const cleanTime = /\d{2}:\d{2}/.exec(timestamp)?.shift(); // extract 'hh:mm'
  if (!cleanTime) return '';

  return `${cleanTime} - `;
}
</script>

<template>
  <div class="timeline">
    <StrapiRichText v-if="data.contenuto" :html="data.contenuto" />

    <div v-if="data.date?.length" class="timeline-list font-sans-serif" data-element="service-calendar-list">
      <div v-for="timelineData in data.date" :key="timelineData.id" class="timeline-list-item">
        <h3 class="timeline-list-item_title">
          <small class="d-flex justify-content-center fw-normal">
            {{ formatDate(timelineData.data, 'y') }}
          </small>
          <span class="d-flex justify-content-center fw-normal h2 mb-0 font-monospace">
            {{ formatDate(timelineData.data, 'dd') }}
          </span>
          <small class="d-flex justify-content-center fw-bold h6 text-uppercase">
            {{ formatDate(timelineData.data, 'MMM') }}
          </small>
        </h3>

        <CardWrapper teaser-large class="timeline-list-item_card w-100 px-3">
          <Card
            :title="getTime(timelineData.orario) + timelineData.titolo"
            title-tag="h4"
            title-class="h5 mb-0"
            border-left
            class="shadow-sm no-after my-0 my-lg-2 p-3"
          >
            <span v-if="timelineData?.descrizione" class="mt-1 mb-0 text-muted" data-element="service-calendar-text">
              {{ timelineData.descrizione }}
            </span>
          </Card>
        </CardWrapper>
      </div>

      <div v-if="data.periodi?.length" class="timeline-list font-sans-serif" data-element="service-calendar-list">
        <div v-for="timelinePeriodo in data.periodi" :key="timelinePeriodo.id" class="timeline-list-item">
          <h3 class="timeline-list-item_title">
            <span class="d-flex justify-content-center fw-normal h2 mb-0 font-monospace">
              {{ timelinePeriodo.valore }}
            </span>
            <span class="d-flex justify-content-center h6 mb-0 text-uppercase">
              {{ timelinePeriodo.misura }}
            </span>
          </h3>

          <CardWrapper teaser-large class="timeline-list-item_card w-100 ps-4 pe-3">
            <Card
              :title="timelinePeriodo.titolo"
              title-tag="h4"
              title-class="h5 mb-0"
              class="shadow no-after my-0 my-lg-2 p-3"
            >
              <span
                v-if="timelinePeriodo?.descrizione"
                class="mt-1 mb-0 text-muted"
                data-element="service-calendar-text"
              >
                {{ timelinePeriodo.descrizione }}
              </span>
            </Card>
          </CardWrapper>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.timeline {
  &-list {
    color: $primary-b2;

    &::after {
      display: block;
      clear: both;
      content: '';
    }

    &-item {
      display: flex;

      &:first-child {
        margin-top: 2rem;
      }

      &_title {
        width: 4.06rem;
        flex-shrink: 0;
        position: relative;
        z-index: 0;
        padding: 0;
        padding-right: 1rem;

        & small {
          line-height: 1;
        }

        &:before {
          position: absolute;
          z-index: 1;
          top: 0;
          right: 5px;
          width: 2px;
          height: 100%;
          background-color: $primary-b2;
          content: '';
        }

        &:after {
          content: '';
          width: 0.625rem;
          height: 0.625rem;
          position: absolute;
          z-index: 1;
          top: 1.87rem;
          right: 0.2px;
          background-color: $primary-b2;
          border-radius: 5px;

          @include media-breakpoint-down(md) {
            width: 0.56rem;
            height: 0.56rem;
            top: 1.56rem;
          }
        }
      }
    }
  }
}
</style>
