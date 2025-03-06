<template>
  <div style="color: aliceblue;">{{ currentInvoiceArray }}</div>
</template>

<script setup>
import { useMainStore } from '@/store/useMainStore';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const store = useMainStore()

const currentInvoice = ref(null)

const id = route.params.invoiceId // equivalent to this.$route.params.invoiceId
const currentInvoiceArray = computed(() => store.currentInvoiceArray)

const getCurrentInvoice = () => {
  store.SET_CURRENT_INVOICE(id)
}

onMounted(() => {
  getCurrentInvoice()
})
</script>

<style>

</style>
