import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Switch, Route } from 'react-router-dom';

import effector from "../../screens/main/effector";

import { DashboardMain } from "./page/dashboard-main";

const { store } = effector;

export const Dashboard = (props) => {
  const { $currentUser } = useStore(store);
  const { match, history } = props;

  useEffect(() => {
    if ($currentUser.data.roles.length === 1 && $currentUser.data.roles.includes("ROLE_COURIER")) {
      history.push("/orders/list")
    }
  }, []);

  return (
    <Switch>
      {($currentUser.data.roles.includes("ROLE_BUSINESS_OWNER") || $currentUser.data.roles.includes("ROLE_BRANCH_ADMIN") || $currentUser.data.roles.includes("ROLE_AGENT")) &&
        <Route
          path={`${match.path}`}
          component={DashboardMain}
        />
      }
    </Switch>
  )
};