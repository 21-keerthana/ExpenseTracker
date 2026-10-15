
<script setup>
import { computed, ref } from "vue";
import { useTransactionStore } from "../stores/transactions";

const store = useTransactionStore();

const title = ref("");
const amount = ref("");
const type = ref("expense");
const category = ref("Food");
const date = ref(new Date().toISOString().slice(0, 10));
const error = ref("");

const recentTransactions = computed(() =>
  [...store.transactions].slice(0, 5)
);

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

function addTransaction() {
  const parsedAmount = Number(amount.value);

  if (!title.value.trim()) {
    error.value = "Please enter a description.";
    return;
  }

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    error.value = "Enter an amount greater than zero.";
    return;
  }

  store.addTransaction({
    title: title.value.trim(),
    amount: parsedAmount,
    type: type.value,
    category: category.value,
    date: date.value,
  });

  title.value = "";
  amount.value = "";
  type.value = "expense";
  category.value = "Food";
  date.value = new Date().toISOString().slice(0, 10);
  error.value = "";
}

function removeTransaction(id) {
  store.deleteTransaction(id);
}
</script>

<template>
  <section class="welcome-row">
    <div>
      <p class="eyebrow">YOUR FINANCIAL OVERVIEW</p>
      <h1>Dashboard</h1>
      <p class="muted">Keep track of your money, one transaction at a time.</p>
    </div>
    <div class="date-pill">📅 {{ new Date().toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    }) }}</div>
  </section>

  <section class="summary-grid">
    <article class="summary-card balance-card">
      <div class="summary-top">
        <span>Current balance</span>
        <span class="summary-icon">₹</span>
      </div>
      <h2>{{ money(store.balance) }}</h2>
      <p>Your overall money position</p>
      <div class="balance-decoration">₹</div>
    </article>

    <article class="summary-card">
      <div class="summary-top">
        <span>Total income</span>
        <span class="summary-icon income-icon">↙</span>
      </div>
      <h2>{{ money(store.totalIncome) }}</h2>
      <p class="positive">↗ Money coming in</p>
    </article>

    <article class="summary-card">
      <div class="summary-top">
        <span>Total expenses</span>
        <span class="summary-icon expense-icon">↗</span>
      </div>
      <h2>{{ money(store.totalExpenses) }}</h2>
      <p class="negative">↗ Money going out</p>
    </article>
  </section>

  <section class="dashboard-grid">
    <article class="panel transaction-panel">
      <div class="panel-heading">
        <div>
          <h2>Add transaction</h2>
          <p class="muted">Record income or an expense.</p>
        </div>
        <span class="panel-heading-icon">＋</span>
      </div>

      <form class="transaction-form" @submit.prevent="addTransaction">
        <label>
          Description
          <input v-model="title" placeholder="e.g. Groceries" maxlength="80" />
        </label>

        <label>
          Amount (₹)
          <input
            v-model="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
          />
        </label>

        <div class="form-row">
          <label>
            Type
            <select v-model="type">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label>
            Category
            <select v-model="category">
              <option>Food</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Health</option>
              <option>Education</option>
              <option>Entertainment</option>
              <option>Salary</option>
              <option>Other</option>
            </select>
          </label>
        </div>

        <label>
          Date
          <input v-model="date" type="date" />
        </label>

        <p v-if="error" class="form-error">{{ error }}</p>

        <button class="primary-button" type="submit">
          + Add transaction
        </button>
      </form>
    </article>

    <article class="panel recent-panel">
      <div class="panel-heading">
        <div>
          <h2>Recent transactions</h2>
          <p class="muted">Your latest money activity.</p>
        </div>
        <RouterLink to="/transactions" class="text-link">
          View all →
        </RouterLink>
      </div>

      <div v-if="recentTransactions.length" class="transaction-list">
        <div
          v-for="item in recentTransactions"
          :key="item.id"
          class="transaction-item"
        >
          <div class="transaction-symbol" :class="item.type">
            {{ item.type === "income" ? "↓" : "↑" }}
          </div>

          <div class="transaction-info">
            <strong>{{ item.title }}</strong>
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
        <div class="empty-icon">₹</div>
        <h3>No transactions yet</h3>
        <p>Add your first transaction using the form to see it here.</p>
      </div>
    </article>
  </section>
</template>
