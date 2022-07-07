import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';

import { OrdersReport } from "./pages/orders-report";
import { ClientsReport } from "./pages/clients-report";
import { BranchesReport } from "./pages/branches-report";

export const Reports = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}/orders`}
        component={OrdersReport}
      />
      <Route
        path={`${match.path}/clients`}
        component={ClientsReport}
      />
      <Route
        path={`${match.path}/branches`}
        component={BranchesReport}
      />
      <Redirect from={match.path} to={`${match.path}/orders`} />
    </Switch>
  )
};