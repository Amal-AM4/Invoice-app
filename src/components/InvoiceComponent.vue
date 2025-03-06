<template>
  <RouterLink v-if="invoice" class="invoice flex" :to="{ name: 'Invoice', params: { invoiceId: invoice.invoiceId } }">
    <div class="left flex">
      <span class="tracking-number">#{{ invoice.invoiceId }}</span>
      <span class="due-date">{{ invoice.paymentDueDate }}</span>
      <span class="person">{{ invoice.clientName }}</span>
    </div>
    <div class="right flex">
      <span class="price">
        ₹{{ new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoice?.invoiceTotal || 0) }}
      </span>
      <div
        class="status-button flex"
        :class="{ paid: invoice.invoicePaid, draft: invoice.invoiceDraft, pending: invoice.invoicePending }"
      >
        <span v-if="invoice.invoicePaid">Paid</span>
        <span v-else-if="invoice.invoiceDraft">Draft</span>
        <span v-else>Pending</span>
      </div>
      <div class="icon">
        <img :src="arrowIcon" alt="Arrow Icon" />
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue';

// ✅ Props Validation
defineProps({
  invoice: {
    type: Object,
    required: true
  }
});

// ✅ Ensure Image Path Works
const arrowIcon = computed(() => new URL('@/assets/icon-arrow-right.svg', import.meta.url).href);
</script>

<style lang="scss" scoped>
.invoice {
  text-decoration: none;
  cursor: pointer;
  gap: 16px;
  margin-bottom: 16px;
  color: #fff;
  border-radius: 20px;
  padding: 28px 32px;
  background-color: #1e2139;
  align-items: center;

  span {
    font-size: 13px;
  }

  .left {
    align-items: center;
    flex-basis: 60%;
    gap: 16px;

    span {
      flex: 1;
    }

    .tracking-number {
      text-transform: uppercase;
    }
  }

  .right {
    gap: 16px;
    flex-basis: 40%;
    align-items: center;

    .price {
      flex: 1;
      font-size: 16px;
      font-weight: 600px;
    }
  }
}
</style>
