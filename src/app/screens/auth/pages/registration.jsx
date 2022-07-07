import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import effectorMain from "../../main/effector";
import effector from "../effector";

import Auth from "../templates/with-auth-template";

import { RegistrationStep1 } from "../organisms/registration-step1";
import { RegistrationStep2 } from "../organisms/registration-step2";
import { RegistrationStep3 } from "../organisms/registration-step3";

const { events: mainEvents } = effectorMain;
const { store, events } = effector;

const Registration = () => {
  const { $registrationStep } = useStore(store);

  const [ phone, setPhone ] = useState("998");

  useEffect(() => {
    Cookies.remove('access-token');
    mainEvents.resetCurrentUserEvent();

    return () => {
      events.resetRegistrationStoreEvent()
    }
  }, []);

  const { step } = $registrationStep;

  return (
    <Auth>
      {step === 1 ? (
        <RegistrationStep1 setPhone={setPhone} />
      ): step === 2 ? (
        <RegistrationStep2 phone={phone} />
      ): <RegistrationStep3 phone={phone} />}
      <div className="auth-wrapper__form__links links-centered">
        <Link to="/sign-in">Авторизация</Link>
      </div>
    </Auth>
  )
};

export default Registration;