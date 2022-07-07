import React, { useState, useEffect }  from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import InputMask from "react-input-mask";
import { Alert, Form, Input, Spin, Button } from "antd";
import Cookies from 'js-cookie';

import effectorMain from "../../main/effector";
import effector from "../effector";

import Auth from "../templates/with-auth-template";
import { FormField } from "ui/molecules/form-field";

import logo from "images/logo.svg";

const { events: mainEvents } = effectorMain;
const { store, events, effects } = effector;

const SignIn = (props) => {
  const { $logIn } = useStore(store);

  const { history } = props;

  const [ formFields, setFormFields ] = useState({
    companyType: "SUPPLIER",
    rememberMe: true,
  });
  const [ fieldsErrors, setFieldsErrors ] = useState({});
  const [ loginValue, setLoginValue ] = useState("+998");

  useEffect(() => {
    Cookies.remove('access-token');
    mainEvents.resetCurrentUserEvent();
  }, []);

  useEffect(() => {
    if ($logIn.success) {
      events.resetlogInEvent();
      history.push('/');
    }
  }, [$logIn]);

  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };

  const customMask = (phone) => {
    const parsedValue = phone.replace(/[^0-9]/g, '');
    if (parsedValue.length === 12) return phone;
    if (parsedValue.length > 12) return phone.slice(0, 19);
    let result = [];
    const value = phone ? phone : "+998";
    const arrayValue = value.split("");
    arrayValue.forEach((char, idx) => {
      if (idx === 4 && char !== " ") {
        result.push(` (${char}`)
      } else if(idx === 7 && arrayValue.length - 1 === idx && typeof Number(char) === "number") {
        result.push(`${char}) `)
      } else if(idx === 9 && char !== " ") {
        result.push(`${char} `)
      } else if((idx === 13 || idx === 16) && char !== " ") {
        result.push(` ${char}`)
      } else {
        result.push(char)
      }
    })
    return result.join("")
  }

  const onLoginChange = (prop, val) => {
    const loginVal = customMask(val)

    onFormFieldChange(prop, loginVal);
    setLoginValue(loginVal);
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!formFields.phone) errors.phone = notFilledMessage;
    if (!formFields.password) errors.password = notFilledMessage;

    return errors;
  };

  const onSubmit = () => {
    Cookies.remove('access-token');

    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});
    const transfer = {
      ...formFields,
      phone: formFields.phone.replace(/[^0-9]/g, '')
    }

    effects.logInEffect(transfer);
  };

  return (
    <Auth>
      <Form onFinish={onSubmit}>
        <div className="auth-wrapper__form_logo">
          <img src={logo} alt="logo"/>
          <span>Вход в личный кабинет</span>
        </div>
        {$logIn.error && <div className="m-b-20">
          <Alert message="Неверно введены логин или пароль" type="error" />
        </div>}
        {$logIn.loading && <div className="abs-loader">
          <Spin size="large"/>
        </div>}
        <FormField title="Телефон" error={fieldsErrors.phone}>
          <Input
            className="ant-input auth-input"
            value={loginValue}
            disabled={$logIn.loading}
            onChange={(phone) => {
              onLoginChange("phone", phone.target.value)
            }}
          />
          {/*<InputMask*/}
          {/*  className="ant-input auth-input"*/}
          {/*  mask="+\9\98 (99) 999 99 99"*/}
          {/*  maskChar="*"*/}
          {/*  value={loginValue}*/}
          {/*  disabled={$logIn.loading}*/}
          {/*  onChange={(phone) => onLoginChange("phone", phone.target.value.replace(/[^0-9]/g, ''))}*/}
          {/*/>*/}
        </FormField>
        <FormField className="m-b-25" error={fieldsErrors.password}>
          <Input.Password
            className="auth-input"
            placeholder="Пароль"
            disabled={$logIn.loading}
            onChange={(password) => onFormFieldChange("password", password.target.value)}
          />
        </FormField>
        <Button
          className="custom-button success-button fullwidth large b-r-30"
          htmlType="submit"
          disabled={$logIn.loading}
        >
          ВОЙТИ
        </Button>
      </Form>
      <div className="auth-wrapper__form__links">
        <Link to="/registration">Регистрация</Link>
        <Link to="/reset-password">Забыли пароль ?</Link>
      </div>
    </Auth>
  )
};

export default SignIn;