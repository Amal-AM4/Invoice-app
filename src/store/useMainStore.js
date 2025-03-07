import { db } from '@/firebase/firebaseInit';
import { collection, doc, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
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
    REMOVE_INVOICE_FROM_STATE(payload) {
      this.invoiceData = this.invoiceData.filter(invoice => invoice.docId !== payload)
    },
    UPDATE_STATUS_TO_PAID(payload) {
      this.invoiceData.forEach(invoice => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = true
          invoice.invoicePending = false
        }
      })
    },
    UPDATE_STATUS_TO_PENDING(payload) {
      this.invoiceData.forEach(invoice => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = false
          invoice.invoicePending = true
          invoice.invoiceDraft = false
        }
      })
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
    async UPDATE_INVOICE(docId, updatedData) {
      if (!docId || typeof docId !== 'string') {
        console.error("Invalid docId in UPDATE_INVOICE:", docId);
        return;
      }

      try {
        const invoiceRef = doc(db, "invoices", docId);
        await updateDoc(invoiceRef, updatedData);

        // ✅ Update local state instead of deleting and refetching
        this.invoiceData = this.invoiceData.map(invoice =>
          invoice.docId === docId ? { ...invoice, ...updatedData } : invoice
        );

        console.log("Invoice updated successfully.");
      } catch (error) {
        console.error("Error updating invoice:", error);
        console.log("Failed to update invoice.");
      }
    },
    async DELETE_INVOICE(docId) {
      try {
        const invoiceRef = doc(db, "invoices", docId);
        await deleteDoc(invoiceRef); // ✅ Correct Firestore deletion method
        this.REMOVE_INVOICE_FROM_STATE(docId); // ✅ Remove from local state
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    },
    async UPDATE_STATUS_TO_PAIDED(docId) {
      try {
        const invoiceRef = doc(db, "invoices", docId);
        await updateDoc(invoiceRef, {
          invoicePaid: true,
          invoicePending: false,
        });
        this.UPDATE_STATUS_TO_PAID(docId); // ✅ Properly update local state
      } catch (error) {
        console.error("Error updating invoice status:", error);
      }
    },
    async UPDATE_STATUS_TO_PENDING_WORK(docId) {
      try {
        const invoiceRef = doc(db, "invoices", docId);
        await updateDoc(invoiceRef, {
          invoicePaid: false,
          invoicePending: true,
          invoiceDraft: false
        });
        this.UPDATE_STATUS_TO_PENDING(docId); // ✅ Properly update local state
      } catch (error) {
        console.error("Error updating invoice status:", error);
      }
    },
  }
});
