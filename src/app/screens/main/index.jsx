import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Route, Switch } from "react-router-dom";

import effector from "./effector";

import Header from "./templates/header";

import { Dashboard } from "../../sections/dashboard";
import { User } from "../../sections/user";
import { Catalog } from "../../sections/catalog";
import { Clients } from "../../sections/clients";
import { Warehouse } from "../../sections/warehouse";
import { InvoicesRoot } from "./../../sections/Invoices/index";
import { Aggregation } from "../../sections/aggregation";
import { Orders } from "../../sections/orders";
import { Reports } from "../../sections/reports";

import { MainLoaderSvg } from "svgIcons/svg-icons";

import "./styles.scss";

const { store, events, effects } = effector;

const Main = () => {
  const { $currentUser } = useStore(store);

  const { data: currentUser } = $currentUser;

  useEffect(() => {
    effects.getCurrentUserEffect();
    effects.getUnitItemsEffect();

    return () => {
      events.resetCurrentUserEvent();
      events.resetUnitItemsEvent();
    };
  }, []);

  if (!currentUser) {
    return (
      <div className="abs-loader main-loader">
        <MainLoaderSvg />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="site-content-wr">
        <div className="site-content">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/user" component={User} />
            {($currentUser.data.roles.includes("ROLE_BUSINESS_OWNER") ||
              $currentUser.data.roles.includes("ROLE_BRANCH_ADMIN")) && (
              <Route path="/catalog" component={Catalog} />
            )}
            {($currentUser.data.roles.includes("ROLE_BUSINESS_OWNER") ||
              $currentUser.data.roles.includes("ROLE_BRANCH_ADMIN")) && (
              <Route path="/clients" component={Clients} />
            )}
            {($currentUser.data.roles.includes("ROLE_BUSINESS_OWNER") ||
              $currentUser.data.roles.includes("ROLE_BRANCH_ADMIN")) && (
              <Route path="/warehouse" component={Warehouse} />
            )}
            {($currentUser.data.roles.includes("ROLE_BUSINESS_OWNER") ||
              $currentUser.data.roles.includes("ROLE_BRANCH_ADMIN")) && (
              <Route path="/invoices" component={InvoicesRoot} />
            )}
            {($currentUser.data.roles.includes("ROLE_BUSINESS_OWNER") ||
              $currentUser.data.roles.includes("ROLE_BRANCH_ADMIN")) && (
              <Route path="/aggregation" component={Aggregation} />
            )}
            <Route path="/orders" component={Orders} />
            {($currentUser.data.roles.includes("ROLE_BUSINESS_OWNER") ||
              $currentUser.data.roles.includes("ROLE_BRANCH_ADMIN")) && (
              <Route path="/reports" component={Reports} />
            )}
          </Switch>
        </div>
      </div>
    </>
  );
};

export default Main;