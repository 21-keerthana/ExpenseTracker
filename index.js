
import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import TransactionsView from "../views/TransactionsView.vue";
import ReportsView from "../views/ReportsView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: DashboardView },
    { path: "/transactions", component: TransactionsView },
    { path: "/reports", component: ReportsView },
  ],
});

export default router;
