import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';

import { CatalogAll } from "./pages/catalog-all";
import { CatalogSingle } from "./pages/catalog-single";

import "./styles.scss";

export const Catalog = (props) => {
  const { match } = props;

  return (
      <Switch>
        <Route
          path={`${match.path}/all`}
          component={CatalogAll}
        />
        <Route
          path={`${match.path}/single`}
          component={CatalogSingle}
        />
        <Redirect from={match.path} to={`${match.path}/all`} />
      </Switch>
  )
};