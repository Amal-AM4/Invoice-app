<template>
  <div class="modal flex">
    <div class="modal-content">
      <p>Are you sure you want to exit your changes will not be saved?</p>
      <div class="actions flex">
        <button @click="closeModal" class="purple">Return</button>
        <button @click="closeInvoice" class="red">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '@/store/useMainStore';
import { computed } from 'vue';

const store = useMainStore()

const editInvoice = computed(() => store.editInvoice)

const closeModal = () => {
  store.TOGGLE_MODAL()
}

const closeInvoice = () => {
  store.TOGGLE_MODAL()
  store.TOGGLE_INVOICE()
  if(editInvoice.value) {
    store.TOGGLE_EDIT_INVOICE()
  }
}
</script>

<style lang="scss" scoped>
.modal {
  z-index: 100;
  position: fixed;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  .modal-content {
    border-radius: 20px;
    padding: 48px 32px;
    max-width: 450px;
    background-color: #252945;
    color: #fff;

    p {
      text-align: center;
    }

    .actions {
      margin-top: 24px;
      button {
        flex: 1;
      }
    }
  }
}
</style>
