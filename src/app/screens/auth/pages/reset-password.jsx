import React, { useState, useEffect }  from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import { Button } from "antd";

import effectorMain from "../../main/effector";
import effector from "../effector";

import { ResetPasswordStep1 } from "../organisms/reset-password-step1";
import { ResetPasswordStep2 } from "../organisms/reset-password-step2";
import { ResetPasswordStep3 } from "../organisms/reset-password-step3";
import Auth from "../templates/with-auth-template";
import {openNotificationWithIcon} from "helpers/open-notification-with-icon";
import Cookies from "js-cookie";

const { events: mainEvents } = effectorMain;
const { store, effects, events } = effector;

const ResetPassword = () => {
  const { $resetPasswordStep, $resetPasswordResendSmsCode } = useStore(store);
  const [ phone, setPhone ] = useState("998");

  const { step } = $resetPasswordStep;

  useEffect(() => {
    Cookies.remove('access-token');
    mainEvents.resetCurrentUserEvent();
    events.resetResetPasswordStoreEvent();
  }, []);

  useEffect(() => {
    if ($resetPasswordResendSmsCode.success) {
      openNotificationWithIcon("success", "SMS с кодом отправлено");
      events.resetPasswordResendSmsCodeEvent()
    }
  }, [$resetPasswordResendSmsCode.success]);

  const onResendSmsCode = () => {
    effects.resetPasswordResendSmsCodeEffect({
      phone
    })
  };

  return (
    <Auth>
      {step === 2 ? (
        <ResetPasswordStep2 phone={phone} />
      ): step === 3 ? (
        <ResetPasswordStep3 phone={phone} />
      ): (
        <ResetPasswordStep1 setPhone={setPhone} />
      )}
      <div className={`auth-wrapper__form__links ${step !== 2 ? "links-centered": ""}`}>
        {step === 2 && <Button type="link" onClick={onResendSmsCode}>Отправить код снова</Button>}
        <Link to="/sign-in">Авторизация</Link>
      </div>
    </Auth>
  )
};

export default ResetPassword;