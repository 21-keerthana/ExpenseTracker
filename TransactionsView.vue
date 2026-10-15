
<script setup>
import { computed, ref } from "vue";
import { useTransactionStore } from "../stores/transactions";

const store = useTransactionStore();
const search = ref("");
const selectedType = ref("all");
const selectedCategory = ref("all");

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Education",
  "Entertainment",
  "Salary",
  "Other",
];

const filteredTransactions = computed(() =>
  store.transactions.filter((item) => {
    const matchesSearch = (item.title || item.description || "")
      .toLowerCase()
      .includes(search.value.toLowerCase());

    const matchesType =
      selectedType.value === "all" || item.type === selectedType.value;

    const matchesCategory =
      selectedCategory.value === "all" ||
      item.category === selectedCategory.value;

    return matchesSearch && matchesType && matchesCategory;
  })
);

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

function removeTransaction(id) {
  if (confirm("Delete this transaction?")) {
    store.deleteTransaction(id);
  }
}
</script>

<template>
  <section class="welcome-row">
    <div>
      <p class="eyebrow">YOUR MONEY ACTIVITY</p>
      <h1>Transactions</h1>
      <p class="muted">Manage, search, and review all your transactions.</p>
    </div>
    <div class="date-pill">{{ store.transactions.length }} total records</div>
  </section>

  <section class="summary-grid transaction-summary">
    <article class="summary-card balance-card">
      <div class="summary-top">
        <span>Current balance</span>
        <span class="summary-icon">₹</span>
      </div>
      <h2>{{ money(store.balance) }}</h2>
      <p>Your overall money position</p>
    </article>

    <article class="summary-card">
      <div class="summary-top">
        <span>Total income</span>
        <span class="summary-icon income-icon">↓</span>
      </div>
      <h2>{{ money(store.totalIncome) }}</h2>
      <p class="positive">Money received</p>
    </article>

    <article class="summary-card">
      <div class="summary-top">
        <span>Total expenses</span>
        <span class="summary-icon expense-icon">↑</span>
      </div>
      <h2>{{ money(store.totalExpenses) }}</h2>
      <p class="negative">Money spent</p>
    </article>
  </section>

  <section class="panel transactions-page-panel">
    <div class="panel-heading">
      <div>
        <h2>All transactions</h2>
        <p class="muted">Use the filters to find a transaction.</p>
      </div>
    </div>

    <div class="transaction-filters">
      <input
        v-model="search"
        type="search"
        placeholder="Search description..."
        aria-label="Search transactions"
      />

      <select v-model="selectedType" aria-label="Filter by type">
        <option value="all">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expenses</option>
      </select>

      <select v-model="selectedCategory" aria-label="Filter by category">
        <option value="all">All categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div v-if="filteredTransactions.length" class="transaction-list">
      <div
        v-for="item in filteredTransactions"
        :key="item.id"
        class="transaction-item"
      >
        <div class="transaction-symbol" :class="item.type">
          {{ item.type === "income" ? "↓" : "↑" }}
        </div>

        <div class="transaction-info">
          <strong>{{ item.title || item.description }}</strong>
          <span>{{ item.category }} · {{ item.date }}</span>
        </div>

        <div class="transaction-amount">
          <strong :class="item.type">
            {{ item.type === "income" ? "+" : "−" }}{{ money(item.amount) }}
          </strong>
          <button
            class="delete-button"
            type="button"
            @click="removeTransaction(item.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">⌕</div>
      <h3>No matching transactions</h3>
      <p>Try changing your search or filters, or add a transaction from the dashboard.</p>
    </div>

    <p class="results-count">
      Showing {{ filteredTransactions.length }} of {{ store.transactions.length }} transactions
    </p>
  </section>
</template>

<style scoped>
.transaction-filters {
  display: grid;
  grid-template-columns: minmax(180px, 1.5fr) repeat(2, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.transaction-filters input,
.transaction-filters select {
  width: 100%;
  min-width: 0;
  min-height: 43px;
  padding: 10px 12px;
  color: #34344d;
  background: #fbfbfe;
  border: 1px solid #e7e7f0;
  border-radius: 9px;
  outline: none;
  font: inherit;
  font-size: 12px;
}

.transaction-filters input:focus,
.transaction-filters select:focus {
  border-color: #8b83ed;
  box-shadow: 0 0 0 3px #635bdb18;
}

.results-count {
  margin: 18px 0 0;
  padding-top: 15px;
  color: #9292a7;
  border-top: 1px solid #f0f0f6;
  font-size: 11px;
}

@media (max-width: 650px) {
  .transaction-filters {
    grid-template-columns: 1fr;
  }
}
</style>
