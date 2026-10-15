
<script setup>
import { useTransactionStore } from "../stores/transactions";

const store = useTransactionStore();

function formatMoney(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}
</script>

<template>
  <section class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <h2 class="mb-4 text-lg font-bold">Recent transactions</h2>

    <div v-if="store.transactions.length === 0" class="py-8 text-center text-sm text-gray-500">
      No transactions yet. Add your first one!
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div
        v-for="item in store.transactions"
        :key="item.id"
        class="flex items-center justify-between gap-3 py-4"
      >
        <div class="min-w-0">
          <p class="truncate font-semibold">{{ item.title }}</p>
          <p class="text-sm text-gray-500">
            {{ item.category }} · {{ item.date }}
          </p>
        </div>

        <div class="flex shrink-0 items-center gap-3">
          <span
            :class="item.type === 'income' ? 'text-green-600' : 'text-red-500'"
            class="font-semibold"
          >
            {{ item.type === "income" ? "+" : "−" }}{{ formatMoney(item.amount) }}
          </span>

          <button
            @click="store.deleteTransaction(item.id)"
            type="button"
            :aria-label="`Delete ${item.title}`"
            class="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
