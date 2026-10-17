import {
  Bookmark,
  Boxes,
  ChartColumn,
  CornerUpLeft,
  CornerUpRight,
  DollarSign,
  FileText,
  Languages,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  List,
  Receipt,
  Repeat,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Truck,
  User,
  Users,
  Wallet,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export type NavLink = {
  label: string;
  href: string;
  icon?: LucideIcon;
  /** Topbar breadcrumb text, when it differs from the nav label. */
  title?: string;
};

export type NavGroup = {
  label: string;
  icon: LucideIcon;
  children: NavLink[];
};

export type NavEntry = NavLink | NavGroup;

export const NAV: NavEntry[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Products",
    icon: Boxes,
    children: [
      { label: "Products", href: "/products", icon: Boxes },
      { label: "Product Categories", href: "/products/categories", icon: Layers },
      { label: "Brands", href: "/products/brands", icon: Bookmark },
      { label: "Units", href: "/products/units" },
      { label: "Base Units", href: "/products/base-units" },
      { label: "Print Barcode", href: "/products/print-barcode" },
    ],
  },
  { label: "Adjustments", href: "/adjustments", icon: SlidersHorizontal },
  { label: "Quotations", href: "/quotations", icon: FileText },
  {
    label: "Purchases",
    icon: Receipt,
    children: [
      { label: "Purchases", href: "/purchases", icon: Receipt },
      { label: "Purchases Returns", href: "/purchases/returns", icon: CornerUpLeft },
    ],
  },
  {
    label: "Sales",
    icon: ShoppingCart,
    children: [
      { label: "Sales", href: "/sales", icon: ShoppingCart },
      { label: "Sales Returns", href: "/sales/returns", icon: CornerUpRight },
    ],
  },
  { label: "Transfers", href: "/transfers", icon: Repeat },
  {
    label: "Expenses",
    icon: Wallet,
    children: [
      { label: "Expenses", href: "/expenses", icon: Wallet },
      { label: "Expense Categories", href: "/expenses/categories", icon: List },
    ],
  },
  {
    label: "Peoples",
    icon: Users,
    children: [
      { label: "Suppliers", href: "/suppliers", icon: Truck },
      { label: "Customers", href: "/customers", icon: Users },
      { label: "Users", href: "/users", icon: User },
    ],
  },
  { label: "Roles/Permissions", href: "/roles", icon: ShieldCheck, title: "Roles" },
  { label: "Warehouse", href: "/warehouses", icon: Warehouse },
  { label: "Reports", href: "/reports", icon: ChartColumn },
  { label: "Currencies", href: "/currencies", icon: DollarSign },
  { label: "Languages", href: "/languages", icon: Languages },
  {
    label: "Templates",
    icon: LayoutTemplate,
    children: [
      { label: "SMS Templates", href: "/templates/sms" },
      { label: "Email Templates", href: "/templates/email" },
    ],
  },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function isGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

const LINKS = NAV.flatMap((entry) => (isGroup(entry) ? entry.children : [entry]));

/**
 * The nav link that owns `pathname`: the longest href that equals it or is a
 * parent segment of it, so `/products/categories/create` resolves to
 * "Product Categories" rather than "Products".
 */
export function findActiveLink(pathname: string | null): NavLink | undefined {
  if (!pathname) return undefined;
  let best: NavLink | undefined;
  for (const link of LINKS) {
    const matches = pathname === link.href || pathname.startsWith(`${link.href}/`);
    if (matches && (!best || link.href.length > best.href.length)) best = link;
  }
  return best;
}
