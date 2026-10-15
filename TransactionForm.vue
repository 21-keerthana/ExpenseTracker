
<script setup>
import { reactive } from "vue";
import { useTransactionStore } from "../stores/transactions";

const store = useTransactionStore();

const form = reactive({
  title: "",
  amount: "",
  type: "expense",
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
});

const categories = {
  income: ["Salary", "Freelance", "Investment", "Other"],
  expense: ["Food", "Transport", "Shopping", "Bills", "Health", "Other"],
};

function submitForm() {
  const amount = Number(form.amount);

  if (!form.title.trim() || !Number.isFinite(amount) || amount <= 0) {
    alert("Enter a description and an amount greater than zero.");
    return;
  }

  store.addTransaction({
    title: form.title.trim(),
    amount,
    type: form.type,
    category: form.category,
    date: form.date,
  });

  form.title = "";
  form.amount = "";
  form.type = "expense";
  form.category = "Food";
  form.date = new Date().toISOString().slice(0, 10);
}
</script>

<template>
  <form
    @submit.prevent="submitForm"
    class="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
  >
    <h2 class="text-lg font-bold">Add transaction</h2>

    <div class="grid gap-4 sm:grid-cols-2">
      <label class="text-sm font-medium">
        Description
        <input
          v-model="form.title"
          required
          placeholder="e.g. Groceries"
          class="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </label>

      <label class="text-sm font-medium">
        Amount (₹)
        <input
          v-model="form.amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          placeholder="0.00"
          class="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </label>

      <label class="text-sm font-medium">
        Type
        <select
          v-model="form.type"
          @change="form.category = categories[form.type][0]"
          class="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>

      <label class="text-sm font-medium">
        Category
        <select
          v-model="form.category"
          class="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option
            v-for="category in categories[form.type]"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </label>

      <label class="text-sm font-medium sm:col-span-2">
        Date
        <input
          v-model="form.date"
          type="date"
          required
          class="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </label>
    </div>

    <button
      type="submit"
      class="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white hover:opacity-90"
    >
      + Add transaction
    </button>
  </form>
</template>