import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    invoiceModal: false,
  }),
  actions: {
    TOGGLE_INVOICE() {
      this.invoiceModal = !this.invoiceModal;
    }
  },
});
