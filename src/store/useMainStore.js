import { db } from '@/firebase/firebaseInit';
import { collection, getDocs } from 'firebase/firestore';
import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    invoiceModal: false,
    modalActive: false,
    invoiceData: [],
    invoicesLoaded: false,
    currentInvoiceArray: null,
    editInvoice: false,
  }),
  actions: {
    TOGGLE_INVOICE() {
      this.invoiceModal = !this.invoiceModal;
    },
    TOGGLE_MODAL() {
      this.modalActive = !this.modalActive;
    },
    SET_INVOICE_DATA(payload) {
      this.invoiceData.push(payload);
      // console.log(this.invoiceData)
    },
    INVOICES_LOADED() {
      this.invoicesLoaded = true;
    },
    SET_CURRENT_INVOICE(payload) {
      this.currentInvoiceArray = this.invoiceData.filter(invoice => {
        return invoice.invoiceId === payload
      })
    },
    TOGGLE_EDIT_INVOICE() {
      this.editInvoice = !this.editInvoice
    },
    DELETE_INVOICE(payload) {
      this.invoiceData = this.invoiceData.filter(invoice => invoice.docId !== payload)
    },
    async GET_INVOICES() {
      try {
        const getData = collection(db, 'invoices'); // ✅ Correct Firestore reference
        const results = await getDocs(getData);

        results.forEach(doc => {
          if (!this.invoiceData.some(invoice => invoice.docId === doc.id)) {
            const data = {
              docId: doc.id,
              ...doc.data() // ✅ Spreads the document data instead of writing each field manually
            };

            this.SET_INVOICE_DATA(data); // ✅ Correct method call
          }
        });

        this.INVOICES_LOADED(); // ✅ Correct method call
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    },
    async UPDATE_INVOICE(docId, routeId) {
      this.DELETE_INVOICE(docId);
      await this.GET_INVOICES();
      this.TOGGLE_INVOICE();
      this.TOGGLE_EDIT_INVOICE();
      this.SET_CURRENT_INVOICE(routeId)
    }
  }
});
