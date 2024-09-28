<script lang="ts" setup>
import { Modal } from 'bootstrap-italia';
import { v4 as uuidv4 } from 'uuid';
import type { Size, TitleTag } from '~/types/bootstrap-italia';

interface Props {
  isOpen?: boolean;
  id?: string;
  title?: string;
  titleTag?: TitleTag;
  titleClass?: string;
  icon?: string;
  closeBtn?: boolean;
  closeLabel?: string;
  footerShadow?: boolean;
  scrollable?: boolean;
  align?: 'centered' | 'left' | 'right';
  size?: Omit<Size, 'xxl' | 'md' | 'xs'>;
  // options
  backdrop?: 'static' | boolean;
  keyboard?: boolean;
  focus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  titleTag: 'h2',
  titleClass: 'h5',
  closeLabel: 'Chiudi finestra modale',
  backdrop: true,
  keyboard: true,
  focus: true,
});

const emit = defineEmits(['toggle', 'close']);

const classes = computed(() => {
  const classes: Array<any> = ['modal', 'fade'];

  return [...classes, { 'alert-modal': props.icon }, { 'it-dialog-scrollable': props.scrollable }];
});

const dialogClasses = computed(() => {
  const classes: Array<any> = ['modal-dialog'];

  if (props.align) classes.push(`modal-dialog-${props.align}`);
  if (props.size) classes.push(`modal-${props.size}`);

  return [...classes];
});

const uuid = props?.id ?? uuidv4();

const modal = ref<HTMLElement | null>(null);
let bsModal: Modal;

onMounted(async () => {
  await nextTick();
  if (modal.value instanceof HTMLElement) {
    const { backdrop, keyboard, focus } = props;
    bsModal = new Modal(modal.value, { backdrop, keyboard, focus });
  }
});

onUnmounted(() => bsModal?.dispose());

watch(
  () => props.isOpen,
  () => toggle(),
);

function toggle() {
  bsModal?.toggle();
  emit('toggle');
}

function close() {
  bsModal?.hide();
  emit('close');
}
</script>

<template>
  <div
    :id="id"
    ref="modal"
    :class="classes"
    tabindex="-1"
    role="dialog"
    :aria-labelledby="`${uuid}-title`"
    :aria-describedby="`${uuid}-description`"
  >
    <div :class="dialogClasses" role="document">
      <div class="modal-content">
        <div v-if="icon || title || closeBtn" class="modal-header">
          <Icon v-if="icon" :name="icon" />

          <component :is="titleTag" v-if="title" :id="`${uuid}-title`" :class="['modal-title', titleClass]">
            {{ title }}
          </component>

          <button v-if="closeBtn" type="button" class="btn-close" :aria-label="closeLabel" @click="close()">
            <Icon name="it-close" />
            <span class="visually-hidden">{{ closeLabel }}</span>
          </button>
        </div>

        <div class="modal-body">
          <p v-if="!!$slots.default" :id="`${uuid}-description`">
            <slot />
          </p>
        </div>

        <div v-if="!!$slots.footer" :class="['modal-footer', { 'modal-footer-shadow': footerShadow }]">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  cursor: pointer;

  &-dialog {
    cursor: auto;
  }
}
</style>
