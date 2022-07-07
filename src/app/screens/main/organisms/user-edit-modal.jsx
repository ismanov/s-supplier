import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Button, Form, Input, Modal } from "antd";

import effector from "../effector";

import { FormField } from "ui/molecules/form-field";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { isValidPassword } from "helpers/password-validation";
import { FormState } from "ui/molecules/form-state";
import { CloseModalSvg } from "svgIcons/svg-icons";

const { store, events, effects } = effector;

export const UserEditModal = (props) => {
  const { $currentUser, $updateUser } = useStore(store);

  const { modalProps, setModalProps } = props;

  const [ formFields, setFormFields ] = useState({
    id: $currentUser.data.id,
    firstName: $currentUser.data.firstName,
    lastName: $currentUser.data.lastName,
    patronymic: $currentUser.data.patronymic,
  });
  const [ fieldsErrors, setFieldsErrors ] = useState({});
  const [ passwordWarning, setPasswordWarning ] = useState("");
  const [ confirmPasswordWarning, setConfirmPasswordWarning ] = useState("");

  useEffect(() => {
    if ($updateUser.success) {
      openNotificationWithIcon('success', 'Данные обновлены');
      closeModal();
      effects.getCurrentUserEffect();
    }
  }, [$updateUser.success]);


  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };

  const onPasswordChange = (prop, val) => {
    if (fieldsErrors[prop]) {
      setFieldsErrors({
        ...fieldsErrors,
        password: ""
      })
    }

    if (isValidPassword(val)) {
      setPasswordWarning("");
    } else if (val.length > 16) {
      setPasswordWarning('Максимальное количество символов 16');
    } else {
      setPasswordWarning('Пароль должен состоять минимум из 8 символов, включая в себя цифры, строчная и заглавная буквы');
    }

    onFormFieldChange(prop, val);
  };

  const onConfirmPasswordChange = (prop, val) => {
    if (fieldsErrors[prop]) {
      setFieldsErrors({
        ...fieldsErrors,
        confirmPassword: ""
      })
    }

    if (formFields.password !== val) {
      setConfirmPasswordWarning("Пароли не совпадают");
    } else {
      setConfirmPasswordWarning("");
    }

    onFormFieldChange(prop, val);
  };

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    events.resetUpdateUserEvent();
    setModalProps({ ...modalProps, shouldRender: false, employee: null });
  };

  const validateForm = () => {
    setPasswordWarning("");
    setConfirmPasswordWarning("");

    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!formFields.firstName) errors.firstName = notFilledMessage;
    if (!formFields.lastName) errors.lastName = notFilledMessage;
    if (!formFields.patronymic) errors.patronymic = notFilledMessage;

    if (formFields.password) {
      if (formFields.password.length > 16 ) {
        errors.password = "Максимальное количество символов 16";
      } else {
        if (!isValidPassword(formFields.password)) {
          errors.password = 'Пароль должен состоять минимум из 8 символов, включая в себя цифры, строчная и заглавная буквы';
        }
      }

      if (!formFields.confirmPassword) {
        errors.confirmPassword = notFilledMessage;
      }
    }

    if (formFields.confirmPassword) {
      if (formFields.password !== formFields.confirmPassword) {
        errors.confirmPassword = 'Пароли не совпадают';
      }
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

    const data = {
      id: formFields.id,
      firstName: formFields.firstName,
      lastName: formFields.lastName,
      patronymic: formFields.patronymic,
      password: formFields.password ? formFields.password : undefined,
      confirmPassword: undefined
    };

    effects.updateUserEffect(data);
  };

  return (
    <Modal
      className="custom-modal"
      title="Редактировать профиль"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState error={$updateUser.error} loading={$updateUser.loading} />
      <Form onFinish={onSubmit}>
        <FormField title="Имя" error={fieldsErrors.firstName}>
          <Input
            placeholder="Введите имя"
            value={formFields.firstName}
            onChange={(firstName) => onFormFieldChange("firstName", firstName.target.value)}
          />
        </FormField>
        <FormField title="Фамилия" error={fieldsErrors.lastName}>
          <Input
            placeholder="Введите фамилию"
            value={formFields.lastName}
            onChange={(lastName) => onFormFieldChange("lastName", lastName.target.value)}
          />
        </FormField>
        <FormField title="Отчество" error={fieldsErrors.patronymic}>
          <Input
            placeholder="Введите отчество"
            value={formFields.patronymic}
            onChange={(patronymic) => onFormFieldChange("patronymic", patronymic.target.value)}
          />
        </FormField>
        <FormField className="m-b-25" title="Пароль" note={passwordWarning} error={fieldsErrors.password}>
          <Input.Password
            autoComplete="new-password"
            className="auth-input"
            placeholder="Введите пароль"
            onChange={(password) => onPasswordChange("password", password.target.value)}
          />
        </FormField>
        <FormField className="m-b-25" title="Подтверждение пароля" note={confirmPasswordWarning} error={fieldsErrors.confirmPassword}>
          <Input.Password
            className="auth-input"
            placeholder="Введите пароль"
            onChange={(confirmPassword) => onConfirmPasswordChange("confirmPassword", confirmPassword.target.value)}
          />
        </FormField>
        <div className="custom-modal__button-row">
          <Button htmlType="submit" className="custom-button primary-button fullwidth">Сохранить</Button>
        </div>
      </Form>
    </Modal>
  )
};