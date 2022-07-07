import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';

import { ClientsList } from "./pages/clients-list";
import { ClientPage } from "./pages/client-page";

export const Clients = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        exact
        path={`${match.path}/list`}
        component={ClientsList}
      />
      <Route
        path={`${match.path}/list/:id`}
        component={ClientPage}
      />
      <Redirect from={match.path} to={`${match.path}/list`} />
    </Switch>
  )
};