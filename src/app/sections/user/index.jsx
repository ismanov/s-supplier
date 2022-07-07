import React from "react";
import { useStore } from "effector-react";
import { Switch, Route, Redirect } from 'react-router-dom';

import effector from "../../screens/main/effector";

import { UserInfo } from "./pages/user-info";
import { Branches } from "./pages/branches";
import { Employees } from "./pages/employees";

const { store, events, effects } = effector;

export const User = (props) => {
  const { $currentUser } = useStore(store);
  const { match } = props;

  return (
    <Switch>
      {$currentUser.data.roles.includes("ROLE_BUSINESS_OWNER") &&
        <Route
          path={`${match.path}/information`}
          component={UserInfo}
        />
      }
      {$currentUser.data.roles.includes("ROLE_BUSINESS_OWNER") &&
        <Route
          path={`${match.path}/branches`}
          component={Branches}
        />
      }
      {($currentUser.data.roles.includes("ROLE_BUSINESS_OWNER") || $currentUser.data.roles.includes("ROLE_BRANCH_ADMIN")) &&
        <Route
          path={`${match.path}/employees`}
          component={Employees}
        />
      }
      <Redirect from={match.path} to={`${match.path}/information`} />
    </Switch>
  );
};