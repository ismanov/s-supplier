import * as auth from "./entities/auth";
import * as user from "./entities/user";
import * as dashboard from "./entities/dashboard";
import * as catalog from "./entities/catalog";
import * as clients from "./entities/clients";
import * as orders from "./entities/orders"
import * as reports from "./entities/reports";
import * as warehouse from "./entities/warehouse";
import * as aggregations from "./entities/aggregations";
import * as invoices from "./entities/invoices";

export const api = {
  auth,
  user,
  orders,
  catalog,
  clients,
  reports,
  invoices,
  dashboard,
  warehouse,
  aggregations,
};