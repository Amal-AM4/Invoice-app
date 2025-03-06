<template>
  <div class="home container">
    <!-- header -->
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Invoices</h1>
        <span>There are {{ invoiceData.length }} total invoices</span>
      </div>

      <div class="right flex ">
        <div @click="toggleFilterMenu" class="filter flex">
          <span>Filter by status</span>
          <img src="../assets/icon-arrow-down.svg" alt="">
          <ul v-show="filterMenu" class="filter-menu">
            <li>Draft</li>
            <li>Pending</li>
            <li>Paid</li>
            <li>Clear Filter</li>
          </ul>
        </div>

        <div @click="newInvoice" class="button flex">
          <div class="inner-button flex">
            <img src="../assets/icon-plus.svg" alt="">
          </div>
          <span>New Invoice</span>
        </div>
      </div>

    </div>
    <!-- invoices -->
    <div v-if="invoiceData.length > 0">
      <InvoiceComponent v-for="(invoice, index) in invoiceData" :key="index" :invoice="invoice" />
    </div>
    <div v-else class="empty flex flex-column">
      <img src="../assets/illustration-empty.svg" alt="no records">
      <h3>There is nothing here</h3>
      <p>Create a new invoice by clicking the New Invoice button and get started</p>
    </div>
  </div>
</template>

<script setup>
import InvoiceComponent from '@/components/InvoiceComponent.vue';
import { useMainStore } from '@/store/useMainStore';
import { computed, ref } from 'vue';

const store = useMainStore()
const invoiceData = computed(() => store.invoiceData)

const filterMenu = ref(false)

const newInvoice = () => {
  store.TOGGLE_INVOICE() // call the action to toggle invoiceModal
}

const toggleFilterMenu = () => {
  filterMenu.value = !filterMenu.value
}

</script>

<style lang="scss">
.home {
  color: #fff;

  .header {
    margin-bottom: 65px;

    .left,
    .right {
      flex: 1;
    }

    .right {
      justify-content: flex-end;
      align-items: center;

      .button,
      .filter {
        align-items: center;

        span {
          font-size: 12px;
        }
      }

      .filter {
        cursor: pointer;
        position: relative;
        margin-right: 40px;

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style-type: none;
          background-color: #1e211e;
          box-shadow: var(--box-shadow);

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
              color: #1e2139;
              background-color: #fff;
            }
          }
        }
      }

      .button {
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .empty {
    margin-top: 160px;
    align-items: center;

    img {
      width: 240px;
      height: 200px;
    }

    h3 {
      font-size: 20px;
      margin-top: 40px;
    }

    p {
      text-align: center;
      max-width: 240px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>
