import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, Alert, Spin } from "antd";

import effector from "../effector";

import logo from "images/logo.svg";
import { FormField } from "ui/molecules/form-field";
import { isValidPassword } from "helpers/password-validation";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import Cookies from "js-cookie";

const { store, effects, events } = effector;

const buttonDisable = (fields) => {
  return !(fields.password && fields.confirmPassword)
};

const FormState = ({ error, loading }) => {
  return (
    <div>
      {error && <div className="m-b-20">
        <Alert message={error.detail || error.title} type="error"/>
      </div>}
      {loading && <div className="abs-loader">
        <Spin size="large"/>
      </div>}
    </div>
  )
};

export const RegistrationStep3 = (props) => {
  const history = useHistory();
  const { phone } = props;

  const { $finishRegistration } = useStore(store);

  const [ formFields, setFormFields ] = useState({
    phone
  });
  const [ fieldsErrors, setFieldsErrors ] = useState({});
  const [ passwordWarning, setPasswordWarning ] = useState("");
  const [ confirmPasswordWarning, setConfirmPasswordWarning ] = useState("");


  useEffect(() => {
    if ($finishRegistration.success) {
      Cookies.remove('access-token');
      openNotificationWithIcon("success", "Регистрация прошла успешна");
      events.resetlogInEvent();
      events.resetRegistrationStoreEvent();
      history.push('/sign-in');
    }
  }, [$finishRegistration.success]);


  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };

  const onPasswordChange = (prop, val) => {
    if (!fieldsErrors[prop]) {
      if (isValidPassword(val)) {
        setPasswordWarning("");
      } else if (val.length > 16) {
        setPasswordWarning('Максимальное количество символов 16');
      } else {
        setPasswordWarning('Пароль должен состоять минимум из 8 символов, включая в себя цифры, строчная и заглавная буквы');
      }
    }

    onFormFieldChange(prop, val);
  };

  const onConfirmPasswordChange = (prop, val) => {
    if (!fieldsErrors[prop]) {
      if (formFields.password !== val) {
        setConfirmPasswordWarning("Пароли не совпадают");
      } else {
        setConfirmPasswordWarning("");
      }
    }

    onFormFieldChange(prop, val);
  };

  const validateForm = () => {
    setPasswordWarning("");
    setConfirmPasswordWarning("");

    const errors = {};

    if (formFields.password.length > 16 ) {
      errors.password = "Максимальное количество символов 16";
    } else {
      if (!isValidPassword(formFields.password)) {
        errors.password = 'Пароль должен состоять минимум из 8 символов, включая в себя цифры, строчная и заглавная буквы';
      }
    }

    if (formFields.password !== formFields.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    return errors;
  };

  const onSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    effects.finishRegistrationEffect(formFields)
  };

  return (
    <Form onFinish={onSubmit}>
      <div className="auth-wrapper__form_logo">
        <img src={logo} alt="logo"/>
        <span>Придумайте пароль</span>
      </div>
      <FormState error={$finishRegistration.error} loading={$finishRegistration.loading} />
      <FormField className="m-b-25" note={passwordWarning} error={fieldsErrors.password}>
        <Input.Password
          autoComplete="new-password"
          className="auth-input"
          placeholder="Пароль"
          disabled={$finishRegistration.loading}
          onChange={(password) => onPasswordChange("password", password.target.value)}
        />
      </FormField>
      <FormField className="m-b-25" note={confirmPasswordWarning} error={fieldsErrors.confirmPassword}>
        <Input.Password
          className="auth-input"
          placeholder="Повторите пароль"
          disabled={$finishRegistration.loading}
          onChange={(confirmPassword) => onConfirmPasswordChange("confirmPassword", confirmPassword.target.value)}
        />
      </FormField>
      <Button
        htmlType="submit"
        className="custom-button success-button fullwidth large b-r-30"
        disabled={buttonDisable(formFields)}
      >
        ЗАРЕГИСТРИРОВАТЬСЯ
      </Button>
    </Form>
  )
};