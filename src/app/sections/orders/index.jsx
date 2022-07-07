import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';

import { OrdersList } from "./pages/orders-list";
import { OrderPage } from "./pages/order-page";

import "./styles.scss";

export const Orders = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        exact
        path={`${match.path}/list`}
        component={OrdersList}
      />
      <Route
        path={`${match.path}/list/:id`}
        component={OrderPage}
      />
      <Redirect from={match.path} to={`${match.path}/list`} />
    </Switch>
  )
};