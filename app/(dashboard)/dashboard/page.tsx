import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CircleMinus,
  DollarSign,
  Menu,
  ShoppingBag,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { CustomersChart, TopProductsChart, WeekChart } from "@/components/dashboard/DashboardCharts";
import "./dashboard.css";

export const metadata = { title: "Dashboard" };

// Sample data from the design; replace with real queries.
const kpis: { tone: string; icon: LucideIcon; value: string; label: string }[] = [
  { tone: "gold", icon: ShoppingCart, value: "$ 0.00", label: "Sales" },
  { tone: "emerald", icon: ShoppingBag, value: "$ 0.00", label: "Purchases" },
  { tone: "blue", icon: ArrowRight, value: "$ 0.00", label: "Sales Returns" },
  { tone: "orange", icon: ArrowLeft, value: "$ 0.00", label: "Purchases Returns" },
  { tone: "violet", icon: DollarSign, value: "$ 0.00", label: "Today Total Sales" },
  { tone: "rose", icon: Banknote, value: "$ 0.00", label: "Today Total Received (Sales)" },
  { tone: "cyan", icon: ShoppingCart, value: "$ 0.00", label: "Today Total Purchases" },
  { tone: "red", icon: CircleMinus, value: "$ 0.00", label: "Today Total Expense" },
];

const recentSales = [
  { ref: "SA_11149", customer: "direct-customer", total: "71,800.00", paid: "71,800.00", due: "0.00" },
  { ref: "SA_11148", customer: "direct-customer", total: "31,920.00", paid: "31,920.00", due: "0.00" },
  { ref: "SA_11147", customer: "direct-customer", total: "7,980.00", paid: "7,980.00", due: "0.00" },
  { ref: "SA_11146", customer: "direct-customer", total: "11,970.00", paid: "11,970.00", due: "0.00" },
  { ref: "SA_11145", customer: "direct-customer", total: "7,980.00", paid: "7,980.00", due: "0.00" },
];

const stockAlerts = [
  { code: "002", product: "ipl laser hair removal", warehouse: "Office", qty: "0", alertQty: "3" },
  { code: "001", product: "FACE FAT AND DOUBLE CHIN", warehouse: "Office", qty: "2", alertQty: "3" },
];

export default function DashboardPage() {
  return (
    <div className="dash-section-gap">
      {/* KPI tiles */}
      <div className="gg-kpi-grid">
        {kpis.map(({ tone, icon: Icon, value, label }) => (
          <div key={label} className={`gg-kpi gg-kpi--${tone}`}>
            <div className="gg-kpi-ico">
              <Icon />
            </div>
            <div className="gg-kpi-body">
              <span className="gg-kpi-value gg-num">{value}</span>
              <span className="gg-kpi-label">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + secondary tables */}
      <div className="dash-2col">
        <div className="dash-col">
          <div className="gg-card">
            <div className="gg-card-head">
              <span className="gg-card-title">This Week Sales &amp; Purchases</span>
              <button type="button" className="gg-icon-btn" style={{ width: 34, height: 34 }}>
                <Menu style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <div className="gg-card-pad">
              <div className="chart-box" style={{ height: 300 }}>
                <WeekChart />
              </div>
            </div>
          </div>

          <div className="gg-card">
            <div className="gg-card-head">
              <span className="gg-card-title">Top Selling Products (May)</span>
            </div>
            <div className="gg-card-pad" style={{ paddingTop: 0 }}>
              <table className="gg-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th style={{ textAlign: "right" }}>Grand Total</th>
                  </tr>
                </thead>
                <tbody className="empty-table-body"></tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="dash-col">
          <div className="gg-card">
            <div className="gg-card-head">
              <span className="gg-card-title">Top Selling Products (2026)</span>
            </div>
            <div className="gg-card-pad">
              <div className="chart-box" style={{ height: 340 }}>
                <TopProductsChart />
              </div>
            </div>
          </div>

          <div className="gg-card">
            <div className="gg-card-head">
              <span className="gg-card-title">Top 5 Customers (May)</span>
            </div>
            <div className="gg-card-pad">
              <div className="chart-box" style={{ height: 300 }}>
                <CustomersChart />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent sales */}
      <div className="gg-card">
        <div className="gg-card-head">
          <span className="gg-card-title">Recent Sales</span>
        </div>
        <div className="gg-card-pad" style={{ paddingTop: 0 }}>
          <div className="gg-table-wrap">
            <table className="gg-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Grand Total</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((s) => (
                  <tr key={s.ref}>
                    <td>
                      <span className="gg-chip-code">{s.ref}</span>
                    </td>
                    <td>{s.customer}</td>
                    <td>
                      <span className="gg-badge gg-badge--success">Received</span>
                    </td>
                    <td className="gg-num gg-td-strong">$ {s.total}</td>
                    <td className="gg-num">$ {s.paid}</td>
                    <td className="gg-num">$ {s.due}</td>
                    <td>
                      <span className="gg-badge gg-badge--success">Paid</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stock alert */}
      <div className="gg-card">
        <div className="gg-card-head">
          <span className="gg-card-title">Stock Alert</span>
        </div>
        <div className="gg-card-pad" style={{ paddingTop: 0 }}>
          <div className="gg-table-wrap">
            <table className="gg-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Product</th>
                  <th>Warehouse</th>
                  <th>Quantity</th>
                  <th style={{ textAlign: "right" }}>Alert Quantity</th>
                </tr>
              </thead>
              <tbody>
                {stockAlerts.map((s) => (
                  <tr key={s.code}>
                    <td className="gg-num">{s.code}</td>
                    <td className="gg-td-strong">{s.product}</td>
                    <td>{s.warehouse}</td>
                    <td>
                      <span className="qty-pill gg-num">{s.qty}</span> <span className="gg-chip-unit">piece</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="alert-pill gg-num">{s.alertQty}</span> <span className="gg-chip-unit">piece</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
