import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { Invoices } from "./pages/invoices-list";
import { Invoice } from "./pages/invoice";

import { OutgoingInvoicesList } from "./pages/outgoing-invoices-list";
import { OutgoingInvoice } from "./pages/outgoing-invoice";

export const InvoicesRoot = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route exact path={`/invoices/incoming`} component={Invoices} />
      <Route exact path={`/invoices/incoming/:id`} component={Invoice} />
      <Route exact path={`/invoices/outgoing`} component={OutgoingInvoicesList} />
      <Route exact path={`/invoices/outgoing/:id`} component={OutgoingInvoice} />
      <Redirect from={match.path} to={`/invoices/incoming`} />
    </Switch>
  );
};
