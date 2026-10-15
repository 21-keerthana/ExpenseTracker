
<script setup>
import { computed } from "vue";
import { useTransactionStore } from "../stores/transactions";

const store = useTransactionStore();

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

const expenses = computed(() =>
  store.transactions.filter((item) => item.type === "expense")
);

const income = computed(() =>
  store.transactions.filter((item) => item.type === "income")
);

const expenseByCategory = computed(() => {
  const totals = {};

  for (const item of expenses.value) {
    const category = item.category || "Other";
    totals[category] = (totals[category] || 0) + Number(item.amount || 0);
  }

  return Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
});

const highestExpense = computed(() =>
  expenses.value.reduce(
    (highest, item) => Math.max(highest, Number(item.amount) || 0),
    0
  )
);

const savingsRate = computed(() => {
  if (store.totalIncome <= 0) return 0;
  return Math.round((store.balance / store.totalIncome) * 100);
});

const categoryTotal = computed(() =>
  expenseByCategory.value.reduce((sum, item) => sum + item.amount, 0)
);

const categoryColors = [
  "#635bdb",
  "#2da989",
  "#ed9c52",
  "#e46d86",
  "#5396dd",
  "#9b76d6",
  "#d3b14d",
];

function barWidth(amount) {
  if (categoryTotal.value <= 0) return 0;
  return Math.min(100, (amount / categoryTotal.value) * 100);
}
</script>

<template>
  <section class="welcome-row">
    <div>
      <p class="eyebrow">INSIGHTS & ANALYTICS</p>
      <h1>Reports</h1>
      <p class="muted">Understand your spending habits and money flow.</p>
    </div>
    <div class="date-pill">All-time overview</div>
  </section>

  <section class="summary-grid report-summary">
    <article class="summary-card balance-card">
      <div class="summary-top">
        <span>Net balance</span>
        <span class="summary-icon">₹</span>
      </div>
      <h2>{{ money(store.balance) }}</h2>
      <p>Income minus expenses</p>
    </article>

    <article class="summary-card">
      <div class="summary-top">
        <span>Total income</span>
        <span class="summary-icon income-icon">↓</span>
      </div>
      <h2>{{ money(store.totalIncome) }}</h2>
      <p class="positive">{{ income.length }} income records</p>
    </article>

    <article class="summary-card">
      <div class="summary-top">
        <span>Total expenses</span>
        <span class="summary-icon expense-icon">↑</span>
      </div>
      <h2>{{ money(store.totalExpenses) }}</h2>
      <p class="negative">{{ expenses.length }} expense records</p>
    </article>
  </section>

  <section class="report-grid">
    <article class="panel">
      <div class="panel-heading">
        <div>
          <h2>Income vs expenses</h2>
          <p class="muted">Compare the money you receive and spend.</p>
        </div>
      </div>

      <div class="comparison-chart">
        <div class="chart-row">
          <div class="chart-label">
            <span>Income</span>
            <strong>{{ money(store.totalIncome) }}</strong>
          </div>
          <div class="chart-track">
            <div
              class="chart-fill income-fill"
              :style="{
                width: (store.totalIncome + store.totalExpenses) > 0
                  ? (store.totalIncome / (store.totalIncome + store.totalExpenses) * 100) + '%'
                  : '0%'
              }"
            ></div>
          </div>
        </div>

        <div class="chart-row">
          <div class="chart-label">
            <span>Expenses</span>
            <strong>{{ money(store.totalExpenses) }}</strong>
          </div>
          <div class="chart-track">
            <div
              class="chart-fill expense-fill"
              :style="{
                width: (store.totalIncome + store.totalExpenses) > 0
                  ? (store.totalExpenses / (store.totalIncome + store.totalExpenses) * 100) + '%'
                  : '0%'
              }"
            ></div>
          </div>
        </div>
      </div>

      <div class="report-note">
        <span>Net result</span>
        <strong :class="store.balance >= 0 ? 'positive' : 'negative'">
          {{ money(store.balance) }}
        </strong>
      </div>
    </article>

    <article class="panel savings-panel">
      <div class="panel-heading">
        <div>
          <h2>Savings overview</h2>
          <p class="muted">Your balance compared with income.</p>
        </div>
      </div>

      <div class="savings-circle" :class="{ 'no-income': store.totalIncome <= 0 }">
        <div>
          <strong>{{ store.totalIncome > 0 ? savingsRate + "%" : "—" }}</strong>
          <span>savings rate</span>
        </div>
      </div>

      <p class="savings-caption">
        {{ store.totalIncome <= 0
          ? "Add income transactions to calculate your savings rate."
          : store.balance >= 0
            ? "This is your net balance as a percentage of total income."
            : "Your expenses are higher than your recorded income." }}
      </p>

      <div class="mini-stat">
        <span>Largest single expense</span>
        <strong>{{ money(highestExpense) }}</strong>
      </div>
    </article>
  </section>

  <section class="panel category-panel">
    <div class="panel-heading">
      <div>
        <h2>Spending by category</h2>
        <p class="muted">See which categories account for your expenses.</p>
      </div>
      <span class="date-pill">{{ expenseByCategory.length }} categories</span>
    </div>

    <div v-if="expenseByCategory.length" class="category-list">
      <div
        v-for="(item, index) in expenseByCategory"
        :key="item.category"
        class="category-row"
      >
        <div
          class="category-dot"
          :style="{ background: categoryColors[index % categoryColors.length] }"
        ></div>

        <div class="category-details">
          <div class="category-heading">
            <strong>{{ item.category }}</strong>
            <span>{{ money(item.amount) }}</span>
          </div>
          <div class="category-track">
            <div
              class="category-fill"
              :style="{
                width: barWidth(item.amount) + '%',
                background: categoryColors[index % categoryColors.length]
              }"
            ></div>
          </div>
        </div>

        <span class="category-percent">
          {{ categoryTotal > 0 ? Math.round(item.amount / categoryTotal * 100) : 0 }}%
        </span>
      </div>

      <div class="category-total">
        <span>Total categorized spending</span>
        <strong>{{ money(categoryTotal) }}</strong>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">◔</div>
      <h3>No expense data yet</h3>
      <p>Add some expense transactions to see your spending breakdown here.</p>
    </div>
  </section>
</template>

<style scoped>
.report-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(250px, 0.8fr);
  gap: 22px;
  margin-bottom: 22px;
}

.comparison-chart { display: grid; gap: 25px; margin-top: 30px; }
.chart-label, .category-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.chart-label span { color: #73738b; font-size: 12px; }
.chart-label strong { font-size: 13px; }
.chart-track, .category-track {
  overflow: hidden;
  width: 100%;
  height: 9px;
  background: #f0f0f7;
  border-radius: 99px;
}
.chart-fill, .category-fill {
  height: 100%;
  border-radius: inherit;
  transition: width 0.35s ease;
}
.income-fill { background: #2da989; }
.expense-fill { background: #e46d86; }

.report-note, .mini-stat, .category-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 25px;
  padding-top: 18px;
  border-top: 1px solid #eeeef5;
  font-size: 12px;
}
.report-note span, .mini-stat span, .category-total span { color: #85859b; }
.positive { color: #15966a; }
.negative { color: #d95c70; }

.savings-panel { text-align: center; }
.savings-panel .panel-heading { text-align: left; }

.savings-circle {
  display: grid;
  width: 156px;
  height: 156px;
  margin: 18px auto;
  place-items: center;
  border-radius: 50%;
  background: conic-gradient(#635bdb 0% 0%, #efeff8 0% 100%);
  position: relative;
}
.savings-circle::before {
  position: absolute;
  content: "";
  inset: 10px;
  background: #fff;
  border-radius: 50%;
}
.savings-circle > div { position: relative; display: grid; gap: 5px; }
.savings-circle strong { font: 800 28px 'Manrope', sans-serif; }
.savings-circle span { color: #89899f; font-size: 11px; }
.savings-circle.no-income { background: #efeff8; }

.savings-caption {
  max-width: 250px;
  min-height: 40px;
  margin: 0 auto;
  color: #89899f;
  font-size: 11px;
  line-height: 1.7;
}

.mini-stat { margin-top: 20px; text-align: left; }
.mini-stat strong { font-size: 13px; }

.category-panel { margin-bottom: 25px; }
.category-list { display: grid; gap: 22px; }
.category-row { display: flex; align-items: center; gap: 12px; }
.category-dot { width: 10px; height: 10px; flex: 0 0 10px; border-radius: 50%; }
.category-details { flex: 1; min-width: 0; }
.category-heading strong { font-size: 12px; }
.category-heading span { color: #5c5c75; font-size: 12px; font-weight: 700; white-space: nowrap; }
.category-track { height: 7px; }
.category-percent { width: 38px; color: #8d8da2; font-size: 11px; text-align: right; }
.category-total { margin-top: 26px; }

@media (max-width: 760px) {
  .report-grid { grid-template-columns: 1fr; }
}
</style>
