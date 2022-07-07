import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import SignIn from "./screens/auth/pages/sign-in";
import Registration from "./screens/auth/pages/registration";
import ResetPassword from "./screens/auth/pages/reset-password";
import Main from "./screens/main";

import "./styles.scss";
import { Offer } from "./screens/auth/pages/Offer";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/sign-in" component={SignIn} />
        <Route exact path="/offer" component={Offer} />
        <Route exact path="/registration" component={Registration} />
        <Route exact path="/reset-password" component={ResetPassword} />
        <Route path="/" component={Main} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
