<template>
  <div @click="checkClick" ref="invoiceWrap" class="invoice-wrap flex flex-column">
    <form @submit.prevent="submitForm" class="invoice-content">
      <h1>New Invoice</h1>

      <!-- bill from -->
      <div class="bill-from flex flex-column">
        <h4>Bill From</h4>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Street Address</label>
          <input type="text" required id="billerStreetAddress" v-model="billerStreetAddress">
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
          <label for="billerCity">City</label>
          <input type="text" required id="billerCity" v-model="billerCity">
        </div>
        <div class="input flex flex-column">
          <label for="billerZipCode">Zip Code</label>
          <input type="text" required id="billerZipCode" v-model="billerZipCode">
        </div>
        <div class="input flex flex-column">
          <label for="billerCountry">Country</label>
          <input type="text" required id="billerCountry" v-model="billerCountry">
        </div>
        </div>
      </div>

      <!-- bill to -->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <div class="input flex flex-column">
          <label for="clientName">Client's Name</label>
          <input type="text" required id="clientName" v-model="clientName">
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">Client's Email</label>
          <input type="email" required id="clientEmail" v-model="clientEmail">
        </div>
        <div class="input flex flex-column">
          <label for="clientStreetAddress">Street Address</label>
          <input type="text" required id="clientStreetAddress" v-model="clientStreetAddress">
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
          <label for="clientCity">City</label>
          <input type="text" required id="clientCity" v-model="clientCity">
        </div>
        <div class="input flex flex-column">
          <label for="clientZipCode">Zip Code</label>
          <input type="text" required id="clientZipCode" v-model="clientZipCode">
        </div>
        <div class="input flex flex-column">
          <label for="clientCountry">Country</label>
          <input type="text" required id="clientCountry" v-model="clientCountry">
        </div>
        </div>
      </div>

      <!-- invoice work details -->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
          <label for="invoiceDate">Invoice Date</label>
          <input disabled type="text" required id="invoiceDate" v-model="invoiceDate">
        </div>
        <div class="input flex flex-column">
          <label for="paymentDueDate">Payment Due</label>
          <input disabled type="text" required id="paymentDueDate" v-model="paymentDueDate">
        </div>
        </div>
        <div class="input flex flex-column">
          <label for="paymentTerms">Payment Terms</label>
          <select required id="paymentTerms" v-model="paymentTerms">
            <option value="15">Next 15 Days</option>
            <option value="30">Next 30 Days</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input type="text" required id="productDescription" v-model="productDescription">
        </div>

        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <thead>
              <tr class="table-heading flex">
                <th class="item-name">Item Name</th>
                <th class="qty">Qty</th>
                <th class="price">Price</th>
                <th class="Total">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr class="table-items flex" v-for="(item, index) in invoiceItemList" :key="index">
                <td class="item-name"><input type="text" v-model="item.itemName"></td>
                <td class="qty"><input type="text" v-model="item.qty"></td>
                <td class="price"><input type="text" v-model="item.price"></td>
                <td class="Total flex">₹{{ item.total = item.qty * item.price }}</td>
                <td>
                  <img @click="deleteInvoiceItem(item.id)" src="../assets/icon-delete.svg" alt="">
                </td>
            </tr>
            </tbody>
          </table>
          <div @click="addNewInvoiceItem" class="flex button">
            <img src="../assets/icon-plus.svg" alt="">
            Add New Item
          </div>
        </div>
      </div>

      <!-- save/exit -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">Cancel</button>
        </div>
        <div class="right flex">
          <button type="submit" @click="saveDraft" class="dark-purple">Save Draft</button>
          <button type="submit" @click="publishInvoice" class="purple">Create Invoice</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { db, collection, doc, setDoc } from '@/firebase/firebaseInit';
import { useMainStore } from '@/store/useMainStore';
import { uid } from 'uid';
import { onMounted, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';

const store = useMainStore()
const toast = useToast()

const dateOptions = ref({ year: "numeric", month: "short", day: "numeric" });
const docId = ref(null);
// const loading = ref(null);
const billerStreetAddress = ref(null);
const billerCity = ref(null);
const billerZipCode = ref(null);
const billerCountry = ref(null);
const clientName = ref(null);
const clientEmail = ref(null);
const clientStreetAddress = ref(null);
const clientCity = ref(null);
const clientZipCode = ref(null);
const clientCountry = ref(null);
const invoiceDateUnix = ref(null);
const invoiceDate = ref(null);
const paymentTerms = ref(null);
const paymentDueDateUnix = ref(null);
const paymentDueDate = ref(null);
const productDescription = ref(null);
const invoicePending = ref(null);
const invoiceDraft = ref(null);
const invoiceItemList = ref([]);
const invoiceTotal = ref(0);

const invoiceWrap = ref()

const checkClick = (e) => {
  if (e.target === invoiceWrap.value) {
    store.TOGGLE_MODAL()
  }
}

const closeInvoice = () => {
  store.TOGGLE_INVOICE()
}

const addNewInvoiceItem = () => {
  invoiceItemList.value.push({
    id: uid(),
    itemName: "",
    qty: 1,
    price: 0,
    total: 0,
  })
}

const deleteInvoiceItem = (id) => {
  invoiceItemList.value = invoiceItemList.value.filter(item => item
    .id !== id
  )
}

const calInvoiceItem = () => {
  invoiceTotal.value = 0
  invoiceItemList.value.forEach(item => {
    invoiceTotal.value += item.total
  })
}

const publishInvoice = () => {
  invoicePending.value = true
}

const saveDraft = () => {
  invoiceDraft.value = true
}

const uploadInvoice = async () => {
  if (invoiceItemList.value.length <= 0) {
    alert('Please ensure you filled out work items')
    return
  }

  calInvoiceItem()

  // ✅ Create a reference to Firestore collection and document
  const invoiceRef = doc(collection(db, "invoices"));

  // ✅ Use `setDoc` instead of `set`
  await setDoc(invoiceRef, {
    invoiceId: uid(6),
    billerStreetAddress: billerStreetAddress.value,
    billerCity: billerCity.value,
    billerZipCode: billerZipCode.value,
    billerCountry: billerCountry.value,
    clientName: clientName.value,
    clientEmail: clientEmail.value,
    clientStreetAddress: clientStreetAddress.value,
    clientCity: clientCity.value,
    clientZipCode: clientZipCode.value,
    clientCountry: clientCountry.value,
    invoiceDate: invoiceDate.value,
    invoiceDateUnix: invoiceDateUnix.value,
    paymentTerms: paymentTerms.value,
    paymentDueDate: paymentDueDate.value,
    paymentDueDateUnix: paymentDueDateUnix.value,
    productDescription: productDescription.value,
    invoiceItemList: invoiceItemList.value,
    invoiceTotal: invoiceTotal.value,
    invoicePending: invoicePending.value,
    invoiceDraft: invoiceDraft.value,
    invoicePaid: false,
  });

  toast.success("Invoices is added.")

  store.TOGGLE_INVOICE()
}

const submitForm = () => {
  uploadInvoice()
}

const payTerms = () => {
  if (!paymentTerms.value) return;
  const futureDate = new Date();
  paymentDueDateUnix.value = futureDate.setDate(futureDate.getDate() + parseInt(paymentTerms.value));
  paymentDueDate.value = new Date(paymentDueDateUnix.value).toLocaleDateString('en-us', dateOptions.value);
};

// ✅ Correct `watch` usage
watch(paymentTerms, payTerms);

// get current date
const getCurrentDate = () => {
  invoiceDateUnix.value = Date.now()
  invoiceDate.value = new Date(invoiceDateUnix.value).toLocaleDateString('en-us', dateOptions.value)
}
onMounted(() => {
  getCurrentDate()
})

</script>

<style lang="scss" scoped>
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 768px) {
    left: 90px;
  }

  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: #fff;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }

    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }

    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    // Invoice Work

    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }

      .work-items {
        .item-list {
          width: 100%;

          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;

            .item-name {
              flex-basis: 50%;
            }

            .qty {
              flex-basis: 10%;
            }

            .price {
              flex-basis: 20%;
            }

            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }

        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;

          img {
            margin-right: 4px;
          }
        }
      }
    }

    .save {
      margin-top: 60px;

      div {
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }
    }
  }

  .input {
    margin-bottom: 24px;
  }

  label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}
</style>
