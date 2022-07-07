import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';

import { AggregationList } from "./pages/aggregation-list";
import { AggregationAdd } from "./pages/aggregation-add";
import { AggregationDetails } from "./pages/aggregation-details";
import { AggregationOrdersList } from "./pages/aggregation-orders-list";
import { AggregationOrderPrint } from "./pages/aggregation-order-print";

import "./styles.scss";

export const Aggregation = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        exact
        path={`${match.path}/list`}
        component={AggregationList}
      />
      <Route
        exact
        path={`${match.path}/list/add`}
        component={AggregationAdd}
      />
      <Route
        exact
        path={`${match.path}/list/:id`}
        component={AggregationDetails}
      />
      <Route
        exact
        path={`${match.path}/orders`}
        component={AggregationOrdersList}
      />
      <Route
        exact
        path={`${match.path}/orders/:batchId`}
        component={AggregationList}
      />
      <Route
        exact
        path={`${match.path}/orders/:batchId/print`}
        component={AggregationOrderPrint}
      />
      <Redirect from={match.path} to={`${match.path}/list`}/>
    </Switch>
  )
};