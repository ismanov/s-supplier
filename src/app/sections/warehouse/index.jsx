import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { StockList } from "./pages/stock-list";
import { StockAdd } from "./pages/stock-add";

import { WarehouseList } from "./pages/warehouse-list";
import { StockView } from "./pages/stock-view";
import { ShipmentView } from "./pages/shipment-view";
import { ShipmentList } from "./pages/shipment-list";
import { ShipmentAdd } from "./pages/shipment-add";
import { StockBalance } from "./pages/stock-balance";
import { Suppliers } from "./pages/suppliers";
import { Customers } from "./pages/customers";
import { OrdersList } from "../orders/pages/orders-list";
import { OrderAdd } from "../orders/pages/order-add";
import { OrderView } from "../orders/pages/order-view";

export const Warehouse = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route exact path={`${match.path}/stock`} component={StockList} />
      <Route exact path={`${match.path}/all`} component={WarehouseList} />
      <Route exact path={`${match.path}/suppliers`} component={Suppliers} />
      <Route exact path={`${match.path}/customers`} component={Customers} />
      <Route exact path={`${match.path}/all`} component={WarehouseList} />
      <Route path={`${match.path}/stock/add`} component={StockAdd} />
      <Route path={`${match.path}/stock/:id`} component={StockView} />
      <Route exact path={`${match.path}/shipment`} component={ShipmentList} />
      <Route path={`${match.path}/shipment/add`} component={ShipmentAdd} />
      <Route path={`${match.path}/shipment/:id`} component={ShipmentView} />
      <Route path={`${match.path}/stock-balance`} component={StockBalance} />
      <Route exact path={`${match.path}/orders`} component={OrdersList} />
      <Route path={`${match.path}/orders/add`} component={OrderAdd} />
      <Route path={`${match.path}/orders/view/:id`} component={OrderView} />
      <Redirect from={match.path} to={`${match.path}/stock`} />
    </Switch>
  );
};
